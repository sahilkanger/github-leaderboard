// Collects GitHub users who list a US state in their profile location, and their contributions
// over the last year. Resumable: progress is saved under data/ and skipped on the next run.
//   GH_TOKEN=$(gh auth token) node collect.mjs
// Phase 1 searches users by state (full name, then "City, ST"); phase 2 reads each user's
// contribution totals through the GraphQL API in small batches.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { stateOf } from "./states.mjs";

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) throw new Error("GH_TOKEN is not set");
const DATA = new URL("./data/", import.meta.url);
mkdirSync(DATA, { recursive: true });
const file = (n) => new URL(n, DATA);
const load = (n, d) => (existsSync(file(n)) ? JSON.parse(readFileSync(file(n), "utf8")) : d);
const save = (n, v) => writeFileSync(file(n), JSON.stringify(v));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
const H = { Authorization: `Bearer ${TOKEN}`, "User-Agent": "state-leaderboard-script", Accept: "application/vnd.github+json" };

export const STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

// ---------------------------------------------------------------- phase 1: search
let lastSearch = 0;
async function search(q, sort, page) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const gap = 2100 - (Date.now() - lastSearch); // 30 searches a minute
    if (gap > 0) await sleep(gap);
    lastSearch = Date.now();
    const url = `https://api.github.com/search/users?q=${encodeURIComponent(q)}&sort=${sort}&order=desc&per_page=100&page=${page}`;
    const r = await fetch(url, { headers: H });
    if (r.status === 200) return r.json();
    if (r.status === 422) return { total_count: 0, items: [] }; // past the 1,000-result cap
    const retry = Number(r.headers.get("retry-after"));
    const reset = Number(r.headers.get("x-ratelimit-reset"));
    const wait = retry ? retry * 1000 : reset ? Math.max(2000, reset * 1000 - Date.now() + 1000) : 30000;
    log(`search ${r.status}; waiting ${Math.round(wait / 1000)}s`);
    await sleep(wait);
  }
  throw new Error(`search failed: ${q}`);
}

async function phase1() {
  const cands = load("candidates.json", {});
  for (const [ab, name] of STATES) {
    if (cands[ab]?.done) continue;
    const logins = new Set();
    let total = 0;
    const take = async (q, sort, pages) => {
      for (let p = 1; p <= pages; p++) {
        const r = await search(q, sort, p);
        if (sort === "followers" && p === 1 && q.includes(`"${name}"`)) total = r.total_count;
        for (const it of r.items ?? []) logins.add(it.login);
        if ((r.items ?? []).length < 100) break;
      }
    };
    await take(`location:"${name}" type:user`, "followers", 3);
    await take(`location:"${name}" type:user`, "repositories", 3);
    await take(`location:"${ab}" type:user`, "repositories", 2);
    cands[ab] = { total, logins: [...logins], done: true };
    save("candidates.json", cands);
    log(`${ab}: ${logins.size} candidates (${total} users list "${name}")`);
  }
  return cands;
}

// ---------------------------------------------------------------- phase 2: contributions
const FIELDS = `login name location followers { totalCount } contributionsCollection {
  totalCommitContributions totalIssueContributions totalPullRequestContributions
  totalPullRequestReviewContributions totalRepositoryContributions restrictedContributionsCount
  contributionCalendar { totalContributions } }`;

async function gql(query, onLimited) {
  for (let attempt = 0; attempt < 8; attempt++) {
    let r;
    try {
      r = await fetch("https://api.github.com/graphql", { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    } catch {
      await sleep(5000 * (attempt + 1));
      continue;
    }
    const text = await r.text();
    if (r.status === 200) {
      try {
        const j = JSON.parse(text);
        if (j.data) return j.data;
      } catch {}
    }
    if (r.status === 403 || r.status === 429) {
      onLimited?.();
      const retry = Number(r.headers.get("retry-after"));
      const wait = retry ? retry * 1000 : 60000 * (attempt + 1);
      log(`graphql ${r.status}; waiting ${Math.round(wait / 1000)}s`);
      await sleep(wait);
    } else {
      await sleep(4000 * (attempt + 1));
    }
  }
  return null;
}

function pick(u) {
  const c = u.contributionsCollection;
  return {
    name: u.name ?? "",
    location: u.location ?? "",
    followers: u.followers.totalCount,
    total: c.contributionCalendar.totalContributions,
    commits: c.totalCommitContributions,
    prs: c.totalPullRequestContributions,
    reviews: c.totalPullRequestReviewContributions,
    issues: c.totalIssueContributions,
    repos: c.totalRepositoryContributions,
    private: c.restrictedContributionsCount,
  };
}

// Phase 2a: cheap facts for everyone (100 a query): location, last push, and activity proxies.
const PROFILE = `location followers { totalCount }
  repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
  pushed: repositories(first: 1, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) { nodes { pushedAt } }`;

async function profiles(all) {
  const prof = load("profiles.json", {});
  const todo = all.filter((l) => !(l in prof));
  log(`profiles: ${todo.length} to look up`);
  const batches = [];
  for (let i = 0; i < todo.length; i += 50) batches.push(todo.slice(i, i + 50));
  let n = 0;
  const worker = async () => {
  while (batches.length) {
    const batch = batches.shift();
    const q = `query { ${batch.map((l, i) => `u${i}: user(login: ${JSON.stringify(l)}) { ${PROFILE} }`).join(" ")} }`;
    const d = await gql(q);
    batch.forEach((l, i) => {
      const u = d?.[`u${i}`];
      prof[l] = u
        ? { location: u.location ?? "", followers: u.followers.totalCount, repos: u.repositories.totalCount, pushed: u.pushed.nodes[0]?.pushedAt ?? null }
        : null;
    });
    if (++n % 40 === 0) {
      save("profiles.json", prof);
      log(`profiles: ${n * 50}/${todo.length}`);
    }
  }
  };
  await Promise.all([worker(), worker()]);
  save("profiles.json", prof);
  return prof;
}

// Who gets the expensive contribution lookup: per state, the K likeliest to be most active among
// people who pushed in the last year; everyone active in Louisiana (for the parish breakdown).
const K = Number(process.env.PER_STATE ?? 80);
// The states to look up now (SCOPE=all for every state): the Census South, plus Missouri.
export const SOUTH = ["AL", "AR", "DE", "FL", "GA", "KY", "LA", "MD", "MS", "NC", "OK", "SC", "TN", "TX", "VA", "WV", "MO"];
const SCOPE = process.env.SCOPE === "all" ? null : new Set((process.env.SCOPE ?? SOUTH.join(",")).split(","));
function select(prof, extra) {
  const yearAgo = Date.now() - 365 * 86400000;
  const byState = {};
  for (const [login, p] of Object.entries(prof)) {
    if (!p) continue;
    const st = stateOf(p.location);
    if (!st || (SCOPE && !SCOPE.has(st))) continue;
    const active = p.pushed && Date.parse(p.pushed) >= yearAgo;
    if (!active) continue;
    const score = 2 * p.repos + p.followers / 5;
    (byState[st] ??= []).push([login, score]);
  }
  const chosen = new Set(extra);
  for (const [st, list] of Object.entries(byState)) {
    list.sort((a, b) => b[1] - a[1]);
    for (const [login] of list.slice(0, st === "LA" ? 500 : K)) chosen.add(login);
  }
  return [...chosen];
}

// Phase 2b: contributions, paced to GitHub's secondary limit on GraphQL compute time.
async function phase2(cands, extra) {
  const users = load("users.json", {});
  const everyone = [
    ...new Set([
      ...extra,
      ...Object.entries(cands)
        .filter(([key]) => !SCOPE || SCOPE.has(key) || (key === "LA_CITIES" && SCOPE.has("LA")))
        .flatMap(([, s]) => s.logins),
    ]),
  ];
  const prof = await profiles(everyone);
  const chosen = select(prof, extra);
  const todo = chosen.filter((l) => !(l in users));
  log(`${chosen.length} chosen for contributions (${K} a state; Louisiana all active), ${todo.length} to fetch`);
  const SIZE = 8;
  const batches = [];
  for (let i = 0; i < todo.length; i += SIZE) batches.push(todo.slice(i, i + SIZE));
  let done = 0;
  let sinceSave = 0;
  let width = 2; // workers allowed at once; drops on a 403 and recovers slowly
  let running = 0;
  let calm = 0;
  const one = async (batch) => {
    const q = `query { ${batch.map((l, i) => `u${i}: user(login: ${JSON.stringify(l)}) { ${FIELDS} }`).join(" ")} }`;
    const d = await gql(q, () => {
      width = 1;
      calm = 0;
    });
    if (d) {
      batch.forEach((l, i) => {
        users[l] = d[`u${i}`] ? pick(d[`u${i}`]) : null;
      });
      if (++calm >= 40 && width < 3) {
        width++;
        calm = 0;
      }
    } else if (batch.length > 1) {
      for (const l of batch) await one([l]);
    } else {
      users[batch[0]] = null;
    }
  };
  await new Promise((resolve) => {
    const pump = () => {
      if (!batches.length && running === 0) return resolve();
      while (running < width && batches.length) {
        const b = batches.shift();
        running++;
        one(b).then(() => {
          running--;
          done += b.length;
          if (++sinceSave >= 25) {
            sinceSave = 0;
            save("users.json", users);
            log(`${done}/${todo.length} users (width ${width})`);
          }
          pump();
        });
      }
    };
    pump();
  });
  save("users.json", users);
  log(`phase 2 done: ${Object.keys(users).length} users`);
}

// Louisiana, deeper: people who give only a city, for the parish breakdown.
export const LA_CITIES = [
  "New Orleans", "Baton Rouge", "Shreveport", "Lake Charles", "Metairie", "Kenner", "Houma", "Slidell",
  "Bossier City", "Ruston", "Thibodaux", "Natchitoches", "Mandeville", "Denham Springs", "Prairieville",
  "Opelousas", "New Iberia", "West Monroe", "Lake Providence", "Chalmette", "Ponchatoula", "Breaux Bridge",
  "Bogalusa", "LaPlace", "Broussard", "Marrero", "Harahan", "DeRidder", "Tallulah", "Mer Rouge",
];
async function phase1b(cands) {
  if (cands.LA_CITIES?.done) return cands;
  const logins = new Set();
  for (const city of LA_CITIES) {
    for (const [sort, pages] of [["followers", 2], ["repositories", 1]]) {
      for (let p = 1; p <= pages; p++) {
        const r = await search(`location:"${city}" type:user`, sort, p);
        for (const it of r.items ?? []) logins.add(it.login);
        if ((r.items ?? []).length < 100) break;
      }
    }
  }
  cands.LA_CITIES = { total: 0, logins: [...logins], done: true };
  save("candidates.json", cands);
  log(`LA_CITIES: ${logins.size} candidates from Louisiana city names`);
  return cands;
}

const cands = await phase1b(await phase1());
await phase2(cands, ["wbp318"]);
log("collection complete");

// Builds site/leaderboard.html from data/: each person placed in a state from their profile
// location (src/states.mjs), then regions, divisions, states, Louisiana parishes, and rankings by
// category, written into web/template.html.
//   node scripts/build.mjs   (or: npm run build)
//   VIEWER=<login>   whose ranks the page shows as "you" (they must be in data/users.json)
//   SCOPE=LA,MS,AR   only some states (default: all)
import { readFileSync, writeFileSync } from "node:fs";
import { PARISHES, parishOf } from "../src/parishes.mjs";
import { stateOf } from "../src/states.mjs";

const VIEWER = process.env.VIEWER ?? "wbp318";
const SCOPE = process.env.SCOPE && process.env.SCOPE !== "all" ? new Set(process.env.SCOPE.split(",")) : null;
const SCOPE_NAME = SCOPE ? "the states chosen" : "the United States";
const cands = JSON.parse(readFileSync(new URL("../data/candidates.json", import.meta.url), "utf8"));
const users = JSON.parse(readFileSync(new URL("../data/users.json", import.meta.url), "utf8"));
const profiles = JSON.parse(readFileSync(new URL("../data/profiles.json", import.meta.url), "utf8"));
// States are compared on the same sample everywhere: the collector's rule, the PER_STATE likeliest
// to be most active among people who pushed in the last year. Louisiana has more (everyone active),
// used only for Louisiana's own view and its parishes.
const PER_STATE = Number(process.env.PER_STATE ?? 80);
// Accounts named as bots or tests (openshift-cherrypick-robot, redhat-chai-bot, amplify-github-test-hkg)
// are automation, not people.
const BOT = /(?:^|[-_.])(?:ro)?bot(?:[-_.]|$)|\[bot\]$|(?:^|[-_])test(?:[-_]|$)/i;
// People who asked to be left off (src/opt-out.txt).
const OPT_OUT = new Set(
  readFileSync(new URL("../src/opt-out.txt", import.meta.url), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim().toLowerCase())
    .filter((l) => l && !l.startsWith("#")),
);

const STATES = [
  ["AL", "Alabama", "South", "East South Central"], ["AK", "Alaska", "West", "Pacific"],
  ["AZ", "Arizona", "West", "Mountain"], ["AR", "Arkansas", "South", "West South Central"],
  ["CA", "California", "West", "Pacific"], ["CO", "Colorado", "West", "Mountain"],
  ["CT", "Connecticut", "Northeast", "New England"], ["DE", "Delaware", "South", "South Atlantic"],
  ["FL", "Florida", "South", "South Atlantic"], ["GA", "Georgia", "South", "South Atlantic"],
  ["HI", "Hawaii", "West", "Pacific"], ["ID", "Idaho", "West", "Mountain"],
  ["IL", "Illinois", "Midwest", "East North Central"], ["IN", "Indiana", "Midwest", "East North Central"],
  ["IA", "Iowa", "Midwest", "West North Central"], ["KS", "Kansas", "Midwest", "West North Central"],
  ["KY", "Kentucky", "South", "East South Central"], ["LA", "Louisiana", "South", "West South Central"],
  ["ME", "Maine", "Northeast", "New England"], ["MD", "Maryland", "South", "South Atlantic"],
  ["MA", "Massachusetts", "Northeast", "New England"], ["MI", "Michigan", "Midwest", "East North Central"],
  ["MN", "Minnesota", "Midwest", "West North Central"], ["MS", "Mississippi", "South", "East South Central"],
  ["MO", "Missouri", "Midwest", "West North Central"], ["MT", "Montana", "West", "Mountain"],
  ["NE", "Nebraska", "Midwest", "West North Central"], ["NV", "Nevada", "West", "Mountain"],
  ["NH", "New Hampshire", "Northeast", "New England"], ["NJ", "New Jersey", "Northeast", "Middle Atlantic"],
  ["NM", "New Mexico", "West", "Mountain"], ["NY", "New York", "Northeast", "Middle Atlantic"],
  ["NC", "North Carolina", "South", "South Atlantic"], ["ND", "North Dakota", "Midwest", "West North Central"],
  ["OH", "Ohio", "Midwest", "East North Central"], ["OK", "Oklahoma", "South", "West South Central"],
  ["OR", "Oregon", "West", "Pacific"], ["PA", "Pennsylvania", "Northeast", "Middle Atlantic"],
  ["RI", "Rhode Island", "Northeast", "New England"], ["SC", "South Carolina", "South", "South Atlantic"],
  ["SD", "South Dakota", "Midwest", "West North Central"], ["TN", "Tennessee", "South", "East South Central"],
  ["TX", "Texas", "South", "West South Central"], ["UT", "Utah", "West", "Mountain"],
  ["VT", "Vermont", "Northeast", "New England"], ["VA", "Virginia", "South", "South Atlantic"],
  ["WA", "Washington", "West", "Pacific"], ["WV", "West Virginia", "South", "South Atlantic"],
  ["WI", "Wisconsin", "Midwest", "East North Central"], ["WY", "Wyoming", "West", "Mountain"],
];
const BY_AB = Object.fromEntries(STATES.map(([ab, name, region, division]) => [ab, { ab, name, region, division }]));

// ---------------------------------------------------------------- place everyone
const people = [];
for (const [login, u] of Object.entries(users)) {
  if (!u || OPT_OUT.has(login.toLowerCase()) || BOT.test(login)) continue;
  const ab = stateOf(u.location);
  if (!ab || (SCOPE && !SCOPE.has(ab))) continue;
  const s = BY_AB[ab];
  const parish = ab === "LA" ? (parishOf(u.location) ?? "") : "";
  people.push({ login, ...u, state: ab, region: s.region, division: s.division, parish });
}
{
  const yearAgo = Date.now() - 365 * 86400000;
  const byState = {};
  for (const p of people) {
    const pr = profiles[p.login];
    p.fair = false;
    if (!pr || !pr.pushed || Date.parse(pr.pushed) < yearAgo) continue;
    (byState[p.state] ??= []).push([p, 2 * pr.repos + pr.followers / 5]);
  }
  for (const list of Object.values(byState)) {
    list.sort((a, b) => b[1] - a[1]);
    for (const [p] of list.slice(0, PER_STATE)) p.fair = true;
  }
}
const fair = people.filter((p) => p.fair);
const CATS = ["total", "commits", "private", "prs", "reviews", "issues", "repos", "followers"];
const sum = (list, k) => list.reduce((a, p) => a + p[k], 0);
const median = (xs) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const agg = (list) => {
  const out = { people: list.length, active: list.filter((p) => p.total > 0).length };
  for (const k of CATS) out[k] = sum(list, k);
  out.average = list.length ? out.total / list.length : 0;
  out.median = median(list.map((p) => p.total));
  const top = [...list].sort((a, b) => b.total - a.total)[0];
  out.top = top ? { login: top.login, total: top.total } : null;
  return out;
};
const states = STATES.map(([ab, name, region, division]) => {
  const list = people.filter((p) => p.state === ab);
  return { ab, name, region, division, counted: !SCOPE || SCOPE.has(ab), listing: cands[ab]?.total ?? 0, ...agg(list.filter((p) => p.fair)), all: agg(list) };
});
const regionNames = ["Northeast", "Midwest", "South", "West"];
const regions = regionNames.map((r) => ({ name: r, ...agg(fair.filter((p) => p.region === r)) })).filter((r) => r.people > 0);
const divisionNames = [...new Set(STATES.map((s) => s[3]))];
const divisions = divisionNames.map((d) => ({ name: d, region: STATES.find((s) => s[3] === d)[2], ...agg(fair.filter((p) => p.division === d)) })).filter((d) => d.people > 0);
const us = agg(fair);
const la = people.filter((p) => p.state === "LA");
const parishes = [...PARISHES, ""].map((name) => ({ name: name || "Parish not given", ...agg(la.filter((p) => p.parish === name)) }));

// Compact people: [login, name, state, total, commits, private, prs, reviews, issues, repos, followers, parish, fair, location]
const P = people.map((p) => [p.login, p.name, p.state, p.total, p.commits, p.private, p.prs, p.reviews, p.issues, p.repos, p.followers, p.parish, p.fair ? 1 : 0, (p.location ?? "").trim()]);
const me = people.find((p) => p.login === VIEWER) ?? null;
const data = { generated: new Date().toISOString(), scopeName: SCOPE_NAME, perState: PER_STATE, compared: fair.length, viewer: VIEWER, me, us, regions, divisions, states, parishes, P, candidates: Object.values(cands).reduce((a, s) => a + s.logins.length, 0), fetched: Object.keys(users).length };

const tpl = readFileSync(new URL("../web/template.html", import.meta.url), "utf8");
writeFileSync(new URL("../site/leaderboard.html", import.meta.url), tpl.replace("/*__DATA__*/null", () => JSON.stringify(data).replace(/</g, String.fromCharCode(92) + "x3c")));
console.log(`placed ${people.length} of ${Object.keys(users).length} users in a state (${fair.length} in the per-state sample); leaderboard.html written`);
if (me) console.log(`you: ${me.state}, ${me.total} contributions`);

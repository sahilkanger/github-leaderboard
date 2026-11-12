// Builds leaderboard.html from data/candidates.json and data/users.json: each user placed in a
// state from their profile location, then regions, divisions, states, and rankings by category.
//   node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { laOnlyRe, PARISHES, parishOf } from "./parishes.mjs";
import { stateOf as sharedStateOf } from "./states.mjs";

const VIEWER = "wbp318";
// The states counted so far (SCOPE=all for every state).
const SOUTH = ["AL", "AR", "DE", "FL", "GA", "KY", "LA", "MD", "MS", "NC", "OK", "SC", "TN", "TX", "VA", "WV", "MO"];
const SCOPE = process.env.SCOPE === "all" ? null : new Set((process.env.SCOPE ?? SOUTH.join(",")).split(","));
const SCOPE_NAME = !SCOPE ? "the United States" : process.env.SCOPE ? "the states chosen" : "the South and Missouri";
const cands = JSON.parse(readFileSync(new URL("./data/candidates.json", import.meta.url), "utf8"));
const users = JSON.parse(readFileSync(new URL("./data/users.json", import.meta.url), "utf8"));
const profiles = JSON.parse(readFileSync(new URL("./data/profiles.json", import.meta.url), "utf8"));
// States are compared on the same sample everywhere: the collector's rule, the PER_STATE likeliest
// to be most active among people who pushed in the last year. Louisiana has more (everyone active),
// used only for Louisiana's own view and its parishes.
const PER_STATE = Number(process.env.PER_STATE ?? 80);

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
const BY_LENGTH = [...STATES].sort((a, b) => b[1].length - a[1].length);
const NAME_RE = BY_LENGTH.map(([ab, name]) => [ab, new RegExp(`\\b${name.replace(/ /g, "\\s+")}\\b`, "i")]);

// "City, XX" abbreviations shared with other countries: reject the foreign ones.
const FOREIGN = {
  CA: /canada|toronto|vancouver|montr[eé]al|ottawa|calgary|edmonton|winnipeg|ontario|qu[eé]bec|alberta|british columbia|halifax|victoria,\s*bc/i,
  IN: /india|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata|noida|gurgaon|gurugram|ahmedabad|jaipur|kochi|kerala|lucknow|indore|bhopal|nagpur|surat|coimbatore/i,
  DE: /germany|deutschland|berlin|munich|m[uü]nchen|hamburg|frankfurt|cologne|k[oö]ln|stuttgart|dresden|leipzig|d[uü]sseldorf|karlsruhe/i,
  GA: /tbilisi|gabon|libreville/i,
  CO: /colombia|bogot[aá]|medell[ií]n|\bcali\b|barranquilla/i,
  MA: /morocco|casablanca|rabat|marrakech|tangier/i,
  PA: /panam[aá]|pakistan/i,
  AL: /albania|tirana/i,
  ME: /montenegro|podgorica/i,
  MD: /moldova|chi[sș]in[aă]u/i,
  NE: /niger\b|niamey/i,
  SC: /seychelles/i,
  SD: /sudan|khartoum/i,
  TN: /tunisia|tunis\b/i,
  MT: /malta|valletta/i,
  MN: /mongolia|ulaanbaatar/i,
  ID: /indonesia|jakarta|bandung|surabaya|yogyakarta/i,
  AR: /argentina|buenos aires|c[oó]rdoba|rosario/i,
  NC: /new caledonia|noum[eé]a/i,
  LA: /laos|vientiane|los angeles/i,
  VA: /vatican/i,
  AZ: /azerbaijan|baku/i,
  IL: /israel|tel aviv/i,
};

const stateOf = sharedStateOf; // one set of rules, shared with the collector

// ---------------------------------------------------------------- place everyone
const people = [];
for (const [login, u] of Object.entries(users)) {
  if (!u) continue;
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

const tpl = readFileSync(new URL("./template.html", import.meta.url), "utf8");
writeFileSync(new URL("./leaderboard.html", import.meta.url), tpl.replace("/*__DATA__*/null", () => JSON.stringify(data).replace(/</g, String.fromCharCode(92) + "x3c")));
console.log(`placed ${people.length} of ${Object.keys(users).length} users in a state (${fair.length} in the per-state sample); leaderboard.html written`);
if (me) console.log(`you: ${me.state}, ${me.total} contributions`);

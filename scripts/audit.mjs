// Checks where everyone found was placed, so mistakes like "Campo Grande, MS" (Brazil, not
// Mississippi) are easy to spot. Prints a summary and writes data/audit.md with the detail:
// per state, how many were placed by each rule; what the guards turned away; and, for the
// two-letter codes other places share, every city that was accepted, for a human to read.
//   node scripts/audit.mjs   (or: npm run audit)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { NAMES, place } from "../src/states.mjs";

const file = (n) => new URL(`../data/${n}`, import.meta.url);
if (!existsSync(file("profiles.json"))) {
  console.error("No data/profiles.json yet: run `npm run data` to download the latest, or `npm run collect`.");
  process.exit(1);
}
const profiles = JSON.parse(readFileSync(file("profiles.json"), "utf8"));
const users = existsSync(file("users.json")) ? JSON.parse(readFileSync(file("users.json"), "utf8")) : {};

// Codes that other countries, states, or provinces also write after a city.
const SHARED = ["AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "ID", "IL", "IN", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "NE", "NH", "OR", "PA", "RI", "SC", "SD", "TN", "UT", "VA", "VT", "WA"];
const CODE_AT_END = /,\s*([A-Z]{2})\.?\s*(?:,?\s*(?:USA|U\.S\.A\.?|US|U\.S\.|United States(?: of America)?))?\s*$/;

const byState = Object.fromEntries(NAMES.map(([ab]) => [ab, { code: 0, name: 0, city: 0, looked: 0, cities: new Map() }]));
const turnedAway = new Map(); // code -> Map(location -> people)
let placed = 0;
let unplaced = 0;
for (const [login, p] of Object.entries(profiles)) {
  const loc = p?.location?.trim();
  if (!loc) continue;
  const r = place(loc);
  if (!r) {
    unplaced++;
    const m = loc.match(CODE_AT_END);
    if (m && byState[m[1]]) {
      const t = turnedAway.get(m[1]) ?? new Map();
      t.set(loc, (t.get(loc) ?? 0) + 1);
      turnedAway.set(m[1], t);
    }
    continue;
  }
  placed++;
  const s = byState[r.state];
  s[r.rule]++;
  if (users[login]) s.looked++;
  if (r.rule === "code") {
    const city = loc.slice(0, loc.match(CODE_AT_END).index).trim();
    s.cities.set(city, (s.cities.get(city) ?? 0) + 1);
  }
}

const top = (map, n) => [...map].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
const fmt = (entries) => entries.map(([k, v]) => `${k}${v > 1 ? ` (${v})` : ""}`).join(" · ");
const lines = [
  "# Placement audit",
  "",
  `${new Date().toISOString().slice(0, 10)}. ${placed.toLocaleString("en-US")} people placed in a state, ${unplaced.toLocaleString("en-US")} not (their location names no state, or names somewhere else). Rules: [src/states.mjs](../src/states.mjs). Cases: [test/states.test.mjs](../test/states.test.mjs).`,
  "",
  "## By state",
  "",
  "| State | Placed | By \"City, ST\" | By state name | By Louisiana town | Contributions looked up |",
  "|---|---:|---:|---:|---:|---:|",
  ...NAMES.map(([ab, name]) => {
    const s = byState[ab];
    return `| ${name} | ${s.code + s.name + s.city} | ${s.code} | ${s.name} | ${s.city || ""} | ${s.looked} |`;
  }),
  "",
  "## Turned away",
  "",
  "Locations ending in a US code that a guard rejected, most common first. A US town here is a mistake: add it to the tests and fix the rule.",
  "",
  ...[...turnedAway].sort((a, b) => a[0].localeCompare(b[0])).map(([ab, m]) => `- **${ab}**: ${fmt(top(m, 40))}`),
  "",
  "## Accepted by a shared code",
  "",
  "Every city placed by a code that other places also use. A foreign city here is a mistake: add it to the tests and to `ELSEWHERE` in the rules.",
  "",
  ...SHARED.map((ab) => `- **${ab}** (${byState[ab].cities.size} cities): ${fmt(top(byState[ab].cities, 400))}`),
  "",
];
writeFileSync(file("audit.md"), lines.join("\n"));

console.log(`placed ${placed}, not placed ${unplaced}`);
const away = [...turnedAway].map(([ab, m]) => [ab, [...m.values()].reduce((a, b) => a + b, 0)]).sort((a, b) => b[1] - a[1]);
console.log(`turned away by a guard: ${away.map(([ab, n]) => `${ab} ${n}`).join(", ")}`);
console.log("detail: data/audit.md");

// Fails if the data looks broken (too few people placed, too few states, or nothing fetched lately),
// so a bad day at GitHub's API never replaces the live page with a half-empty one.
//   node scripts/check-data.mjs   (or: npm run check:data)
//   MIN_PEOPLE (3000)            people placed in a state, at least
//   MIN_STATES (45)              states with at least MIN_PER_STATE (40) people
//   REQUIRE_FRESH_HOURS (unset)  something must have been fetched within this many hours
import { readFileSync } from "node:fs";
import { isBot, optedOut } from "../src/exclude.mjs";
import { stateOf } from "../src/states.mjs";

const users = JSON.parse(readFileSync(new URL("../data/users.json", import.meta.url), "utf8"));
const MIN_PEOPLE = Number(process.env.MIN_PEOPLE ?? 3000);
const MIN_STATES = Number(process.env.MIN_STATES ?? 45);
const MIN_PER_STATE = Number(process.env.MIN_PER_STATE ?? 40);
const FRESH = process.env.REQUIRE_FRESH_HOURS ? Number(process.env.REQUIRE_FRESH_HOURS) : null;

const out = optedOut();
const perState = {};
let placed = 0;
let newest = 0;
for (const [login, u] of Object.entries(users)) {
  if (!u) continue;
  newest = Math.max(newest, u.at ?? 0);
  const st = stateOf(u.location);
  if (!st || isBot(login) || out.has(login.toLowerCase())) continue;
  placed++;
  perState[st] = (perState[st] ?? 0) + 1;
}
const full = Object.values(perState).filter((n) => n >= MIN_PER_STATE).length;
const ageHours = newest ? (Date.now() - newest) / 3600000 : Number.POSITIVE_INFINITY;
console.log(`${placed} people placed; ${full} states with at least ${MIN_PER_STATE}; newest fetch ${ageHours.toFixed(1)} hours ago`);

const problems = [];
if (placed < MIN_PEOPLE) problems.push(`only ${placed} people placed (want ${MIN_PEOPLE})`);
if (full < MIN_STATES) problems.push(`only ${full} states with ${MIN_PER_STATE} or more people (want ${MIN_STATES})`);
if (FRESH !== null && ageHours > FRESH) problems.push(`nothing fetched in the last ${FRESH} hours`);
if (problems.length) {
  console.error(`The data looks broken: ${problems.join("; ")}. Not publishing.`);
  process.exit(1);
}

// Checks an "Add me" request and writes the reply. The person added is always the issue's author
// (ADD_LOGIN, from GitHub, never from the issue's text), so nobody can add someone else.
//   ADD_LOGIN=<login> GH_TOKEN=<token> node scripts/add-me.mjs
// Writes the reply to $REPLY (reply.md by default), and result=<outcome> to $GITHUB_OUTPUT:
//   added       can be placed in a state; the workflow labels the issue "added" and starts a refresh
//   already     already on the leaderboard
//   location    their location does not name a US state; nolocation: they have none
//   excluded    an organisation, a bot or test account, or on the opt-out list
//   invalid     not a GitHub user
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { isBot, optedOut } from "../src/exclude.mjs";
import { NAMES, stateOf } from "../src/states.mjs";

const PAGE = "https://wbp318.github.io/github-leaderboard/";
const REPO = "https://github.com/wbp318/github-leaderboard";
const ranksLink = (l) => `${PAGE}?me=${encodeURIComponent(l)}`;
// Profile text shown back safely: in a code span, so an @ or a link in it does nothing.
const quote = (s) => `\`${String(s).replace(/`/g, "'").replace(/\s+/g, " ").trim()}\``;
const setLocation = `Set a location on [your profile](https://github.com/settings/profile) that names your state, like \`Austin, TX\`, \`Raleigh, North Carolina\`, or \`Louisiana\`, then open a new [Add me](${REPO}/issues/new?template=add-me.yml) issue.`;

async function check(login) {
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(login)) {
    return ["invalid", "That is not a GitHub login I can look up."];
  }
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "github-leaderboard-add-me" };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  const r = await fetch(`https://api.github.com/users/${login}`, { headers });
  if (!r.ok) return ["invalid", `I could not find the GitHub user ${quote(login)}.`];
  const user = await r.json();
  const name = user.login;

  if (user.type !== "User" || isBot(name)) {
    return ["excluded", `Thanks for trying, @${name}! Organisations, bots, and test accounts are not on the leaderboard: it counts people.`];
  }
  if (optedOut().has(name.toLowerCase())) {
    return ["excluded", `@${name}, you are on the [opt-out list](${REPO}/blob/main/src/opt-out.txt). To be counted again, send a pull request removing your login from it.`];
  }
  if (!user.location?.trim()) {
    return ["nolocation", `Hi @${name}! The leaderboard places people by the location on their GitHub profile, and yours is empty. ${setLocation}`];
  }
  const state = stateOf(user.location);
  if (!state) {
    return [
      "location",
      `Hi @${name}! Your profile location, ${quote(user.location)}, does not name a US state the way the [placement rules](${REPO}/blob/main/docs/placement.md) read it, so I cannot place you. ${setLocation}

If your location does name a US state and I misread it, please [tell us](${REPO}/issues/new?template=wrong-place.yml) so the rules can be fixed.`,
    ];
  }
  const stateName = Object.fromEntries(NAMES)[state];

  const users = existsSync("data/users.json") ? JSON.parse(readFileSync("data/users.json", "utf8")) : {};
  const known = Object.entries(users).find(([l, u]) => u && l.toLowerCase() === name.toLowerCase());
  if (known && stateOf(known[1].location)) {
    return ["already", `@${name}, you are already on the leaderboard, in ${stateName}. [See your ranks](${ranksLink(name)}).`];
  }

  return [
    "added",
    `Adding you, @${name}! Your profile location, ${quote(user.location)}, places you in **${stateName}**.

A refresh has started. In about five minutes your ranks will be at **[${ranksLink(name)}](${ranksLink(name)})**: your state, division, region, and the whole country. From then on you are refreshed every day with everyone else.

How you are ranked: states are compared on the 80 people in each who look busiest by their public signals, and you are ranked among them. Private contributions count if you [show them on your profile](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-your-private-contributions-and-achievements-on-your-profile).`,
  ];
}

const [result, reply] = await check((process.env.ADD_LOGIN ?? "").trim());
writeFileSync(process.env.REPLY ?? "reply.md", `${reply.trim()}\n`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `result=${result}\n`);
console.log(result);

# Contributing

Thanks for wanting to make this better. Everything here is plain JavaScript on Node 24, with no dependencies to install, so you can be running it in two minutes. Please follow the [code of conduct](CODE_OF_CONDUCT.md).

## Run it

```sh
git clone https://github.com/wbp318/github-leaderboard.git
cd github-leaderboard
npm run data     # download the latest data (refreshed daily)
npm run build    # write site/leaderboard.html
npm test         # the placement rules
```

Open `site/leaderboard.html` in a browser. Change [web/template.html](web/template.html), run `npm run build` again, and reload.

## Where things are

| Path | What it is |
|---|---|
| [src/states.mjs](src/states.mjs) | Reads a free-text profile location and decides which state it names, if any. The rules most likely to need you. |
| [src/parishes.mjs](src/parishes.mjs) | Louisiana's 64 parishes and the towns and universities in each. |
| [src/opt-out.txt](src/opt-out.txt) | People who asked to be left off. |
| [src/exclude.mjs](src/exclude.mjs) | Who is left off: bot and test accounts, and the opt-out list. |
| [scripts/collect.mjs](scripts/collect.mjs) | Gathers people and their contributions from GitHub's API into `data/`. |
| [scripts/audit.mjs](scripts/audit.mjs) | Writes `data/audit.md`: what each rule placed and what it turned away. |
| [scripts/build.mjs](scripts/build.mjs) | Places everyone, adds it all up, and writes the page. |
| [scripts/fetch-data.mjs](scripts/fetch-data.mjs) | Downloads the latest data from the `data` branch. |
| [scripts/add-me.mjs](scripts/add-me.mjs) | Checks an "Add me" request and writes the bot's reply. |
| [web/template.html](web/template.html) | The page: the canvas tornado, the map, the tables, all in one file. |
| [test/states.test.mjs](test/states.test.mjs) | Locations and where they belong. |
| [docs/placement.md](docs/placement.md) | How the placement rules work, and the audit. |
| [docs/data.md](docs/data.md) | Every data file and field, and the collector's settings. |
| [.github/workflows/refresh.yml](.github/workflows/refresh.yml) | The daily refresh and the deploy to GitHub Pages. |
| [.github/workflows/add-me.yml](.github/workflows/add-me.yml) | Answers "Add me" issues. |

## Someone is in the wrong place

Profile locations are free text, and two-letter codes are shared around the world: MS is Mississippi and also Mato Grosso do Sul in Brazil, DE is Delaware and Germany, IN is Indiana and India ([the full table](docs/placement.md#the-problem-codes-are-shared)). When the rules get one wrong:

1. Add the location to [test/states.test.mjs](test/states.test.mjs) with where it belongs (`null` for "not in a US state").
2. Change [src/states.mjs](src/states.mjs) until `npm test` passes. A foreign city that shares a code usually belongs in the `ELSEWHERE` list for that code.
3. Run `npm run audit` and read `data/audit.md`: the "turned away" list should hold no US towns and the "accepted" lists no foreign ones.

Not sure how to fix it? [Open an issue](https://github.com/wbp318/github-leaderboard/issues/new/choose) with the exact location text.

## Collect the data yourself

You only need this to change what is collected. It needs the [GitHub CLI](https://cli.github.com/), logged in, and takes about an hour for every state.

```sh
GH_TOKEN=$(gh auth token) npm run collect          # macOS, Linux, Git Bash
$env:GH_TOKEN = gh auth token; npm run collect      # PowerShell
```

`SCOPE=LA,MS,AR` limits it to some states, `PER_STATE` sets how many people in each state have their contributions looked up (80), and `VIEWER=<your login>` makes sure you are included and highlighted; [docs/data.md](docs/data.md#how-it-is-collected) lists every setting. The token stays in your environment and is never written to disk. Rerunning fetches only what is missing or stale, so you can stop it at any point.

## Ideas to pick up

Each of these is an issue with what to build, where in the code, and how to know it is done. Comment on one to claim it.

Good first issues:

- [Links to a view: put the current view in the URL](https://github.com/wbp318/github-leaderboard/issues/2)
- [Download a leaderboard as CSV](https://github.com/wbp318/github-leaderboard/issues/3)
- [A light theme](https://github.com/wbp318/github-leaderboard/issues/4)
- [Place "Austin TX" and "Atlanta, Ga"](https://github.com/wbp318/github-leaderboard/issues/5)

Bigger ones:

- [Keyboard and screen-reader access to the tornado](https://github.com/wbp318/github-leaderboard/issues/6)
- [Counties for your state, like Louisiana's parishes](https://github.com/wbp318/github-leaderboard/issues/7)
- [History: how each state moves over time](https://github.com/wbp318/github-leaderboard/issues/8)
- [Live lookups for anyone: a Cloudflare Worker behind Find yourself](https://github.com/wbp318/github-leaderboard/issues/10)

[All good first issues](https://github.com/wbp318/github-leaderboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Have a different idea? [Open an issue](https://github.com/wbp318/github-leaderboard/issues/new/choose).

## Pull requests

CI runs the tests, the audit, and a full build on every pull request. Please keep it dependency-free and working at phone width.

## Leaving the leaderboard

Everything shown comes from public GitHub profiles. To be left off, add your login to [src/opt-out.txt](src/opt-out.txt) in a pull request, or [open an issue](https://github.com/wbp318/github-leaderboard/issues/new) and it will be done for you.

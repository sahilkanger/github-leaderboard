# The data

Everything the page is built from lives on the [`data` branch](https://github.com/wbp318/github-leaderboard/tree/data/data), replaced once a day by the [refresh workflow](../.github/workflows/refresh.yml). `npm run data` downloads it into `data/`. It is all public GitHub profile information.

## Files

### candidates.json

Who the searches found, per state.

```json
{
  "AL": { "total": 3441, "logins": ["brandonroberts", "justintadlock", "..."], "done": true, "at": 1794508428857 },
  "LA_CITIES": { "total": 0, "logins": ["..."], "done": true, "at": 1794508428857 }
}
```

- `total`: how many GitHub users list the state's full name (GitHub's own count), shown as "On GitHub" in the state table.
- `logins`: up to about 800 people found by searching the state's name and code, sorted by followers and by repositories. `LA_CITIES` holds the extra Louisiana search by town.
- `at`: when it was fetched, in milliseconds since 1970. Searches are refreshed weekly.

### profiles.json

Cheap facts about everyone found, used to place them and to pick whose contributions to look up.

```json
{ "someone": { "location": "Maine", "followers": 262, "repos": 161, "pushed": "2026-11-11T21:03:14Z", "at": 1794513485786 } }
```

- `repos`: public repositories they own. `pushed`: their most recent push to one of their own repositories.
- `null` for an account that no longer exists.
- Refreshed weekly, spread over a second week by login so the refresh does not land on one day.

### users.json

A year of contributions for the people looked up: in each state, the 80 most likely to be busiest among those who pushed in the last year, scored by public repositories and followers, and every active Louisianan.

```json
{
  "someone": {
    "name": "Their Name", "location": "Maine", "followers": 262,
    "total": 41018, "commits": 5499, "prs": 479, "reviews": 1060, "issues": 0, "repos": 11, "private": 33969,
    "at": 1794516199109
  }
}
```

- `total`: the number on their contribution calendar for the last 12 months.
- `commits`, `prs`, `reviews`, `issues`, `repos`: public contributions of each kind (`repos` is repositories created).
- `private`: contributions to private repositories, counted only if they show them on their profile. For the busiest accounts GitHub cannot count this field in one query, so it is the calendar total minus the public kinds, which is how the calendar adds up.
- Refreshed every day.

### audit.md

The [placement audit](placement.md#checking-the-rules): what each rule placed, what the guards turned away, and every city accepted under a shared code.

## How it is collected

[scripts/collect.mjs](../scripts/collect.mjs) uses GitHub's search API (30 searches a minute) and GraphQL API. It saves as it goes and rerunning it fetches only what is missing or stale, so it can stop at any point. GitHub limits GraphQL by compute time as well as by points: the collector runs two or three queries at once and drops to one when GitHub pushes back, and waits for the hourly reset when the points run out. The daily run uses the workflow's own token (1,000 points an hour), which is enough because only contributions are refreshed every day.

| Setting | Default | What it does |
|---|---|---|
| `SCOPE` | every state | Only some states, such as `LA,MS,AR` |
| `PER_STATE` | 80 | People a state whose contributions are looked up, and used to compare states |
| `VIEWER` | wbp318 | Always looked up, and shown as "you" on the page |
| `CONTRIB_MAX_HOURS` | 20 (12 in the daily run) | When contributions count as stale |
| `PROFILE_MAX_DAYS` | 7 | When profiles count as stale |
| `SEARCH_MAX_DAYS` | 7 | When searches count as stale |

## Building something new

`scripts/build.mjs` writes everything the page shows into one object in the page (`D` in [web/template.html](../web/template.html)): totals for the country, regions, divisions, states, and parishes, and one row a person. A new view usually needs only a change to the template. If it needs something the build does not compute yet, add it to the `data` object at the end of the build.

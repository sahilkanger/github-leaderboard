# The `data` branch: generated daily, do not edit or merge

This branch holds the data behind the [GitHub Contribution Tornado](https://wbp318.github.io/github-leaderboard/). Every morning the [refresh workflow](https://github.com/wbp318/github-leaderboard/blob/main/.github/workflows/refresh.yml) replaces it with one fresh commit, so:

- **Don't edit it.** Anything changed here is overwritten the next morning. The code, the placement rules, and the docs live on [`main`](https://github.com/wbp318/github-leaderboard).
- **Don't merge it.** It shares no history with `main`, and keeping several megabytes of daily data out of `main` keeps clones small and the history readable. Ignore GitHub's "Compare & pull request" banner for this branch.
- **Don't delete it.** Each daily run starts from it; without it the next run collects everything from scratch.

## What is here

| File | What it is |
|---|---|
| [data/candidates.json](data/candidates.json) | Who the searches found, per state |
| [data/profiles.json](data/profiles.json) | Location, followers, public repositories, and last push for everyone found |
| [data/users.json](data/users.json) | A year of contributions for the people looked up |
| [data/audit.md](data/audit.md) | The placement audit: what each rule placed and turned away |

Every field is described in [docs/data.md](https://github.com/wbp318/github-leaderboard/blob/main/docs/data.md). To use the data, clone `main` and run `npm run data`, which downloads these files into `data/`.

All of it comes from public GitHub profiles. To be left off, see [src/opt-out.txt](https://github.com/wbp318/github-leaderboard/blob/main/src/opt-out.txt).

// Downloads the latest collected data (refreshed daily by GitHub Actions) into data/, so you can
// build the page and run the audit without collecting from GitHub yourself.
//   node scripts/fetch-data.mjs   (or: npm run data)
//   DATA_REPO=<owner>/<repo>   to download from a fork
import { mkdirSync, writeFileSync } from "node:fs";

const repo = process.env.DATA_REPO ?? "wbp318/github-leaderboard";
const dir = new URL("../data/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const name of ["candidates.json", "profiles.json", "users.json", "audit.md"]) {
  const url = `https://raw.githubusercontent.com/${repo}/data/data/${name}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  const body = Buffer.from(await r.arrayBuffer());
  writeFileSync(new URL(name, dir), body);
  console.log(`data/${name}  ${(body.length / 1024).toFixed(0)} KB`);
}
console.log("Now: npm run build, then open site/leaderboard.html");

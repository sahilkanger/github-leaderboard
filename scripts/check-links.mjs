// Fails if any Markdown file in the repository links to a file that does not exist, so a moved or
// renamed file cannot leave the docs pointing nowhere.
//   node scripts/check-links.mjs   (or: npm run check:links)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

// The data branch's README links to files that exist only on that branch.
const ELSEWHERE = new Set([".github/data-branch-README.md"]);
const files = execFileSync("git", ["ls-files", "*.md"], { encoding: "utf8" }).split("\n").filter((f) => f && !ELSEWHERE.has(f));
let missing = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    const path = normalize(join(dirname(file), decodeURIComponent(target.split("#")[0])));
    if (!existsSync(path)) {
      console.error(`${file}: ${target} does not exist`);
      missing++;
    }
  }
}
console.log(`${files.length} Markdown files, ${missing} broken links`);
if (missing) process.exit(1);

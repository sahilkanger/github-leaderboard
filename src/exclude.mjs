// Who is left off the leaderboard: accounts named as bots or tests, which are automation rather
// than people, and anyone who asked (src/opt-out.txt).
import { readFileSync } from "node:fs";

// openshift-cherrypick-robot, redhat-chai-bot, amplify-github-test-hkg; not talbot or contest.
const BOT = /(?:^|[-_.])(?:ro)?bot(?:[-_.]|$)|\[bot\]$|(?:^|[-_])test(?:[-_]|$)/i;
export const isBot = (login) => BOT.test(login);

export function optedOut() {
  return new Set(
    readFileSync(new URL("./opt-out.txt", import.meta.url), "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l && !l.startsWith("#")),
  );
}

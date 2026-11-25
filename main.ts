import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE = "fix: the login bug is gone, so is login";

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > 100) {
  fail(`entry must be 1 to 100 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back does not match the entry");
}
if (roundTrip.length !== LINE.length) {
  fail("round-trip length does not match the entry");
}

// Builds the static site into dist/.
// Run with: node tools/build.mjs  (or: npm run build)
//
// No third-party dependencies; uses only the Node.js standard library so the
// build stays a plain copy step. The site is already static, so the build just
// assembles the served assets into a self-contained dist/ bundle that any
// static host (Azure Static Web Apps, GitHub Pages, S3, Netlify, …) can serve
// as-is. The dataset is validated first so a bad dataset fails the build.

import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");

// The files and directories that make up the served site.
const ASSETS = ["index.html", "styles.css", "app.js", "data"];

// Validate the dataset before building so a broken dataset never ships.
execFileSync(process.execPath, [join(root, "tests", "validate-breeds.mjs")], {
  stdio: "inherit"
});

// Start from a clean output directory.
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const asset of ASSETS) {
  cpSync(join(root, asset), join(dist, asset), { recursive: true });
}

// Sanity check: the bundle must include an index and the dataset.
for (const required of ["index.html", join("data", "breeds.json")]) {
  readFileSync(join(dist, required)); // throws if missing
}

console.log(`Built static bundle in dist/ (${ASSETS.length} assets copied).`);

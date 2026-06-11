// Validates the Azure Static Web Apps configuration.
// Run with: node tests/validate-config.mjs
// No third-party dependencies; uses only the Node.js standard library so the
// site can stay a plain static upload (no build step) for Azure Static Web Apps.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const configPath = join(here, "..", "staticwebapp.config.json");

const errors = [];
function check(condition, message) {
  if (!condition) errors.push(message);
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch (err) {
  console.error("Could not read/parse staticwebapp.config.json:", err.message);
  process.exit(1);
}

// Client-side routing requires the host to serve index.html for unknown paths.
const fallback = config && config.navigationFallback;
check(
  fallback && typeof fallback === "object",
  "staticwebapp.config.json must define a navigationFallback object"
);

if (fallback) {
  check(
    fallback.rewrite === "/index.html",
    `navigationFallback.rewrite must be "/index.html" (found ${JSON.stringify(fallback.rewrite)})`
  );
  check(
    Array.isArray(fallback.exclude) && fallback.exclude.length > 0,
    "navigationFallback.exclude must list static asset paths so they are not rewritten to index.html"
  );
  // Static assets must be excluded so missing files 404 instead of silently
  // returning the HTML shell (which would break fetch() of the dataset).
  if (Array.isArray(fallback.exclude)) {
    check(
      fallback.exclude.some((p) => p.includes("/data/")),
      "navigationFallback.exclude should exclude the /data/ directory"
    );
  }
}

if (errors.length > 0) {
  console.error(`Config validation failed with ${errors.length} error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("OK: staticwebapp.config.json valid; navigationFallback serves index.html for unknown paths.");

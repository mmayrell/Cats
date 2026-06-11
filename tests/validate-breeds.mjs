// Validates the curated cat breed dataset.
// Run with: node tests/validate-breeds.mjs
// No third-party dependencies; uses only the Node.js standard library so the
// site can stay a plain static upload (no build step) for Azure Static Web Apps.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "..", "data", "breeds.json");

const REQUIRED_FIELDS = [
  "name",
  "origin",
  "coatLength",
  "temperament",
  "weightRange",
  "lifeExpectancy",
  "energyLevel",
  "groomingEffort",
  "funFact"
];

const MIN_BREEDS = 25;
const ENERGY_LEVELS = new Set(["Low", "Moderate", "High"]);
const GROOMING_LEVELS = new Set(["Low", "Moderate", "High"]);
const COAT_LENGTHS = new Set(["Short", "Long", "Hairless"]);
const RANGE_PATTERN = /\d/; // a range string must contain at least one number

// Placeholder values are forbidden: every field must carry real, curated data.
// A field whose trimmed value equals one of these tokens (case-insensitive),
// or that is just a string of placeholder punctuation, is rejected.
const PLACEHOLDER_TOKENS = new Set([
  "tbd",
  "tba",
  "todo",
  "n/a",
  "na",
  "none",
  "null",
  "unknown",
  "placeholder",
  "lorem ipsum",
  "coming soon",
  "test",
  "xxx"
]);
const PLACEHOLDER_PUNCTUATION = /^[-–—?.]+$/; // e.g. "-", "—", "???", "..."

function isPlaceholder(value) {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return PLACEHOLDER_TOKENS.has(normalized) || PLACEHOLDER_PUNCTUATION.test(normalized);
}

const errors = [];
function check(condition, message) {
  if (!condition) errors.push(message);
}

let breeds;
try {
  breeds = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (err) {
  console.error("Could not read/parse data/breeds.json:", err.message);
  process.exit(1);
}

check(Array.isArray(breeds), "breeds.json must contain a JSON array");

if (Array.isArray(breeds)) {
  check(
    breeds.length >= MIN_BREEDS,
    `dataset must include at least ${MIN_BREEDS} breeds (found ${breeds.length})`
  );

  const seenNames = new Set();
  breeds.forEach((breed, i) => {
    const label = (breed && breed.name) || `index ${i}`;

    for (const field of REQUIRED_FIELDS) {
      const value = breed && breed[field];
      check(
        typeof value === "string" && value.trim().length > 0,
        `"${label}": field "${field}" is missing or empty`
      );
      check(
        !isPlaceholder(value),
        `"${label}": field "${field}" contains a placeholder value ("${value}")`
      );
    }

    if (breed && typeof breed.name === "string") {
      const key = breed.name.toLowerCase();
      check(!seenNames.has(key), `duplicate breed name: "${breed.name}"`);
      seenNames.add(key);
    }

    if (breed) {
      check(
        COAT_LENGTHS.has(breed.coatLength),
        `"${label}": coatLength "${breed.coatLength}" must be one of ${[...COAT_LENGTHS].join(", ")}`
      );
      check(
        ENERGY_LEVELS.has(breed.energyLevel),
        `"${label}": energyLevel "${breed.energyLevel}" must be one of ${[...ENERGY_LEVELS].join(", ")}`
      );
      check(
        GROOMING_LEVELS.has(breed.groomingEffort),
        `"${label}": groomingEffort "${breed.groomingEffort}" must be one of ${[...GROOMING_LEVELS].join(", ")}`
      );
      check(
        typeof breed.weightRange === "string" && RANGE_PATTERN.test(breed.weightRange),
        `"${label}": weightRange should contain a numeric range`
      );
      check(
        typeof breed.lifeExpectancy === "string" && RANGE_PATTERN.test(breed.lifeExpectancy),
        `"${label}": lifeExpectancy should contain a numeric range`
      );
    }
  });
}

if (errors.length > 0) {
  console.error(`Dataset validation failed with ${errors.length} error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(`OK: ${breeds.length} breeds validated; all required fields present.`);

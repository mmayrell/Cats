# Wiskerpedia 🐾

A curated encyclopedia of real cat breeds, served as a static website on Azure
Static Web Apps.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell and search/filter controls. |
| `styles.css` | Styling for the breed grid and cards. |
| `app.js` | Loads the dataset and renders/filters breed cards. |
| `data/breeds.json` | The curated cat breed dataset. |
| `staticwebapp.config.json` | Azure SWA config; serves `index.html` as the fallback for unknown paths. |
| `tests/validate-breeds.mjs` | Validates the dataset's shape and contents. |
| `tests/validate-config.mjs` | Validates the Static Web Apps fallback configuration. |

## The dataset

`data/breeds.json` is an array of curated, real cat breeds (currently 30). Each
record contains:

- `name` — breed name
- `origin` — country of origin
- `coatLength` — `Short`, `Long`, or `Hairless`
- `temperament` — short description of typical personality
- `weightRange` — typical adult weight range
- `lifeExpectancy` — typical life expectancy range
- `energyLevel` — `Low`, `Moderate`, or `High`
- `groomingEffort` — `Low`, `Moderate`, or `High`
- `funFact` — a fun fact about the breed

Weights and life expectancies are typical ranges and vary by individual cat.

## Running locally

The site is fully static — no build step. Serve the folder over HTTP so the
browser can `fetch` the dataset:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Validating the dataset

```bash
node tests/validate-breeds.mjs
node tests/validate-config.mjs
```

`validate-breeds.mjs` checks that there are at least 25 breeds, that every
required field is present and non-empty, that there are no duplicate breed
names, and that the categorical fields use the expected values.
`validate-config.mjs` checks the Static Web Apps fallback configuration.

## Client-side routing

`staticwebapp.config.json` sets a [`navigationFallback`](https://learn.microsoft.com/azure/static-web-apps/configuration#fallback-routes)
rule that rewrites unknown paths to `/index.html` so deep links and
client-side routes resolve to the app shell instead of returning a 404. Static
assets (`/data/*`, CSS, JS, JSON, images) are excluded so a missing file still
returns a real 404 rather than the HTML shell.

## Deployment

Pushed to `main`, the site is deployed by the Azure Static Web Apps workflow in
`.github/workflows/`, which uploads the repository root with no build command.

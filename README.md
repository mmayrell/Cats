# Wiskerpedia 🐾

A curated encyclopedia of real cat breeds, built as a single-page application
with [Vite](https://vitejs.dev/) and [React](https://react.dev/) and served as a
static website on Azure Static Web Apps.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell that mounts the React app. |
| `src/main.jsx` | App entry point; mounts `<App />` and loads styles. |
| `src/App.jsx` | Top-level component: search, filters, and the breed grid. |
| `src/BreedCard.jsx` | Renders a single breed card. |
| `src/styles.css` | Styling for the breed grid and cards. |
| `vite.config.js` | Vite + React build configuration. |
| `data/breeds.json` | The curated cat breed dataset. |
| `tests/validate-breeds.mjs` | Validates the dataset's shape and contents. |

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

Every field is required and must hold real, curated data: no record may have a
missing, empty, or placeholder field (e.g. `TBD`, `N/A`, `unknown`, `—`). This
is enforced by the validator described below.

## Running locally

Install dependencies, then start the Vite dev server:

```bash
npm install
npm run dev
# then open the printed http://localhost:5173 URL
```

To produce the production build (output goes to `dist/`):

```bash
npm run build
npm run preview   # serve the built site locally
```

## Validating the dataset

```bash
node tests/validate-breeds.mjs
```

The validator checks that there are at least 25 breeds, that every required
field is present, non-empty, and not a placeholder value, that there are no
duplicate breed names, and that the categorical fields use the expected values.

## Deployment

Pushed to `main`, the site is deployed by the Azure Static Web Apps workflow in
`.github/workflows/`, which builds the app and uploads the `dist/` output.

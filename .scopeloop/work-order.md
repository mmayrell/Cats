# ScopeLoop Work Order

Implement this requirement in the codebase.

# Curated Cat Breed Dataset

The app must include a curated dataset of at least 25 real cat breeds, with each breed record containing the following fields: breed name, country of origin, coat length, temperament, typical adult weight range, life expectancy range, energy level, grooming effort, and a fun fact.
## Instructions
Implement this change directly in the repository, following existing conventions and
patterns; add or update tests where appropriate. Then you MUST finish by writing
`.scopeloop/result.json` (and nothing else writes that file) with exactly this shape:

{
  "status": "completed" | "needs_input" | "blocked" | "no_changes",
  "summary": "<1-3 sentences on what you did or found>",
  "questions": ["<a specific, product-level question>"],
  "blocker": "<the technical error and what you tried>",
  "logTail": "<the last ~25 lines of the relevant error output>"
}

Rules:
- Do everything you can confidently do, and commit your work.
- If a genuine product/requirement ambiguity blocks you, set "needs_input" and ask
  specific questions a non-technical product owner could answer. Do NOT guess.
- If a technical problem you cannot resolve blocks you (build/test failure, missing
  dependency, etc.), set "blocked" with the error, what you tried, and "logTail".
- If you fully implemented it, set "completed". If nothing needed changing, "no_changes".
- "questions" only for needs_input; "blocker"/"logTail" only for blocked.

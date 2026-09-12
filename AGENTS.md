# Codex Project Instructions

## Working Style

- Codex may inspect and edit project files.
- Keep changes focused on the user's request.
- When the user has not provided a file path, ask where the relevant file is instead of searching the repository for it.
- When the user provides a file path, work directly with that file.

## Tracing a Page from a URL

- Treat a user-provided application URL as a relevant path. Extract its application path and do not ask the user for a file path.
- Example: for `http://localhost:97/dashboard/hire-sales/create`, start with `/dashboard/hire-sales/create`.
- Find the matching dashboard route first, then follow its controller method to the Inertia-rendered page.
- From the rendered frontend page, inspect all imported API helpers and identify which APIs are actually called by that page (queries, mutations, form submissions, searches, scans, and option loaders).
- Trace the API call relevant to the user's requested behavior from its frontend helper to the exact API URL. Do not guess the API from the page URL alone.
- Find the matching API route, then trace it through the API controller and service that implement the behavior.
- Use this order when diagnosing or changing a URL-backed feature:
  1. Application URL path
  2. Dashboard route
  3. UI controller method
  4. Inertia page/component
  5. Imported frontend API helper
  6. API route
  7. API controller
  8. Domain service/model
- Inspect both the frontend interaction and backend validation. Frontend validation improves feedback, but backend validation must remain the final safeguard.

## Commands Requiring Explicit Permission

Do not automatically run builds, tests, migrations, seeders, deployments, dependency installation or update commands, Docker rebuild or restart commands, or any other heavy or long-running command.

Only run one of these commands when the user explicitly asks for that specific action.

Restricted examples include, but are not limited to:

- `php artisan migrate`
- `php artisan migrate:fresh`
- `php artisan db:seed`
- `php artisan test`
- `vendor/bin/phpunit`
- `npm run build`
- `npm run dev`
- `npm test`
- `composer install`
- `composer update`
- `docker compose build`
- `docker compose up`
- `docker compose down`
- deployment commands
- dependency installation or update commands
- broad formatting, linting, code-generation, or validation commands

Permission for one command does not imply permission for another command or for future runs of the same command.

## After Editing

- Do not automatically verify changes with restricted commands.
- Briefly summarize what was changed.
- Tell the user which commands, if any, they should run manually to migrate, seed, build, test, format, deploy, or verify the changes.
- If no manual command is needed, say so clearly.

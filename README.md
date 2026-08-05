# PocWebApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.32.

## Development server

Copy `.env.example` to `.env` and fill in the DEV backend's `/exec` URL, then start the dev
server with:

```bash
npm start
```

(Not `ng serve` directly — `npm start` runs `node scripts/inject-api-url.js dev ng serve`, which
substitutes your `.env`'s URL into `src/environments/environment.dev.ts` before starting `ng
serve`, and restores the placeholder when the server stops. See "Environment config" below.)

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

**If you kill the dev server non-interactively** (e.g. `kill` on a backgrounded process rather
than Ctrl+C in its own terminal), target the actual `node scripts/inject-api-url.js` process, not
`npm`'s own PID — npm doesn't forward signals to the child it spawns, so killing npm's PID leaves
`environment.dev.ts` with the real URL still baked in. Ctrl+C in an interactive terminal doesn't
have this problem — it signals the whole foreground process group at once.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

```bash
npm run build
```

(Not `ng build` directly — same `inject-api-url.js` wrapper as `npm start`, targeting
`environment.prod.ts`.) This compiles the project into `dist/`, optimized for production by
default. **There is no local `.env` fallback for the production target** — building with the real
PROD URL only happens in CI; running `npm run build` locally will fail with a clear "missing
WORKSHOP_API_URL" error rather than silently producing a build with the placeholder baked in.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment (Firebase Hosting)

This app deploys automatically to Firebase Hosting via the workflow in `.github/workflows/firebase-hosting-prod.yml` on every push to `main`. The workflow builds with `ng build --configuration production` (served from the site root, so no `--base-href` override) and publishes `dist/poc-web-app/browser`.

Hosting behaviour is defined in `firebase.json` (SPA rewrite of all routes to `/index.html`, plus cache headers). The target project is set in `.firebaserc`.

### One-time setup

1. Create/select a Firebase project and replace `<YOUR_FIREBASE_PROJECT_ID>` in both `.firebaserc` and `.github/workflows/firebase-hosting-prod.yml`.
2. Create a service account with the **Firebase Hosting Admin** role and add its JSON key as the `FIREBASE_SERVICE_ACCOUNT` secret in the GitHub repo (Settings → Secrets and variables → Actions). Do **not** commit the key to the repo.
3. Set up the `production`/`development` GitHub Environments and their `WORKSHOP_API_URL` variable — see "Environment config" below.
4. (Optional, local deploys) Install the CLI with `npm i -g firebase-tools`, then `firebase login` and `firebase deploy --only hosting`.

The site is served from `https://<YOUR_FIREBASE_PROJECT_ID>.web.app/`.

## Environment config

`src/environments/environment.dev.ts` and `environment.prod.ts` hold `__WORKSHOP_API_URL__` — a
placeholder, not a real URL — instead of the Apps Script backend URL directly, so it's never
committed to git. `scripts/inject-api-url.js` substitutes it right before `ng serve`/`ng build`
and restores the placeholder when that command exits (see "Development server" above for the one
caveat around killing the dev server non-interactively).

- **Locally**: only the `dev` target works — copy `.env.example` to `.env` (gitignored) and fill
  in the DEV backend's URL. There's no local path for `prod`; see "Building" above.
- **In CI**: each workflow job declares `environment: production`/`environment: development`
  (`firebase-hosting-prod.yml`/`firebase-hosting-dev.yml`), and its `env:` block reads
  `${{ vars.WORKSHOP_API_URL }}` — GitHub resolves that to whichever value is scoped to the job's
  declared Environment. Set it up under **Settings → Environments**: create `production` and
  `development`, each with its own **Environment variable** named `WORKSHOP_API_URL` (the PROD
  `/exec` URL in `production`, the DEV `/exec` URL in `development`).

This mirrors the same pattern used on the backend (`poc-apps-script`'s README — "Environment
config" section) for keeping deployment-specific values out of source.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

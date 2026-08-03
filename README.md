# PocWebApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.32.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

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

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

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

This app deploys automatically to Firebase Hosting via the workflow in `.github/workflows/firebase-hosting.yml` on every push to `main`. The workflow builds with `ng build --configuration production` (served from the site root, so no `--base-href` override) and publishes `dist/poc-web-app/browser`.

Hosting behaviour is defined in `firebase.json` (SPA rewrite of all routes to `/index.html`, plus cache headers). The target project is set in `.firebaserc`.

### One-time setup

1. Create/select a Firebase project and replace `<YOUR_FIREBASE_PROJECT_ID>` in both `.firebaserc` and `.github/workflows/firebase-hosting.yml`.
2. Create a service account with the **Firebase Hosting Admin** role and add its JSON key as the `FIREBASE_SERVICE_ACCOUNT` secret in the GitHub repo (Settings → Secrets and variables → Actions). Do **not** commit the key to the repo.
3. (Optional, local deploys) Install the CLI with `npm i -g firebase-tools`, then `firebase login` and `firebase deploy --only hosting`.

The site is served from `https://<YOUR_FIREBASE_PROJECT_ID>.web.app/`.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

/**
 * DEV environment — used by default (`ng serve`, and the `develop`-branch Firebase Hosting "dev"
 * preview channel, which builds with `--configuration devPreview`). Swapped for
 * `environment.prod.ts` on the `production` build configuration via `fileReplacements` in
 * angular.json.
 *
 * workshopApiUrl is a placeholder, not a real URL — see scripts/inject-api-url.js and
 * README.md's "Environment config" section. Never edit this file to add the real URL back in
 * directly, and never commit it resolved.
 */
export const environment = {
  production: false,
  workshopApiUrl: '__WORKSHOP_API_URL__',
};

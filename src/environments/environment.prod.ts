/**
 * PROD environment — swapped in for `environment.dev.ts` on production builds (`fileReplacements`
 * in angular.json), i.e. `ng build --configuration production` as used by the `main`-branch live
 * Firebase Hosting deploy.
 *
 * workshopApiUrl is a placeholder, not a real URL — see scripts/inject-api-url.js and
 * README.md's "Environment config" section. Never edit this file to add the real URL back in
 * directly, and never commit it resolved. There is no local fallback for this file — production
 * builds only ever happen in CI.
 */
export const environment = {
  production: true,
  workshopApiUrl: '__WORKSHOP_API_URL__',
};

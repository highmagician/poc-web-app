/**
 * PROD environment — swapped in for `environment.dev.ts` on production builds (`fileReplacements`
 * in angular.json), i.e. `ng build --configuration production` as used by the `main`-branch live
 * Firebase Hosting deploy.
 *
 * workshopApiUrl and firebaseConfig are placeholders, not real values — see
 * scripts/inject-api-url.js and README.md's "Environment config" section. Never edit this file
 * to add real values back in directly, and never commit it resolved. There is no local fallback
 * for this file — production builds only ever happen in CI.
 *
 * firebaseConfig points at the live PROD Firebase project — kept separate from DEV's so the
 * firebase-page demo's Auth testing on the dev preview channel never touches real user data.
 * Substitution is optional: if left unset, the firebase-page demo falls back to its own
 * hardcoded demo config instead of failing the build.
 */
export const environment = {
  production: true,
  workshopApiUrl: '__WORKSHOP_API_URL__',
  firebaseConfig: {
    apiKey: '__FIREBASE_API_KEY__',
    authDomain: '__FIREBASE_AUTH_DOMAIN__',
    projectId: '__FIREBASE_PROJECT_ID__',
    storageBucket: '__FIREBASE_STORAGE_BUCKET__',
    messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
    appId: '__FIREBASE_APP_ID__',
  },
};

/**
 * DEV environment — used by default (`ng serve`, and the `develop`-branch Firebase Hosting "dev"
 * preview channel, which builds with `--configuration devPreview`). Swapped for
 * `environment.prod.ts` on the `production` build configuration via `fileReplacements` in
 * angular.json.
 *
 * workshopApiUrl and firebaseConfig are placeholders, not real values — see
 * scripts/inject-api-url.js and README.md's "Environment config" section. Never edit this file
 * to add real values back in directly, and never commit it resolved.
 *
 * firebaseConfig points at the DEV Firebase project (kept separate from PROD's so the
 * firebase-page demo's Auth testing never touches real user data — see environment.prod.ts).
 * Substitution is optional: if left unset, the firebase-page demo falls back to its own
 * hardcoded demo config instead of failing the build.
 */
export const environment = {
  production: false,
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

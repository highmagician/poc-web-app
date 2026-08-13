// PROD environment config — placeholders injected by scripts/inject-api-url.js
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

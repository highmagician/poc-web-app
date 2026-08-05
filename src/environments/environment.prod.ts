/**
 * PROD environment — swapped in for `environment.ts` on production builds (`fileReplacements` in
 * angular.json), i.e. `ng build --configuration production` as used by the `main`-branch live
 * Firebase Hosting deploy.
 */
export const environment = {
  production: true,
  workshopApiUrl:
    'https://script.google.com/macros/s/AKfycbzQQblzRQIX3HIO2bLnw_XxwKhIlQhzVEdpRleRrnSe_lb8cijOSpM3Gc590o1ZYs8Nig/exec',
};

/**
 * DEV environment — used by default (`ng serve`, and the `develop`-branch Firebase Hosting "dev"
 * preview channel, which builds with `--configuration devPreview`). Swapped for
 * `environment.prod.ts` on the `production` build configuration via `fileReplacements` in
 * angular.json.
 */
export const environment = {
  production: false,
  workshopApiUrl:
    'https://script.google.com/macros/s/AKfycbxeQlweTMo5yK8cq1Rsgl4a2omuAfEcsIDgZ5PBC95zpuRIQec1eq7DLUfZLhHunHXT/exec',
};

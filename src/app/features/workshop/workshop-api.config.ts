import { environment } from '../../../environments/environment.dev';

/**
 * Deployed Apps Script Web App URL (poc-apps-script) — DEV or PROD depending on build
 * configuration, see `src/environments/`. Update the matching environment file after each new
 * deployment — `clasp deploy` mints a new URL only for a first deployment; redeploying an
 * existing deployment ID keeps the same URL.
 */
export const WORKSHOP_API_URL = environment.workshopApiUrl;

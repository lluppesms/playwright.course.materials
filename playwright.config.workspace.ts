// ----------------------------------------------------------------------------------------------------
// This config file is for the new 2025 Playwright Workspace,
// which replaces the original 2024 Playwright Test Service (preview).
// See: https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/overview-what-is-microsoft-playwright-workspaces
// ----------------------------------------------------------------------------------------------------
// Setup and run: 
//   Setup: create a local variable
//     export PLAYWRIGHT_SERVICE_URL=wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/<myguid>/browsers
//   Command to run this locally:  
//     npx playwright test ./playwright/ui-tests/original-dadjoke-ui-tests.spec.ts --config=playwright.config.workspace.ts --workers=20
// ----------------------------------------------------------------------------------------------------
// Note: it is strongly encouraged to use a managed identity, not a token which will expire and can leak
// ----------------------------------------------------------------------------------------------------
// Define environment on the dev box in .env file:
//  .env:
//    PLAYWRIGHT_SERVICE_URL=XXX
//    [NOT-RECOMMENDED!] PLAYWRIGHT_SERVICE_ACCESS_TOKEN=XXX
// GH:
//   Define environment in your GitHub workflow spec.
//    env:
//      PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
//      PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}
//      [NOT-RECOMMENDED!] PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
// AzDO:
//   Define a Variable Group in your Azure DevOps Library and include this group in your pipeline:
//   Include these variables in the group (defined as secrets):
//     PLAYWRIGHT_SERVICE_URL
//     [NOT-RECOMMENDED!] PLAYWRIGHT_SERVICE_ACCESS_TOKEN
//   Include the Variable Group in the YML Pipeline:
//     variables:
//       - group: PlaywrightServiceSecrets
// ----------------------------------------------------------------------------------------------------

import { defineConfig } from '@playwright/test';
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config';

/* Learn more about service configuration at https://aka.ms/pww/docs/config */
export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 3 * 60 * 1000, // 3 minutes
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  })
);

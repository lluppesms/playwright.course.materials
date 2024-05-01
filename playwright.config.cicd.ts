import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: '#{PLAYWRIGHT_TEST_PATH}#',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // reporter: [['list'], ['json', {  outputFile: 'test-results.json' }]],
  // reporter: process.env.CI ? 'dot' : 'list',
  // reporter: [['html', { open: 'never' }]],
  // reporter: [['json', { outputFile: 'results.json' }]],

  reporter: process.env.CI ? 
  [
    ['html', { open: 'never' }],
    ['junit', { outputFile: '#{PLAYWRIGHT_RESULTS_PATH}#' }]
  ] : 
  [
    ['html', { open: 'never' }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: '#{PLAYWRIGHT_BASE_URL}#',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'

    // See: https://playwright.dev/docs/test-use-options
    // // Emulates `'prefers-colors-scheme'` media feature.
    // colorScheme: 'dark',

    // // Context geolocation.
    // geolocation: { longitude: 12.492507, latitude: 41.889938 },

    // // Emulates the user locale.
    // locale: 'en-GB',

    // // Grants specified permissions to the browser context.
    // permissions: ['geolocation'],

    // // Emulates the user timezone.
    // timezoneId: 'Europe/Paris',

    // // Viewport used for all pages in the context.
    // viewport: { width: 1280, height: 720 },    
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] }, },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] }, },
    // { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' }, },
    // { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, },

    /* Test against mobile viewports. */
    // { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] }, },
    // { name: 'Mobile Safari', use: { ...devices['iPhone 12'] }, },
  ],

  // // Folder for test artifacts such as screenshots, videos, traces, etc.
  // outputDir: 'test-results',

  // // path to the global setup and teardown files.
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),

  // // Each test is given 30 seconds.
  // timeout: 30000,

  // // update settings for assertions
  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 5000,
    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },
    toMatchSnapshot: {
      // An acceptable ratio of pixels that are different to the
      // total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 0.1,
    },
  },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

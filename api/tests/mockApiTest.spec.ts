import { Page, expect, test } from "@playwright/test"

test.describe('Mock API Tests', () => {

  test("mocks the fruit api but doesn't call the api", async ({ page }) => {
    // Mock the api call before navigating
    await page.route('*/**/api/v1/fruits', async route => {
        const json = [{ name: 'Strawberry', id: 21 }];
        await route.fulfill({ json });
    });
    await page.goto('https://demo.playwright.dev/api-mocking');
    await expect(page.getByText('Strawberry')).toBeVisible();
  });

  test('calls the fruit api and appends mock data to result', async ({ page }) => {
    await page.route('*/**/api/v1/fruits', async route => {
      const response = await route.fetch();
      const json = await response.json();
      json.push({ name: 'Loquat', id: 100 });
      await route.fulfill({ response, json });
    });
    await page.goto('https://demo.playwright.dev/api-mocking');
    await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
  });
});

/* this is not an API mock, but a web network mock example */
test('loads web page without images', async ({ page }) => {
  // Block png and jpeg images.
  await page.route(/(png|jpeg)$/, route => route.abort());
  await page.goto('https://playwright.dev');
});




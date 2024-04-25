const { test, expect } = require('@playwright/test');

var token

const bookingDetails = require('../testdata/booking-details.json');
  
test('should be get all the booking details', async ({ request }) => {
    const response = await request.get("/booking");
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

test('should be get specific booking details', async ({ request }) => {
    const response = await request.get('/booking/4');
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

test('should be able to get subset of booking details using query parameters', async ({ request }) => {
    const response = await request.get('/booking', {
    params: {
        firstname: "Susan",
        lastname: "Jackson"
      },
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

test('should be able to create a booking', async ({ request }) => {
    const response = await request.post("/booking", {
        data: {
            "firstname": "Jim",
            "lastname": "Brown",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2023-06-01",
                "checkout": "2023-06-15"
            },
            "additionalneeds": "Breakfast"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", "Jim");
    expect(responseBody.booking).toHaveProperty("lastname", "Brown");
    expect(responseBody.booking).toHaveProperty("totalprice", 111);
    expect(responseBody.booking).toHaveProperty("depositpaid", true);
});

test('should be able to create a booking providing the post body in a json file', async ({ request }) => {
    const response = await request.post("/booking", {
        data: bookingDetails
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", "Jim");
    expect(responseBody.booking).toHaveProperty("lastname", "Brown");
    expect(responseBody.booking).toHaveProperty("totalprice", 111);
    expect(responseBody.booking).toHaveProperty("depositpaid", true);
});

test('should be able to update the booking details', async ({ request }) => {
    // Create a Token which will be used in PUT request
    const response = await request.post('/auth', {
        data: {
        "username": "admin",
        "password": "password123"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("New Token is: " + token);

    // PUT
    const updateRequest = await request.put('/booking/4', {
        headers: {        
        'Cookie': `token=${token}`,
        },
        data: {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
        "checkin": "2023-06-01",
        "checkout": "2023-06-15"
        },
        "additionalneeds": "Breakfast"
        }
    });
    console.log(await updateRequest.json());
    expect(updateRequest.ok()).toBeTruthy();
    expect(updateRequest.status()).toBe(200);
    const updatedResponseBody = await updateRequest.json()
    expect(updatedResponseBody).toHaveProperty("firstname", "Jim");
    expect(updatedResponseBody).toHaveProperty("lastname", "Brown");
    expect(updatedResponseBody).toHaveProperty("totalprice", 111);
    expect(updatedResponseBody).toHaveProperty("depositpaid", true);
});   
    
test('should be able to delete the booking details', async ({ request }) => {   
    // Create a Token which will be used in DELETE request

    const response = await request.post('/auth', {
        data: {
        "username": "admin",
        "password": "password123"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("New Token is: " + token);

    // DELETE
    const deleteRequest = await request.delete('/booking/91', {
        headers: {        
        'Cookie': `token=${token}`,
        }
    });
    expect(deleteRequest.status()).toEqual(201);
    expect(deleteRequest.statusText()).toBe('Created');
});

test('Soft assertion test', async ({ page }) => {
    const response = await page.request.get("/booking");
    console.log(await response.json());
    await expect.soft(response.ok()).toBeTruthy();
    await expect(response.status()).toBe(200);
});

test('Custom Polling test', async ({ page }) => {
    await expect.poll(async () => {
        const response = await page.request.get('/booking');
        return response.status();
    }, {
        message: 'Response was either not 200 or timeout',
        intervals: [2_000, 4_000, 10_000],
        timeout: 60000,
    }).toBe(200);
});

test('Expect Retry test', async ({ page }) => {
    await expect(async () => {
        const response = await page.request.get('/booking');
        expect(response.status()).toBe(200);
    }).toPass();
});

test('Expect Custom Retry test', async ({ page }) => {
    await expect(async () => {
        const response = await page.request.get('/booking');
        expect(response.status()).toBe(200);
    }).toPass({
        intervals: [1_000, 2_000, 10_000],
        timeout: 60_000
    });
});


// test("mocks the fruit api and doesn't call api", async ({ page }) => {
//     // Mock the api call before navigating
//     await page.route('*/**/api/v1/fruits', async route => {
//         const json = [{ name: 'Strawberry', id: 21 }];
//         await route.fulfill({ json });
//     });
//     // Go to the page
//     await page.goto('https://demo.playwright.dev/api-mocking');

//     // Assert that the Strawberry fruit is visible
//     await expect(page.getByText('Strawberry')).toBeVisible();
// });

// test('mocking - appends data to api data', async ({ page }) => {
//     // Get the response and add to it
//     await page.route('*/**/api/v1/fruits', async route => {
//       const response = await route.fetch();
//       const json = await response.json();
//       json.push({ name: 'Loquat', id: 100 });
//       // Fulfill using the original response, while patching the response body
//       // with the given JSON object.
//       await route.fulfill({ response, json });
//     });
  
//     // Go to the page
//     await page.goto('https://demo.playwright.dev/api-mocking');
  
//     // Assert that the new fruit is visible
//     await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
// });

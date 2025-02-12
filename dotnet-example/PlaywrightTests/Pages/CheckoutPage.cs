using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests.Pages;
  
    public class CheckoutPage
    {
        private readonly IPage Page;

        public CheckoutPage(IPage page)
        {
            this.Page = page;
        }

        public async Task CheckoutAsync()
        {
            await Page.Locator("[data-test=\"checkout\"]").ClickAsync();
        }

        public async Task EnterCheckoutDetailsAsync(string firstName, string lastName, string postalCode)
        {
            await EnterFirstNameAsync(firstName);
            await EnterLastNameAsync(lastName);
            await EnterPostalCodeAsync(postalCode);
            await ContinueAsync();
        }

        public async Task EnterFirstNameAsync(string firstName)
        {
            await Page.Locator("[data-test=\"firstName\"]").FillAsync(firstName);
        }

        public async Task EnterLastNameAsync(string lastName)
        {
            await Page.Locator("[data-test=\"lastName\"]").FillAsync(lastName);
        }
        
        public async Task EnterPostalCodeAsync(string postalCode)
        {
            await Page.Locator("[data-test=\"postalCode\"]").FillAsync(postalCode);
        }

        public async Task ContinueAsync()
        {
            await Page.Locator("[data-test=\"continue\"]").ClickAsync();
        }

        public async Task VerifySummary(string itemName, string quantity, string itemprice, string total)
        {
            await Assertions.Expect(Page.Locator("[data-test=\"title\"]")).ToContainTextAsync("Checkout: Overview");
            await VerifyItemName(itemName);
            await VerifyItemQuantity(quantity);
            await VerifyItemPrice(itemprice);
            await VerifyTotal(total);
        }

        public async Task VerifyItemName(string itemName)
        {
            await Assertions.Expect(Page.Locator("[data-test=\"inventory-item-name\"]")).ToContainTextAsync(itemName);
        }

        public async Task VerifyItemQuantity(string quantity)
        {
            await Assertions.Expect(Page.Locator("[data-test=\"item-quantity\"]")).ToContainTextAsync(quantity);
        }

        public async Task VerifyItemPrice(string price)
        {
            await Assertions.Expect(Page.Locator("[data-test=\"inventory-item-price\"]")).ToContainTextAsync(price);
        }

        public async Task VerifyTotal(string total)
        {
            await Assertions.Expect(Page.Locator("[data-test=\"total-label\"]")).ToContainTextAsync(total);
        }

        public async Task ConfirmOrderAsync()
        {
            await Page.Locator("[data-test=\"finish\"]").ClickAsync();

        }

        public async Task VerifyOrderConfirmation()
        {
            await Assertions.Expect(Page.Locator("[data-test=\"title\"]")).ToContainTextAsync("Checkout: Complete!");
            await Assertions.Expect(Page.Locator("[data-test=\"complete-header\"]")).ToContainTextAsync("Thank you for your order!");
            await Assertions.Expect(Page.Locator("[data-test=\"complete-text\"]")).ToContainTextAsync("Your order has been dispatched, and will arrive just as fast as the pony can get there!");

        }

        public async Task GoBackToProductsAsync()
        {
            await Page.Locator("[data-test=\"back-to-products\"]").ClickAsync();
        }
    }

using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests.Pages;
    public class CartPage
    {
        private readonly IPage Page;

        public CartPage(IPage page)
        {
            this.Page = page;
        }

        public async Task AddToCartAsync(string itemName)
        {
            await Page.Locator($"[data-test=\"add-to-cart-{itemName}\"]").ClickAsync();
        }

        public async Task GoToCartAsync()
        {
            await Page.Locator("[data-test=\"shopping-cart-link\"]").ClickAsync();
        }

        public async Task VerifyCart()
        {
            await Assertions.Expect(Page.Locator("[data-test=\"shopping-cart-badge\"]")).ToContainTextAsync("1");
            await Assertions.Expect(Page.Locator("[data-test=\"cart\"]")).ToBeVisibleAsync();
        
        }
    }

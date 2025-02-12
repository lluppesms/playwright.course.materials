using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace PlaywrightTests.Pages;

    public class LoginPage
    {
        private readonly IPage Page;

        public LoginPage(IPage page)
        {
            this.Page = page;
        }
        
        public async Task EnterUsernameAsync(string username)
        {
            await Page.Locator("[data-test=\"username\"]").FillAsync(username);
        }
        public async Task EnterPasswordAsync(string password)
        {
            await Page.Locator("[data-test=\"password\"]").FillAsync(password);
        }

        public async Task ClickLoginBtnAsync()
        {
            await Page.Locator("[data-test=\"login-button\"]").ClickAsync();
        }

        public async Task Login(string username, string password)
        {
            await Page.GotoAsync("https://www.saucedemo.com/");
            await EnterUsernameAsync(username);
            await EnterPasswordAsync(password);
            await ClickLoginBtnAsync();
            await VerifyLogin();
        }

        public async Task VerifyLogin()
        {
            await Assertions.Expect(Page.Locator("[data-test=\"title\"]")).ToBeVisibleAsync();
        }

        public async Task LogoutAsync()
        {
            await Page.GetByRole(AriaRole.Button, new() { Name = "Open Menu" }).ClickAsync();
            await Page.Locator("[data-test=\"logout-sidebar-link\"]").ClickAsync();
            await Assertions.Expect(Page.Locator("[data-test=\"login-button\"]")).ToBeVisibleAsync();
        }
    }

using PlaywrightTests.Pages;
using PlaywrightTests.Reporting;
namespace PlaywrightTests;

[TestFixture]
public class WebTests : ReportGenerator
{
    private LoginPage loginPage;
    private CartPage cartPage;
    private CheckoutPage checkoutPage;

    [SetUp]
    public void SetUp()
    {
        loginPage = new LoginPage(Page);
        cartPage = new CartPage(Page);
        checkoutPage = new CheckoutPage(Page);
    }

    [Test]
    [CategoryAttribute("End to End Test to verify placing an order successfully")]
    [CategoryAttribute("priority=1")]
    [Author("johndoe")]
    public async Task CartCheckout()
    {
        ReportGenerator.extentTest?.Pass("Navigating to the home page and login");
        await loginPage.Login("standard_user", "secret_sauce");
        await loginPage.VerifyLogin();
        ReportGenerator.extentTest?.Pass("Logged in successfully");
        await cartPage.AddToCartAsync("sauce-labs-backpack");
        ReportGenerator.extentTest?.Pass("Adding sauce labs backpack item to the cart ");
        await cartPage.GoToCartAsync();
         ReportGenerator.extentTest?.Pass("Going to the cart");
        await checkoutPage.CheckoutAsync();
        ReportGenerator.extentTest?.Pass("Checking out the cart");
        await checkoutPage.EnterCheckoutDetailsAsync("John", "Doe", "12345");
        ReportGenerator.extentTest?.Pass("Entering checkout details");
        await checkoutPage.VerifySummary("Sauce Labs Backpack", "1", "$29.99", "$32.39");
        ReportGenerator.extentTest?.Pass("Verifying the summary");
        await checkoutPage.ConfirmOrderAsync();
        ReportGenerator.extentTest?.Pass("Confirming the order");
        await checkoutPage.VerifyOrderConfirmation();
        ReportGenerator.extentTest?.Pass("Order confirmed successfully");
        await checkoutPage.GoBackToProductsAsync();
        ReportGenerator.extentTest?.Pass("Navigating back to the products page");
        await loginPage.LogoutAsync(); 
        ReportGenerator.extentTest?.Pass("Logging out");
    }

    [TearDown]
    public async Task TearDown()
    {
        await Page.CloseAsync();
    }
}

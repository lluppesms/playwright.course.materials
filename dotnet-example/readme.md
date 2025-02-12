# Getting Started with Playwright for .NET

This guide provides a step-by-step introduction to setting up Playwright with .NET for browser automation and end-to-end testing.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) installed on your machine
- Familiarity with .NET unit testing frameworks like NUnit or MSTest

---

## Step 1: Create a New Project

First, create a new .NET test project using NUnit:

```bash
dotnet new nunit -n PlaywrightTests
cd PlaywrightTests
```

## Step 2: Add Playwright Dependency

Choose your preferred test framework and add the corresponding Playwright package:

For NUnit:

```bash
dotnet add package Microsoft.Playwright.NUnit
```

For MSTest:

```bash
dotnet add package Microsoft.Playwright.MSTest
```

## Step 3: Build the project

```bash
dotnet build
```

## Step 4: Install Required Browsers and Update .NET Version

To install Playwright's required browsers, use the following PowerShell command:

```bash
powershell.exe -File bin\Debug\net8.0\playwright.ps1 install
```

If pwsh is not available, you have to [install PowerShell](https://docs.microsoft.com/powershell/scripting/install/installing-powershell).

## Step 5: Write Your First Playwright Test

In your test project, add the following sample test to get started with Playwright:

```csharp
using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.MSTest;

namespace PlaywrightTests;

[TestClass]
public class ExampleTest : PageTest
{
    [TestMethod]
    public async Task HasTitle()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Expect a title to contain a substring.
        await Expect(Page).ToHaveTitleAsync(new Regex("Playwright"));
    }

    [TestMethod]
    public async Task GetStartedLink()
    {
        await Page.GotoAsync("https://playwright.dev");

        // Click the "Get started" link.
        await Page.GetByRole(AriaRole.Link, new() { Name = "Get started" }).ClickAsync();

        // Expect page to have a heading with the name "Installation."
        await Expect(Page.GetByRole(AriaRole.Heading, new() { Name = "Installation" })).ToBeVisibleAsync();
    } 
}
```

## Step 6: Run the Test

Run your tests with the following command:

```bash
dotnet test
```

## Step 7: Configure NUnit to Run Tests in Parallel

To enable parallel test execution in NUnit, create a .runsettings file in the root directory of your project and configure the settings as shown below:

Create a file named Chrome.runsettings.

Add the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- NUnit adapter -->  
  <NUnit>
    <NumberOfTestWorkers>24</NumberOfTestWorkers>
  </NUnit>
  <!-- General run configuration -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- For debugging selectors, it's recommend to set the following environment variable -->
      <DEBUG>pw:api</DEBUG>
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->  
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>10000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <Channel>msedge</Channel>
    </LaunchOptions>
  </Playwright>
</RunSettings>
```

When running tests, use the --settings option to specify the .runsettings file:

```bash
dotnet test --settings Chrome.runsettings
```

## Step 8: Configure Extent Reporting for NUnit Tests

1. Add ExtentReports Package
Install the ExtentReports package using the following command:

```bash
dotnet add package ExtentReports --version 5.0.4
```

2. Add ConfigurationManager Package

Install the ConfigurationManager package to handle app settings:

```bash
dotnet add package System.Configuration.ConfigurationManager --version 9.0.0
```

3. Run Your Tests

Execute the tests using the specified settings file:

```bash
dotnet test --settings Chrome.runsettings
```

4. Locate the HTML Report

After the tests run, an HTML report will be generated in the bin\Debug\net8.0 folder. Open the report in a browser to view test results.

For more details on configuring and customizing ExtentReports, visit the [Official Documentation](https://extentreports.com/docs/versions/4/net/index.html)

This guide should give you a solid start with Playwright and .NET. For further details, refer to the [Playwright documentation](https://playwright.dev/dotnet/docs/writing-tests).

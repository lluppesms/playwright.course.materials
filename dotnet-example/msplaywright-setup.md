# Set up Microsoft Azure Playwright Testing to run NUnit Tests at scale

This document provides a step-by-step guide to set up Microsoft Playwright testing in Azure for running tests at scale for NUnit Playwright project.

## Prerequisites

- Azure Subscription: Ensure you have an active Azure account.
- NUnit Playwright Project: A project configured with Playwright for NUnit.

---

## Step 1: Create a Workspace
- Sign in to the [Playwright Portal](https://aka.ms/mpt/portal) using your Azure account
- Create the Workspace and note down the Playwright Service URL for integration.


## Step 2: Set up Service Configuration in your project

1. Create a new file PlaywrightServiceSetup.cs in the root directory of your project. This file facilitates authentication of your client with the service.

2. Add the following content to it:
```csharp
using Azure.Developer.MicrosoftPlaywrightTesting.NUnit;
using NUnit.Framework;

namespace PlaywrightTests; // Remember to change this as per your project namespace

[SetUpFixture]
public class PlaywrightServiceSetup : PlaywrightServiceNUnit { };
```

## Step 3: Install Service Package
In your project, install Microsoft Playwright Testing package.
```bash
dotnet add package Azure.Developer.MicrosoftPlaywrightTesting.NUnit --prerelease
```

## Step 4: Add or update the .runsettings file for your project
1. Create or update a .runsettings file.
2. Add the following content:
```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
    <TestRunParameters>
        <!-- The below parameters are optional -->
        <Parameter name="Os" value="linux" />
        <!--<Parameter name="RunId" value="sample-run-id1" />-->
        <Parameter name="ServiceAuthType" value="EntraId" />
        <Parameter name="UseCloudHostedBrowsers" value="true" />
        <Parameter name="AzureTokenCredentialType" value="DefaultAzureCredential" />
        <!--<Parameter name="ManagedIdentityClientId" value="{clientId-value}" />-->
        <Parameter name="EnableGitHubSummary" value="false" />
        <!--<Parameter name="ExposeNetwork" value="*" />-->
    </TestRunParameters>
  <!-- NUnit adapter -->  
  <NUnit>
    <!-- Adjust parallel workers, parallel worker would also be bound by number of unit test files -->
    <NumberOfTestWorkers>10</NumberOfTestWorkers>
  </NUnit>
  <!-- General run configuration -->
  <RunConfiguration>
    <EnvironmentVariables>
      <!-- For debugging selectors, it's recommend to set the following environment variable -->
        <!--<DEBUG>pw:api*</DEBUG>--> 
    </EnvironmentVariables>
  </RunConfiguration>
  <!-- Playwright -->  
  <Playwright>
    <BrowserName>chromium</BrowserName>
    <ExpectTimeout>5000</ExpectTimeout>
    <LaunchOptions>
      <Headless>false</Headless>
      <!--Channel>msedge</Channel-->
    </LaunchOptions>
  </Playwright>
    <LoggerRunSettings>
        <Loggers>
            <!--microsoft playwright testing service logger for reporting -->
            <Logger friendlyName="microsoft-playwright-testing" enabled="True" />
            <!--could enable any logger additionally -->
            <Logger friendlyName="trx" enabled="false" />
        </Loggers>
    </LoggerRunSettings>
</RunSettings>
```

## Step 5: Update the workflow definition
Ensure your GitHub Actions workflow runs tests in Azure Playwright Testing Service. 
Refer the file in this [repo](.github\workflows\playwright-service.yml) 

## Step 6: To Setup Entra ID Authentication

1. Create App Registration in Entra ID
    - Go to Azure Portal > Microsoft Entra ID > App Registrations.
    - Create a new app registration.

2. Grant Permissions
    - Ensure the app has necessary permissions (e.g., Azure Service Management or Playwright service-specific permissions).

3. Configure GitHub Actions for OIDC
OIDC allows GitHub Actions to authenticate directly with Azure without storing credentials. Make sure you’ve followed the required setup:
    - Go to Azure Active Directory > App Registrations > Federated Credentials.
    - Create a new credential with:
        * Subject Identifier: repo:<OWNER>/<REPO>:branch:<branch_name>
        * Audience: api://AzureADTokenExchange.

4. Set Secrets in GitHub Actions
    - Add the following secrets:
       * AZURE_CLIENT_ID
       * AZURE_TENANT_ID
       * AZURE_SUBSCRIPTION_ID

5. Assign Contributor Role to App
    - Go to your Playwright Workspace in Azure Portal.
    - Navigate to Access Control (IAM) and assign the Contributor role to the app.


For configuring the Azure Playwright Testing service for Azure pipelines refer [here](https://learn.microsoft.com/en-us/azure/playwright-testing/quickstart-automate-end-to-end-testing?tabs=pipelines&pivots=nunit-test-runner)

For more details, refer to the [Microsoft Playwright Documentation](https://learn.microsoft.com/en-us/azure/playwright-testing/overview-what-is-microsoft-playwright-testing).


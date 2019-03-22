package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;

// This test class extends the class TestSetup meaning we can inherit
// the Before and After hooks to setup Selenium and Applitools
public class AuthVisualTest extends TestSetup {

    // The test relies on a Branding service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Branding API, rather than stand up an Branding API
    @Rule
    public WireMockRule brandingApi = new WireMockRule(3002);

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void loginVisualTest(){
        // First we start by mocking the branding API that will send all the branding API details.
        brandingApi.stubFor(get("/branding/")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withBody("{\"name\": \"Shady Meadows B&B\",\"map\": {\"latitude\": 52.6351204,\"longitude\": 1.2733774},\"logoUrl\": \"https://www.mwtestconsultancy.co.uk/img/rbp-logo.png\",\"description\": \"Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.\",\"contact\": {\"name\": \"Shady Meadows B&B\",\"address\": \"The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S\",\"phone\": \"012345678901\",\"email\": \"fake@fakeemail.com\"}}")));

        // Next, we start Applitools by calling the open method and giving it the Selenium WebDriver object
        // to interact with and then details about the check and finally a fixed browser size that Applitools will
        // resize the browser to.
        eyes.open(driver, "RBP","Login Visual Test", new RectangleSize(1400, 700));

        // Next we use Selenium to navigate to our page under test
        driver.navigate().to("http://localhost:8080/#/admin");

        // Finally we trigger the Applitools check by calling 'checkWindow' that will take a screenshot of the browser
        // and upload it to Applitools cloud to compare it against a previously stored image to compare the differences
        eyes.checkWindow("Login state");
    }

}

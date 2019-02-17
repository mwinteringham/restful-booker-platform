package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

public class HomeVisualTest extends TestSetup {

    // The test relies will need a room API so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Room API, rather than stand up an Room API
    @Rule
    public WireMockRule roomApi = new WireMockRule(3001);

    // The test also relies on an Branding service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Branding API, rather than stand up an Branding API
    @Rule
    public WireMockRule brandingApi = new WireMockRule(3002);

    @Test
    public void homeVisualTest(){
        // The UI is being checked in a 'stubbed state' meaning there are no backend APIs running. Therefore,
        // we can use WireMock to create fake APIs that send stubbed responses back to the UI to make it think
        // it is in a specific state.

        // First we start by mocking the branding API that will send all the branding API details. We will need
        // to create one for the CORS option request and one for the get request.
        brandingApi.stubFor(options(urlEqualTo("/branding/"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withHeader("Access-Control-Allow-Methods", "GET,HEAD,POST")
                        .withHeader("Access-Control-Allow-Headers", "content-type")
                        .withHeader("Access-Control-Allow-Credentials", "true")
                        .withHeader("Access-Control-Max-Age", "1800")
                        .withHeader("Allow", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH")));

        brandingApi.stubFor(get("/branding/")
                    .willReturn(aResponse()
                            .withStatus(200)
                            .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                            .withBody("{\"name\": \"Shady Meadows B&B\",\"map\": {\"latitude\": 52.6351204,\"longitude\": 1.2733774},\"logoUrl\": \"https://www.mwtestconsultancy.co.uk/img/rbp-logo.png\",\"description\": \"Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.\",\"contact\": {\"name\": \"Shady Meadows B&B\",\"address\": \"The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S\",\"phone\": \"012345678901\",\"email\": \"fake@fakeemail.com\"}}")));

        // Finally, we create a stubbed response for the Room API that will fill the UI with Rooms for the
        // rooms listing for us to check. We will need to create one for the CORS option request and one for
        // the get request
        roomApi.stubFor(options(urlEqualTo("/room/"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withHeader("Access-Control-Allow-Methods", "GET,HEAD,POST")
                        .withHeader("Access-Control-Allow-Headers", "content-type")
                        .withHeader("Access-Control-Allow-Credentials", "true")
                        .withHeader("Access-Control-Max-Age", "1800")
                        .withHeader("Allow", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH")));

        roomApi.stubFor(get("/room/")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withBody("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"accessible\":false,\"image\":\"https://www.mwtestconsultancy.co.uk/img/room1.jpg\",\"description\":\"Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.\",\"features\":[\"Wifi\",\"TV\",\"Safe\"]}]}")));

        // Next, we start Applitools by calling the open method and giving it the Selenium WebDriver object
        // to interact with and then details about the check and finally a fixed browser size that Applitools will
        // resize the browser to.
        eyes.open(driver, "RBP","Home Visual Test", new RectangleSize(1400, 700));
        eyes.setForceFullPageScreenshot(true);

        // Next we use Selenium to navigate to our page under test
        driver.navigate().to("http://localhost:3003/");

        // Finally we trigger the Applitools check by calling 'checkWindow' that will take a screenshot of the browser
        // and upload it to Applitools cloud to compare it against a previously stored image to compare the differences
        eyes.checkWindow("Home state");
    }

}

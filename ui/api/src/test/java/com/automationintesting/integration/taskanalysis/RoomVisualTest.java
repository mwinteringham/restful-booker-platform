package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;

// This test class extends the class TestSetup meaning we can inherit
// the Before and After hooks to setup Selenium and Applitools
public class RoomVisualTest extends TestSetup {

    // The test relies on an Auth service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Auth API, rather than stand up an Auth API
    @Rule
    public WireMockRule authApi = new WireMockRule(3004);

    // The test also will need a room API so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Room API, rather than stand up an Room API
    @Rule
    public WireMockRule roomApi = new WireMockRule(3001);

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void roomListVisualTest(){
        // The UI is being checked in a 'stubbed state' meaning there are no backend APIs running. Therefore,
        // we can use WireMock to create fake APIs that send stubbed responses back to the UI to make it think
        // it is in a specific state.

        // To do this, we need to programme the Auth API with two stubbed HTTP responses. The first is for
        // an OPTION http request that the browser will execute to check if it's safe to send a POST request.
        authApi.stubFor(options(urlEqualTo("/auth/validate"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withHeader("Access-Control-Allow-Methods", "GET,HEAD,POST")
                        .withHeader("Access-Control-Allow-Headers", "content-type")
                        .withHeader("Access-Control-Allow-Credentials", "true")
                        .withHeader("Access-Control-Max-Age", "1800")
                        .withHeader("Allow", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH")));

        // Once the browser receives the first stubbed response, it will trigger the browser to send a POST response
        // to check if the app is logged in. The second stubbed response below will make the frontend believe it is
        // in a logged in state.
        authApi.stubFor(post("/auth/validate")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")));

        // Finally, we create a stubbed response for the Room API that will fill the UI with Rooms for the
        // rooms listing for us to check.
        roomApi.stubFor(get("/room/")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withBody("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\"}]}")));

        // Next, we start Applitools by calling the open method and giving it the Selenium WebDriver object
        // to interact with and then details about the check and finally a fixed browser size that Applitools will
        // resize the browser to.
        eyes.open(driver, "RBP","Room List Visual Test", new RectangleSize(1400, 700));

        // Next we use Selenium to navigate to our page under test
        driver.navigate().to("http://localhost:3003/");

        // Finally we trigger the Applitools check by calling 'checkWindow' that will take a screenshot of the browser
        // and upload it to Applitools cloud to compare it against a previously stored image to compare the differences
        eyes.checkWindow("Room state");
    }

}

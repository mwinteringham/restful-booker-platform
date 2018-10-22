package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;

public class RoomVisualTest extends TestSetup {

    // The test relies on an Auth service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Auth API, rather than stand up an Auth API
    @Rule
    public WireMockRule authApi = new WireMockRule(3004);

    // The test also will need a room API so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Room API, rather than stand up an Room API
    @Rule
    public WireMockRule roomApi = new WireMockRule(3001);

    @Test
    public void roomListVisualTest(){
        authApi.stubFor(options(urlEqualTo("/auth/validate"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withHeader("Access-Control-Allow-Methods", "GET,HEAD,POST")
                        .withHeader("Access-Control-Allow-Headers", "content-type")
                        .withHeader("Access-Control-Allow-Credentials", "true")
                        .withHeader("Access-Control-Max-Age", "1800")
                        .withHeader("Allow", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH")));

        authApi.stubFor(post("/auth/validate")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")));

        roomApi.stubFor(get("/room/")
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Access-Control-Allow-Origin", "http://localhost:3003")
                        .withBody("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\"}]}")));

        eyes.open(driver, "RBP","Room List Visual Test", new RectangleSize(1400, 700));

        driver.navigate().to("http://localhost:3003/");

        eyes.checkWindow("Room state");
    }

}

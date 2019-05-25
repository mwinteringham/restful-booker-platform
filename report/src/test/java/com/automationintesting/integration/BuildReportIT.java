package com.automationintesting.integration;

import com.automationintesting.api.ReportApplication;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static io.restassured.RestAssured.given;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = ReportApplication.class)
@ActiveProfiles("dev")
public class BuildReportIT {

    @Rule
    public WireMockRule roomApi = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3001));

    @Rule
    public WireMockRule bookingApi = new WireMockRule(3000);

    @Before
    public void setupStubs(){
        roomApi.stubFor(get("/room")
                .willReturn(
                    aResponse()
                        .withHeader("Content-Type","application/json")
                        .withBody("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\"}, {\"roomid\":2,\"roomNumber\":102,\"type\":\"Single\",\"beds\":3,\"accessible\":true,\"details\":\"Wifi, TV, Mini-bar\"}]}")
                        .withStatus(200)));

        bookingApi.stubFor(get("/booking/?roomid=1")
                .willReturn(
                    aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{\"bookings\":[{\"bookingid\":1,\"roomid\":1,\"firstname\":\"James\",\"lastname\":\"Dean\",\"totalprice\":100,\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2018-01-01\",\"checkout\":\"2018-01-05\"}},{\"bookingid\":2,\"roomid\":1,\"firstname\":\"Mark\",\"lastname\":\"Winteringham\",\"totalprice\":200,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2018-02-01\",\"checkout\":\"2018-02-05\"}}]}")
                        .withStatus(200)));

        bookingApi.stubFor(get("/booking/?roomid=2")
                .willReturn(
                    aResponse()
                            .withHeader("Content-Type", "application/json")
                            .withBody("{\"bookings\":[{\"bookingid\":1,\"roomid\":2,\"firstname\":\"James\",\"lastname\":\"Dean\",\"totalprice\":100,\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2018-03-01\",\"checkout\":\"2018-03-05\"}},{\"bookingid\":2,\"roomid\":2,\"firstname\":\"Mark\",\"lastname\":\"Winteringham\",\"totalprice\":200,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2018-04-01\",\"checkout\":\"2018-04-05\"}}]}")
                            .withStatus(200)));

    }

    @Test
    public void testReportCreation(){
        Response reportResponse = given()
                                    .get("http://localhost:3005/report");

        Approvals.verify(reportResponse.body().prettyPrint());
    }

    @Test
    public void testSpecificRoomReportCreation(){
        Response reportResponse = given()
                                    .get("http://localhost:3005/report/room/1");

        Approvals.verify(reportResponse.getBody().prettyPrint());
    }

}

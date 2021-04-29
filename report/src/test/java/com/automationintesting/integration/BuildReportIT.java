package com.automationintesting.integration;

import com.automationintesting.api.ReportApplication;
import com.xebialabs.restito.server.StubServer;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.*;
import static com.xebialabs.restito.semantics.Condition.get;
import static com.xebialabs.restito.semantics.Condition.parameter;
import static io.restassured.RestAssured.given;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = ReportApplication.class)
@ActiveProfiles("dev")
public class BuildReportIT {

    private final StubServer roomApi = new StubServer(3001).run();
    private final StubServer bookingApi = new StubServer(3000).run();

    @BeforeEach
    public void setupRestito(){
        whenHttp(roomApi).
                match(get("/room")).
                then(ok(), header("Content-Type","application/json"), stringContent("{\"rooms\":[{\"roomid\":1,\"roomNumber\":101,\"type\":\"Twin\",\"beds\":2,\"accessible\":false,\"details\":\"Wifi, TV, Mini-bar\"}, {\"roomid\":2,\"roomNumber\":102,\"type\":\"Single\",\"beds\":3,\"accessible\":true,\"details\":\"Wifi, TV, Mini-bar\"}]}"));

        whenHttp(bookingApi).
                match(get("/booking/"), parameter("roomid", "1")).
                then(ok(),  header("Content-Type","application/json"), stringContent("{\"bookings\":[{\"bookingid\":1,\"roomid\":1,\"firstname\":\"James\",\"lastname\":\"Dean\",\"totalprice\":100,\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2018-01-01\",\"checkout\":\"2018-01-05\"}},{\"bookingid\":2,\"roomid\":1,\"firstname\":\"Mark\",\"lastname\":\"Winteringham\",\"totalprice\":200,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2018-02-01\",\"checkout\":\"2018-02-05\"}}]}"));

        whenHttp(bookingApi).
                match(get("/booking/"), parameter("roomid", "2")).
                then(ok(),  header("Content-Type","application/json"), stringContent("{\"bookings\":[{\"bookingid\":1,\"roomid\":2,\"firstname\":\"James\",\"lastname\":\"Dean\",\"totalprice\":100,\"depositpaid\":true,\"bookingdates\":{\"checkin\":\"2018-03-01\",\"checkout\":\"2018-03-05\"}},{\"bookingid\":2,\"roomid\":2,\"firstname\":\"Mark\",\"lastname\":\"Winteringham\",\"totalprice\":200,\"depositpaid\":false,\"bookingdates\":{\"checkin\":\"2018-04-01\",\"checkout\":\"2018-04-05\"}}]}"));
    }

    @AfterEach
    public void stopServer() throws InterruptedException {
        roomApi.stop();
        bookingApi.stop();

        // Mocking is too slow to kill APIs so we have to pause the run to let it catchup
        Thread.sleep(1500);
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

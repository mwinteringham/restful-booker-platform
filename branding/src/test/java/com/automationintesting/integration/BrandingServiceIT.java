package com.automationintesting.integration;

import com.automationintesting.api.BrandingApplication;
import com.automationintesting.model.db.Branding;
import com.automationintesting.model.db.Contact;
import com.automationintesting.model.db.Map;
import com.xebialabs.restito.server.StubServer;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.glassfish.grizzly.http.util.HttpStatus;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.xebialabs.restito.builder.stub.StubHttp.whenHttp;
import static com.xebialabs.restito.semantics.Action.status;
import static com.xebialabs.restito.semantics.Condition.post;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BrandingApplication.class)
@ActiveProfiles("dev")
public class BrandingServiceIT {

    StubServer server = new StubServer(3004).run();

    @BeforeEach
    public void setupRestito(){
        whenHttp(server).
                match(post("/auth/validate")).
                then(status(HttpStatus.OK_200));
    }

    @AfterEach
    public void stopServer() throws InterruptedException {
        server.stop();

        // Mock takes time to stop so we have to wait for it to complete
        Thread.sleep(1500);
    }

    @Test
    public void returnsBrandingData() {
        Response brandingResponse =  given()
                .when()
                .get("http://localhost:3002/branding/");

        Approvals.verify(brandingResponse.getBody().prettyPrint());
    }

    @Test
    public void updateBrandingData() {
        Branding brandingPayload = new Branding(
                "Updated hotel name",
                new Map(50.0, 50.0),
                "https://www.valid.com/link/to/logo",
                "Description update",
                new Contact("Update name", "Update address", "9999999999", "update@email.com")
        );

        Response brandingPutResponse = given()
                .cookie("token", "abc123")
                .contentType(ContentType.JSON)
                .body(brandingPayload)
                .when()
                .put("http://localhost:3002/branding/");

        Approvals.verify(brandingPutResponse.body().prettyPrint());
    }

    @Test
    public void testPutValidation() {
        Branding brandingPayload = new Branding.BrandingBuilder()
                .build();

        Response response = given()
                .contentType(ContentType.JSON)
                .body(brandingPayload)
                .when()
                .put("http://localhost:3002/branding/");

        assertEquals(response.statusCode(), 400);
    }

}

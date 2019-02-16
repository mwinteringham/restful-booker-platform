package com.automationintesting.integration;

import com.automationintesting.api.BrandingApplication;
import com.automationintesting.model.*;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BrandingApplication.class)
@ActiveProfiles("dev")
public class BrandingServiceIT {

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
                "link/to/logo",
                "Description update",
                new Contact("Update name", "Update address", "9999999999", "update@email.com")
        );

        Response brandingPutResponse = given()
                .contentType(ContentType.JSON)
                .body(brandingPayload)
                .when()
                .put("http://localhost:3002/branding/");

        Approvals.verify(brandingPutResponse.body().prettyPrint());
    }

}

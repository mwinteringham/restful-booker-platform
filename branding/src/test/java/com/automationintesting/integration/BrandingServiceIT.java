package com.automationintesting.integration;

import com.automationintesting.api.BrandingApplication;
import com.automationintesting.model.*;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static io.restassured.RestAssured.given;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BrandingApplication.class)
@ActiveProfiles("dev")
public class BrandingServiceIT {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3004));

    @Before
    public void setupWiremock(){
        stubFor(post("/auth/validate")
                .withRequestBody(equalToJson("{ \"token\": \"abc123\" }"))
                .willReturn(aResponse().withStatus(200)));
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
                "link/to/logo",
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

        assertThat(response.statusCode(), is(400));
    }

}

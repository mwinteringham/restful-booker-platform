package com.automationintesting.integration.example;

import com.automationintesting.api.AuthApplication;
import com.automationintesting.model.Auth;
import com.automationintesting.model.Token;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = AuthApplication.class)
@ActiveProfiles("dev")
public class TaskAnalysisIntegrationTest {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testLoginAPIEndpoint(){
        // Our post request to the Auth API requires a body, so we create a new
        // auth payload to send in our HTTP request
        Auth authPayload = new Auth("admin", "password");

        // Using rest-assured, we create our HTTP post request with the necessary
        // details plus the auth body and send it to the API before storing the response
        // for later use
        Response authResponse = given()
                                  .contentType(ContentType.JSON)
                                  .body(authPayload)
                                  .post("http://localhost:3004/auth/login");

        // We are checking two different things for two different risks we identified
        // in the API. The first being the API takes the request (by checking that a 404
        // is not returned) and the second being the response sends back the correct
        // body back in the form of a token.
        assertNotEquals(authResponse.getStatusCode(), 404);
        assertEquals(authResponse.as(Token.class).getToken().getClass(), String.class);
    }

}

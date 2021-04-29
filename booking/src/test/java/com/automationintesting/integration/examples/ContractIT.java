package com.automationintesting.integration.examples;

import com.automationintesting.api.BookingApplication;
import io.restassured.response.Response;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.util.Scanner;

import static io.restassured.RestAssured.given;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class ContractIT {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    public void checkAuthContract() throws JSONException, FileNotFoundException, URISyntaxException {
        // First we make an HTTP request to get the Booking from Booking API
        Response response = given()
                                .get("http://localhost:3000/booking/1");

        // Next we take the body of the HTTP response and convert it into a JSONObject
        JSONObject parsedResponse = new JSONObject(response.body().prettyPrint());

        // Then we import our expected JSON contract from the contract folder
        // and store in a string
        File file = ResourceUtils.getFile(this.getClass().getResource("/contract.json"));
        String testObject = new Scanner(file).useDelimiter("\\Z").next();

        // Finally we compare the contract string and the JSONObject to compare
        // and pass if they match
        JSONAssert.assertEquals(testObject, parsedResponse, true);
    }

}

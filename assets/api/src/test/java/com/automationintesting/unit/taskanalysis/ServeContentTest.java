package com.automationintesting.unit.taskanalysis;

import com.automationintesting.UiApplication;
import io.restassured.response.Response;
import org.approvaltests.Approvals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static io.restassured.RestAssured.given;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = UiApplication.class)
public class ServeContentTest {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void checkUiServesStaticContent(){
        // Using rest-assured, we send an HTTP request to the UI API and
        // store the response
        Response response = given()
                              .get("http://localhost:3003/");

        // The response body is expected to be in HTML format. So rather than use
        // complex asserts we use ApprovalTests to verify the body string against
        // a previously saved body in the *.approved.txt file.
        Approvals.verify(response.prettyPrint());
    }

}

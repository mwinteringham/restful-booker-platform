import api.BookingApi;
import api.BookingApplication;
import com.jayway.restassured.response.Response;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Scanner;

public class ContractTest {

    // We need to ensure that our API is up and running so we will
    // create an ApplicationContexts to startup and teardown
    private ApplicationContext bookingApp;

    // The @Before annotation means that this method will be run before
    // the test is run
    @Before
    public void setup(){
        // First we start up the Booking API. By importing the BookingApplication
        // class from the Booking module to run.
        bookingApp = SpringApplication.run(BookingApplication.class);
    }

    // The @After annotation means that this method will be run after
    // the test is run
    @After
    public void teardown(){
        // We call exit on the end of the test to close the API down
        SpringApplication.exit(bookingApp);
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    public void checkAuthContract() throws JSONException, FileNotFoundException, URISyntaxException {
        // First we make an HTTP request to get the Booking from Booking API
        Response response = BookingApi.getBooking(1);

        // Next we take the body of the HTTP response and convert it into a JSONObject
        JSONObject parsedResponse = new JSONObject(response.body().prettyPrint());

        // Then we import our expected JSON contract from the contract folder
        // and store in a string
        URL contractPath = getClass().getResource("contract.json");
        String testObject = new Scanner(new File(contractPath.toURI())).useDelimiter("\\Z").next();

        // Finally we compare the contract string and the JSONObject to compare
        // and pass if they match
        JSONAssert.assertEquals(testObject, parsedResponse, true);
    }

}

import api.BookingApi;
import com.jayway.restassured.response.Response;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Scanner;

public class ContractIntegrationTest {

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

package api;

import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.response.Response;
import payload.Booking;

import static com.jayway.restassured.RestAssured.given;

public class BookingApi {

    private final static String baseUrl = "http://localhost:3000";

    public static Response postBooking(String token, Booking payload){
        // We are using RestAssured to set the Content Type, the Cookie
        // add the payload before sending a POST http request to the
        // Booking endpoint
        return given()
                .cookie("token", token)
                .contentType(ContentType.JSON)
                .body(payload)
                .when()
                .post(baseUrl + "/booking");
    }

}

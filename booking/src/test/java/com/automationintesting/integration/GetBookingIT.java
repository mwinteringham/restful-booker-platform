package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class GetBookingIT {

    @Test
    public void getValidBooking(){
        Response response = given()
                                .get("http://localhost:3000/booking/1");

        assertEquals(response.getStatusCode(), 200);
    }

    @Test
    public void getInvalidBooking(){
        Response response = given()
                .get("http://localhost:3000/booking/1000");

        response.getBody().prettyPrint();

        assertEquals(response.getStatusCode(), 404);
    }

}

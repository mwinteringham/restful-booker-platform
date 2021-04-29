package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.model.db.Booking;
import io.restassured.http.ContentType;
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
public class BookingValidationIT {

    @Test
    public void testPostValidation() {
        Booking bookingPayload = new Booking.BookingBuilder()
                                        .setEmail("mark@mwtestconsultancy.co.uk")
                                        .setPhone("01234123123")
                                        .build();

        Response response = given()
            .contentType(ContentType.JSON)
            .body(bookingPayload)
            .when()
            .post("http://localhost:3000/booking/");

        assertEquals(response.statusCode(), 400);
    }

    @Test
    public void testPutValidation() {
        Booking bookingPayload = new Booking.BookingBuilder()
                .setEmail("mark@mwtestconsultancy.co.uk")
                .setPhone("01234123123")
                .build();

        Response response = given()
                .contentType(ContentType.JSON)
                .body(bookingPayload)
                .when()
                .put("http://localhost:3000/booking/1");

        assertEquals(response.statusCode(), 400);
    }

}

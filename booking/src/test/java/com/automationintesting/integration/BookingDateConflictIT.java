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

import java.time.LocalDate;
import java.time.Month;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class BookingDateConflictIT {

    @Test
    public void testBookingConflict(){
        String token = "abc123";

        LocalDate checkindate = LocalDate.of(2020, Month.FEBRUARY, 1);
        LocalDate checkoutdate = LocalDate.of(2020, Month.FEBRUARY, 2);

        Booking bookingPayload = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
                .setEmail("mark@mwtestconsultancy.co.uk")
                .setPhone("01234123123")
                .build();

        given()
            .cookie("token", token)
            .contentType(ContentType.JSON)
            .body(bookingPayload)
            .when()
            .post("http://localhost:3000/booking/");

        Response bookingResponse = given()
                                    .cookie("token", token)
                                    .contentType(ContentType.JSON)
                                    .body(bookingPayload)
                                    .when()
                                    .post("http://localhost:3000/booking/");

        assertEquals(409, bookingResponse.statusCode());
    }

    @Test
    public void testBookingDatesInvalid() {
        LocalDate checkindate = LocalDate.of(2018, Month.JANUARY, 1);
        LocalDate checkoutdate = LocalDate.of(2018, Month.JANUARY, 5);

        Booking bookingPayload = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
                .setEmail("mark@mwtestconsultancy.co.uk")
                .setPhone("01234123123")
                .build();

        given()
            .contentType(ContentType.JSON)
            .body(bookingPayload)
            .when()
            .post("http://localhost:3000/booking/");

        Response bookingResponse = given()
                .contentType(ContentType.JSON)
                .body(bookingPayload)
                .when()
                .post("http://localhost:3000/booking/");

        assertEquals(409, bookingResponse.statusCode());
    }

}

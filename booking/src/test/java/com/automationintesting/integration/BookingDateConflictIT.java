package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.model.db.Booking;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.GregorianCalendar;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class BookingDateConflictIT {

    @Test
    public void testBookingConflict(){
        String token = "abc123";

        Date checkindate = new GregorianCalendar(2018,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(2018,1,2).getTime();

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

        assertThat(bookingResponse.statusCode(), equalTo(409));
    }

    @Test
    public void testBookingDatesInvalid() {
        Date checkindate = new GregorianCalendar(2018,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(2018,1,5).getTime();

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

        assertThat(bookingResponse.statusCode(), equalTo(409));
    }

}

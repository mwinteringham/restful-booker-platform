package com.automationintesting.integration;

import api.BookingApplication;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import model.Booking;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.GregorianCalendar;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class BookingDateConflictIT {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(3004);

    @Before
    public void setupWiremock(){
        stubFor(post("/auth/validate")
                .withRequestBody(equalToJson("{ \"token\": \"abc123\" }"))
                .willReturn(aResponse().withStatus(200)));
    }

    @Test
    public void testBookingConflict(){
        String token = "abc123";

        Date checkindate = new GregorianCalendar(2018,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(2018,1,2).getTime();

        Booking bookingPayload = new Booking.BookingBuilder()
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setTotalprice(200)
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
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
        String token = "abc123";

        Date checkindate = new GregorianCalendar(2018,1,5).getTime();
        Date checkoutdate = new GregorianCalendar(2018,1,1).getTime();

        Booking bookingPayload = new Booking.BookingBuilder()
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setTotalprice(200)
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
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

        assertThat(bookingResponse.statusCode(), equalTo(400));
        assertThat(bookingResponse.getBody().prettyPrint(), equalTo("Dates must be set and Checkout must be after Checkin"));
    }

}

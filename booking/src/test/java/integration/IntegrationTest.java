package integration;

import api.BookingApplication;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import model.Booking;
import model.CreatedBooking;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.GregorianCalendar;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
public class IntegrationTest {

    // Booking relies on an Auth service so we add the JUnit rule to setup Wiremock which
    // will mock the behaviour of the Auth service, rather than stand up an Auth service
    @Rule
    public WireMockRule wireMockRule = new WireMockRule(3004);

    // We add the @Before annotation so that when JUnit runs it knows to run this method before
    // the tests are started. This is known as a hook.
    @Before
    // We give the before hook a clear name to ensure that it is descriptive in what it is checking
    public void setupWiremock(){
        // Configure Wiremock for the Auth service to send a positive validate response
        stubFor(post("/auth/validate")
                .withRequestBody(equalToJson("{ \"token\": \"abc123\" }"))
                .willReturn(aResponse().withStatus(200)));
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreateBooking(){
        // We create a fake token that is required for our request. WireMock will check that the token
        // exists but it won't process whether it is valid or not.
        String token = "abc123";

        // We next create our booking payload to send to the Booking webservice
        Booking bookingPayload = new Booking.BookingBuilder()
                                            .setFirstname("Mark")
                                            .setLastname("Winteringham")
                                            .setTotalprice(200)
                                            .setDepositpaid(true)
                                            .setCheckin(new GregorianCalendar(2018,1,1).getTime())
                                            .setCheckout(new GregorianCalendar(2018,1,2).getTime())
                                            .build();

        // We then send our request to the Booking webservice to create our booking
        Response bookingResponse = given()
                                    .cookie("token", token)
                                    .contentType(ContentType.JSON)
                                    .body(bookingPayload)
                                   .when()
                                    .post("http://localhost:3000/booking/");

        // Once we get a response we extract the body and map it to CreatedBooking
        CreatedBooking response = bookingResponse.as(CreatedBooking.class);

        // Finally we assert on the various values we get from the HTTP response body
        assertThat(response.getBooking().getFirstname(), is("Mark"));
        assertThat(response.getBooking().getLastname(), is("Winteringham"));
        assertThat(response.getBooking().getTotalprice(), is(200));
        assertThat(response.getBooking().isDepositpaid(), is(true));
        assertThat(response.getBooking().getBookingDates().getCheckin().toString(), containsString("Thu Feb 01"));
        assertThat(response.getBooking().getBookingDates().getCheckout().toString(), containsString("Fri Feb 02"));
    }


//    ...Integration check suggestions
//
//    Check each service integrates and read / writes to the MySQL service
//    Check each service integrates with the Auth web service
//    Check room and booking services integrate with one another

}

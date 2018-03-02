import api.AuthApi;
import api.AuthApplication;
import api.BookingApi;
import api.BookingApplication;
import com.jayway.restassured.response.Response;
import model.Token;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import payload.AuthPayload;
import payload.Booking;
import payload.CreatedBooking;

import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BookingIntegrationTest {

    // We need to ensure that our APIs are up and running so we will
    // create two ApplicationContexts to startup and teardown
    private ApplicationContext bookingApp;
    private ApplicationContext authApp;

    // The @Before annotation means that this method will be run before
    // the test is run
    @Before
    public void setup(){
        // First we start up the Auth API. We set the port we want the
        // API to run on and then import that AuthApplication class from
        // the Auth module to run.
        System.setProperty("server.port", "3004");
        authApp = SpringApplication.run(AuthApplication.class);

        // Second we start up the Booking API. We set the port we want the
        // API to run on and then import that BookingApplication class from
        // the Booking module to run.
        System.setProperty("server.port", "3000");
        bookingApp = SpringApplication.run(BookingApplication.class);
    }

    // The @After annotation means that this method will be run after
    // the test is run
    @After
    public void teardown(){
        // We call exit on both apps to close them down cleanly
        SpringApplication.exit(bookingApp);
        SpringApplication.exit(authApp);
    }

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testCreateBooking(){
        // First we need to set up a payload with the correct authorisation details
        // to send to the Auth webservice
        AuthPayload authPayload = new AuthPayload("admin", "password");

        // Next we send an HTTP request to the Auth service
        Response authResponse = AuthApi.postAuth(authPayload);

        // Once we have successfully sent the HTTP request and got an HTTP response,
        // we can extract the Response body and map it to a Token object. Then finally
        // call getToken to get the Token value.
        String token = authResponse.as(Token.class).getToken();

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
        Response bookingResponse = BookingApi.postBooking(token, bookingPayload);

        // Once we get a response we extract the body and map it to CreatedBooking
        CreatedBooking response = bookingResponse.as(CreatedBooking.class);

        // Finally we assert on the various values we get from the HTTP response body
        assertThat(response.getBooking().getFirstname(), is("Mark"));
        assertThat(response.getBooking().getLastname(), is("Winteringham"));
        assertThat(response.getBooking().getTotalprice(), is(200));
        assertThat(response.getBooking().isDepositpaid(), is(true));
        assertThat(response.getBooking().getBookingDates().getCheckin().toString(), is("Thu Feb 01 00:00:00 GMT 2018"));
        assertThat(response.getBooking().getBookingDates().getCheckout().toString(), is("Fri Feb 02 00:00:00 GMT 2018"));
    }


//    ...Integration check suggestions
//
//    Check each service integrates and read / writes to the MySQL service
//    Check each service integrates with the Auth web service
//    Check hotel and booking services integrate with one another

}

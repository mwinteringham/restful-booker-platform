package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import com.automationintesting.model.Booking;
import com.github.tomakehurst.wiremock.common.ConsoleNotifier;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
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

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class MessageRequestIT {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(WireMockConfiguration.options().notifier(new ConsoleNotifier(true)).port(3006));

    @Before
    public void setupWiremock(){
        stubFor(post("/message/")
                .willReturn(aResponse().withStatus(200)));
    }

    @Test
    public void testSendingToMessageAPI(){
        Date checkindate = new GregorianCalendar(1990,1,1).getTime();
        Date checkoutdate = new GregorianCalendar(1990,1,2).getTime();

        Booking bookingPayload = new Booking.BookingBuilder()
                .setFirstname("Mark")
                .setLastname("Winteringham")
                .setTotalprice(200)
                .setDepositpaid(true)
                .setCheckin(checkindate)
                .setCheckout(checkoutdate)
                .setEmail("mark@mwtestconsultancy.co.uk")
                .setPhone("01292123456")
                .build();

        Response bookingResponse = given()
                .contentType(ContentType.JSON)
                .body(bookingPayload)
                .when()
                .post("http://localhost:3000/booking/");

        verify(postRequestedFor(urlEqualTo("/message/"))
                .withRequestBody(equalToJson("{\n" +
                        "  \"name\" : \"Mark Winteringham\",\n" +
                        "  \"email\" : \"mark@mwtestconsultancy.co.uk\",\n" +
                        "  \"phone\" : \"01292123456\",\n" +
                        "  \"subject\" : \"You have a new booking!\",\n" +
                        "  \"description\" : \"You have a new booking from Mark Winteringham. They have booked a room for the following dates: 1990-02-01 to 1990-02-02\"\n" +
                        "}")));
    }

}

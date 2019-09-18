package com.automationintesting.integration;

import com.automationintesting.api.BookingApplication;
import io.restassured.response.Response;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = BookingApplication.class)
@ActiveProfiles("dev")
public class GetBookingIT {

    @Test
    public void getValidBooking(){
        Response response = given()
                                .get("http://localhost:3000/booking/1");

        assertThat(response.getStatusCode(), is(200));
    }

    @Test
    public void getInvalidBooking(){
        Response response = given()
                .get("http://localhost:3000/booking/1000");

        response.getBody().prettyPrint();

        assertThat(response.getStatusCode(), is(404));
    }

}

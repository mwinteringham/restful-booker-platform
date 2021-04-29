package com.automationintesting.integration;

import com.automationintesting.api.RoomApplication;
import com.automationintesting.model.db.Room;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = RoomApplication.class)
@ActiveProfiles("dev")
public class RoomValidationIT {

    @Test
    public void testPostValidation() {
        Room bookingPayload = new Room.RoomBuilder()
                                        .build();
        Response response = given()
            .contentType(ContentType.JSON)
            .body(bookingPayload)
            .when()
            .post("http://localhost:3001/room/");

        assertEquals(response.statusCode(), 400);
    }

    @Test
    public void testPutValidation() {
        Room bookingPayload = new Room.RoomBuilder()
                                      .build();

        Response response = given()
                .contentType(ContentType.JSON)
                .body(bookingPayload)
                .when()
                .put("http://localhost:3001/room/1");

        assertEquals(response.statusCode(), 400);
    }

}

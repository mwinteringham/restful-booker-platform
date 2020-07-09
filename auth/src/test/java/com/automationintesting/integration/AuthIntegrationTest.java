package com.automationintesting.integration;

import com.automationintesting.api.AuthApplication;
import com.automationintesting.model.Auth;
import com.automationintesting.model.Token;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static io.restassured.RestAssured.given;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = AuthApplication.class)
@ActiveProfiles("dev")
public class AuthIntegrationTest {

    private Token token;

    @Before
    public void createToken(){
        Auth authPayload = new Auth("admin", "password");

        token = given()
                .contentType(ContentType.JSON)
                .body(authPayload)
                .post("http://localhost:3004/auth/login")
                .as(Token.class);
    }

    @Test
    public void testValidateEndpoint(){
        Response response = given()
                            .contentType(ContentType.JSON)
                            .body(token)
                            .post("http://localhost:3004/auth/validate");

        assertEquals(response.getStatusCode(), 200);
    }

    @Test
    public void testLogoutEndpoint(){
        Response response = given()
                .contentType(ContentType.JSON)
                .body(token)
                .post("http://localhost:3004/auth/logout");

        assertEquals(response.getStatusCode(), 200);
    }

}

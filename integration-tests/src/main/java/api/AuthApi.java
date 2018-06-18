package api;

import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.response.Response;
import payload.AuthPayload;
import payload.TokenPayload;

import static com.jayway.restassured.RestAssured.given;

public class AuthApi {

    private final static String baseUrl = "http://localhost:3004";

    public static Response postAuth(AuthPayload payload){
        // We are using RestAssured to set the Content Type and
        // add the payload before sending a POST http request
        // to the Auth endpoint
        return given()
                .contentType(ContentType.JSON)
                .body(payload)
               .when()
                .post(baseUrl + "/login");
    }

}

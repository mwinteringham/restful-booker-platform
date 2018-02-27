package Requests;

import model.Token;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

public class Auth {

    final static String uri = "http://" + System.getenv("authDomain") + ":3004/validate";

    public static boolean postCheckAuth(String tokenValue){
        Token token = new Token(tokenValue);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Token> httpEntity = new HttpEntity<Token>(token, requestHeaders);

        try{
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, httpEntity, String.class);
            if(response.getStatusCodeValue() == 200){
                return true;
            } else {
                return false;
            }
        } catch (HttpClientErrorException e){
            return false;
        }
    }

}

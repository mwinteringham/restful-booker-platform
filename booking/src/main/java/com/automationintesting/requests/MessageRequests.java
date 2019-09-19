package com.automationintesting.requests;

import com.automationintesting.model.db.Message;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

public class MessageRequests {

    private String host;

    public MessageRequests() {
        if(System.getenv("messageDomain") == null){
            host = "http://localhost:3006";
        } else {
            host = "http://" + System.getenv("messageDomain") + ":3006";
        }
    }

    public boolean postMessage(Message message){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Message> httpEntity = new HttpEntity<Message>(message, requestHeaders);

        try{
            ResponseEntity<String> response = restTemplate.exchange(host + "/message/", HttpMethod.POST, httpEntity, String.class);
            return response.getStatusCodeValue() == 200;
        } catch (HttpClientErrorException e){
            return false;
        }
    }

}

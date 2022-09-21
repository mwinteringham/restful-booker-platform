package com.automationintesting.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Enumeration;

@Service
public class ProxyService {

    public ResponseEntity<String> passthroughRequest(String body, HttpMethod method, HttpServletRequest request) throws URISyntaxException {
        String requestUrl = request.getRequestURI();

        URI uri = new URI("http", null, "localhost", 0, null, null, null);
        int port = derivePortNumber(requestUrl);

        uri = UriComponentsBuilder.fromUri(uri)
                .port(port)
                .path(requestUrl)
                .query(request.getQueryString())
                .build(true).toUri();

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        HttpEntity<String> httpEntity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            return restTemplate.exchange(uri, method, httpEntity, String.class);
        } catch(HttpStatusCodeException e) {
            return ResponseEntity.status(e.getRawStatusCode())
                    .body(e.getResponseBodyAsString());
        }
    }

    private int derivePortNumber(String requestUrl) {
        if(requestUrl.contains("/booking")){
            return 3000;
        } else if(requestUrl.contains("/room")){
            return 3001;
        } else if(requestUrl.contains("/branding")){
            return 3002;
        } else if(requestUrl.contains("/auth")){
            return 3004;
        } else if(requestUrl.contains("/report")){
            return 3005;
        } else if(requestUrl.contains("/message")){
            return 3006;
        } else {
            return 3003;
        }
    }

}

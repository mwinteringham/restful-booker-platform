package com.automationintesting.api;

import com.automationintesting.service.ProxyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.net.URISyntaxException;

@RestController
public class ProxyController {

    @Autowired
    ProxyService proxyService;

    @RequestMapping(value = "/**")
    public ResponseEntity<String> proxy(@RequestBody(required = false) String body, HttpMethod method, HttpServletRequest request) throws URISyntaxException {
        return proxyService.passthroughRequest(body, method, request);
    }

}

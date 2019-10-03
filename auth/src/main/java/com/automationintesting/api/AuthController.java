package com.automationintesting.api;

import com.automationintesting.app.AuthApp;
import com.automationintesting.app.Tokens;
import com.automationintesting.model.Auth;
import com.automationintesting.model.Decision;
import com.automationintesting.model.Token;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private AuthApp authApp;

    public AuthController() {
        authApp = new AuthApp();
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<Token> createToken(@RequestBody Auth auth) {
        Decision credentialDecision = authApp.decideOnTokenGeneration(auth.getUsername(), auth.getPassword());

        if(credentialDecision.getResult()){
            return ResponseEntity.ok(credentialDecision.getToken());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @RequestMapping(value = "/validate", method = RequestMethod.POST)
    public ResponseEntity<Token> validateToken(@RequestBody Token token) {
        boolean isValidToken = Tokens.verify(token.getToken());

        if(isValidToken){
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity clearToken(@RequestBody Token token) {
        Tokens.clear(token.getToken());

        return ResponseEntity.status(HttpStatus.OK).build();
    }

}

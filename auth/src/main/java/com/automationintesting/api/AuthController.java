package com.automationintesting.api;

import com.automationintesting.model.Auth;
import com.automationintesting.model.Decision;
import com.automationintesting.model.Token;
import com.automationintesting.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<Token> createToken(@RequestBody Auth auth, HttpServletResponse response) throws SQLException {
        Decision decision = authService.queryCredentials(auth);

        if(decision.getStatus() == HttpStatus.OK){
            Cookie cookie = new Cookie("token", decision.getToken().getToken());
            cookie.setPath("/");

            response.addCookie(cookie);

            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @RequestMapping(value = "/validate", method = RequestMethod.POST)
    public ResponseEntity<Token> validateToken(@RequestBody Token token) throws SQLException {
        HttpStatus httpStatus = authService.verify(token);

        return ResponseEntity.status(httpStatus).build();
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity clearToken(@RequestBody Token token) throws SQLException {
        HttpStatus httpStatus = authService.deleteToken(token);

        return ResponseEntity.status(httpStatus).build();
    }

}

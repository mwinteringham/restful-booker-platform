package com.automationintesting.unit.service;

import com.automationintesting.db.AuthDB;
import com.automationintesting.model.Auth;
import com.automationintesting.model.Decision;
import com.automationintesting.model.Token;
import com.automationintesting.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    @Mock
    private AuthDB authDB;

    @Autowired
    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void initialiseMocks() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testValidateCredentials() throws SQLException {
        Auth auth = new Auth("admin","password");
        when(authDB.queryCredentials(auth)).thenReturn(true);
        when(authDB.insertToken(any())).thenReturn(true);

        Decision decision = authService.queryCredentials(auth);

        assertEquals(HttpStatus.OK, decision.getStatus());
        assertEquals(16, decision.getToken().getToken().length());
    }

    @Test
    public void testInvalidCredentials() throws SQLException {
        Auth auth = new Auth("admin","password");
        when(authDB.queryCredentials(auth)).thenReturn(false);

        Decision decision = authService.queryCredentials(auth);

        assertEquals(HttpStatus.FORBIDDEN, decision.getStatus());
    }

    @Test
    public void testErrorVerifyingCredentials() throws SQLException {
        Auth auth = new Auth("admin","password");
        when(authDB.queryCredentials(auth)).thenReturn(true);
        when(authDB.insertToken(any())).thenReturn(false);

        Decision decision = authService.queryCredentials(auth);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, decision.getStatus());
    }

    @Test
    public void testTokenPositiveVerification() throws SQLException {
        Token token = new Token("abc");
        when(authDB.queryToken(token)).thenReturn(new Token("abc"));

        HttpStatus tokenIsValid = authService.verify(token);

        assertEquals(HttpStatus.OK, tokenIsValid);
    }

    @Test
    public void testTokenNegativeVerification() throws SQLException {
        Token token = new Token("abc");
        when(authDB.queryToken(token)).thenReturn(null);

        HttpStatus tokenIsInvalid = authService.verify(token);

        assertEquals(HttpStatus.FORBIDDEN, tokenIsInvalid);
    }

    @Test
    public void testClearingToken() throws SQLException {
        Token token = new Token("efg");
        when(authDB.deleteToken(token)).thenReturn(true);

        HttpStatus tokenIsDeleted = authService.deleteToken(token);

        assertEquals(HttpStatus.OK, tokenIsDeleted);
    }

    @Test
    public void testUnableToClearToken() throws SQLException {
        Token token = new Token("efg");
        when(authDB.deleteToken(token)).thenReturn(false);

        HttpStatus tokenIsDeleted = authService.deleteToken(token);

        assertEquals(HttpStatus.NOT_FOUND, tokenIsDeleted);
    }

}

package com.automationintesting.unit.db;

import com.automationintesting.model.Auth;
import com.automationintesting.model.Token;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AuthDBTest extends BaseTest {

    @Test
    public void testStoreToken() throws SQLException, IOException {
        Token token = new Token("abc");

        Boolean tokenStored = authDB.insertToken(token);

        assertEquals(true, tokenStored);
    }

    @Test
    public void testQueryTokenExists() throws SQLException {
        Token token = new Token("abc");
        authDB.insertToken(token);

        Token retrievedToken = authDB.queryToken(token);

        assertEquals(token.getToken(), retrievedToken.getToken());
    }

    @Test
    public void testRemovingToken() throws SQLException {
        Token token = new Token("efg");
        authDB.insertToken(token);

        Boolean deleteSuccessful = authDB.deleteToken(token);

        assertEquals( true, deleteSuccessful);
    }

    @Test
    public void testQueryCredentials() throws SQLException {
        Auth auth = new Auth("admin", "password");

        Boolean credentialQuary = authDB.queryCredentials(auth);

        assertEquals( true, credentialQuary);
    }

    @Test
    public void testQueryMissingCredentials() throws SQLException {
        Auth auth = new Auth("password", "admin");

        Boolean credentialQuary = authDB.queryCredentials(auth);

        assertEquals( false, credentialQuary);
    }

}

package com.automationintesting.unit;

import com.automationintesting.app.Tokens;
import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class TokensTest {

    @Test
    public void testTokenPositiveVerification(){
        String token = Tokens.create();
        Boolean tokenIsValid = Tokens.verify(token);

        assertThat(tokenIsValid, is(true));
    }

    @Test
    public void testTokenNegativeVerification(){
        Boolean tokenIsNotValid = Tokens.verify("abc123");

        assertThat(tokenIsNotValid, is(false));
    }

    @Test
    public void testClearingTokens(){
        String token = Tokens.create();

        Tokens.clear(token);

        Boolean tokenIsNotValid = Tokens.verify(token);

        assertThat(tokenIsNotValid, is(false));
    }

}

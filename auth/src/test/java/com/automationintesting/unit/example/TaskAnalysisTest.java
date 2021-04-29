package com.automationintesting.unit.example;

import com.automationintesting.app.Tokens;
import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class TaskAnalysisTest {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void testTokenCreation(){
        // We assign a token that is generated via the Tokens class to a string
        String token = Tokens.create();

        // Since the token is randomly generated we cannot assert on the string
        // but we can assert on the String class by using hamcrest to assertThat
        // token is an instance of a String.class and is 16 characters long
        assertThat(token, is(instanceOf(String.class)));
        assertThat(token.length(), is(16));
    }

}

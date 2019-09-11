package com.automationintesting.unit;

import com.automationintesting.app.AuthApp;
import com.automationintesting.model.Decision;
import com.automationintesting.model.Token;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;

public class AuthAppTest {

    @Test
    public void positiveDecisionMadeTest(){
        AuthApp authApp = new AuthApp();

        Decision decision = authApp.decideOnTokenGeneration("admin", "password");

        assertThat(decision.getResult(), is(true));
        assertThat(decision.getToken(), instanceOf(Token.class));
    }

    @Test
    public void negativeDecisionMadeTest(){
        AuthApp authApp = new AuthApp();

        Decision decision = authApp.decideOnTokenGeneration("nimda", "password");

        assertThat(decision.getResult(), is(false));
        assertThat(decision.getToken(), is(nullValue()));
    }

}

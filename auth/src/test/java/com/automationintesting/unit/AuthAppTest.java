package com.automationintesting.unit;

import com.automationintesting.app.AuthApp;
import com.automationintesting.model.Decision;
import com.automationintesting.model.Token;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AuthAppTest {

    @Test
    public void positiveDecisionMadeTest(){
        AuthApp authApp = new AuthApp();

        Decision decision = authApp.decideOnTokenGeneration("admin", "password");

        assertEquals(decision.getResult(), true);
        assertEquals(decision.getToken().getClass(), Token.class);
    }

    @Test
    public void negativeDecisionMadeTest(){
        AuthApp authApp = new AuthApp();

        Decision decision = authApp.decideOnTokenGeneration("nimda", "password");

        assertEquals(decision.getResult(), false);
        assertEquals(decision.getToken(), null);
    }

}

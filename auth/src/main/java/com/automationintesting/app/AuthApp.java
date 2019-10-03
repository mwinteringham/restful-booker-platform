package com.automationintesting.app;

import com.automationintesting.model.Decision;

public class AuthApp {

    public Decision decideOnTokenGeneration(String username, String password) {
        if(username.equals("admin") && password.equals("password")){
            return new Decision(true, Tokens.create());
        } else {
            return new Decision(false);
        }
    }
}

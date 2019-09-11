package com.automationintesting.model;

public class Decision {

    private boolean result;

    private Token token;

    public Decision(boolean result) {
        this.result = result;
    }

    public Decision(boolean result, String tokenString) {
        this.result = result;
        this.token = new Token(tokenString);
    }

    public boolean getResult() {
        return result;
    }

    public Token getToken() {
        return token;
    }

    @Override
    public String toString() {
        return "Decision{" +
                "result=" + result +
                ", token=" + token +
                '}';
    }
}

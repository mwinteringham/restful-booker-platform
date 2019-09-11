package com.automationintesting.app;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Tokens {

    private static List<String> tokens = new ArrayList<>();

    public static String create(){
        String token = new RandomString(16, ThreadLocalRandom.current()).nextString();
        tokens.add(token);

        return token;
    }

    public static Boolean verify(String token) {
        return tokens.contains(token);
    }

    public static void clear(String token) {
        tokens.removeIf(a -> a.equals(token));
    }
}

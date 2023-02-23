package com.automationintesting;

import com.automationintesting.service.ProxyService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProxyServiceTest {

    ProxyService proxyService = new ProxyService();

    @Test
    public void reportPortIsReturned(){
        int port = proxyService.derivePortNumber("/report/");
        assertEquals(3005, port);
    }

    @Test
    public void mixedPathReturnsCorrectPath(){
        int port = proxyService.derivePortNumber("/report/room");
        assertEquals(3005, port);
    }

    @Test
    public void roomPortIsReturned(){
        int port = proxyService.derivePortNumber("/room/");
        assertEquals(3001, port);
    }

    @Test
    public void assetsPortIsReturn(){
        int port = proxyService.derivePortNumber("/");
        assertEquals(3003, port);
    }

    @Test
    public void assetsPortIsReturnedForStaticAssests(){
        int port = proxyService.derivePortNumber("/js/main.js");
        assertEquals(3003, port);
    }
}

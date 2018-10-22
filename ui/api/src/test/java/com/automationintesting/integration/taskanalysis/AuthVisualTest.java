package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import org.junit.Test;

public class AuthVisualTest extends TestSetup {

    @Test
    public void loginVisualTest(){
        eyes.open(driver, "RBP","Login Visual Test", new RectangleSize(1400, 700));

        driver.navigate().to("http://localhost:3003/");

        eyes.checkWindow("Login state");
    }

}

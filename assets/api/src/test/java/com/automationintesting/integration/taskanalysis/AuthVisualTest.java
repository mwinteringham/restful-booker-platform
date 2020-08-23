package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.RectangleSize;
import org.junit.Test;

// This test class extends the class TestSetup meaning we can inherit
// the Before and After hooks to setup Selenium and Applitools
public class AuthVisualTest extends TestSetup {

    // We add the @Test annotation so that when JUnit runs it knows which
    // methods to run as tests
    @Test
    // We give the check a clear name to ensure that it is descriptive in
    // what it is checking
    public void loginVisualTest(){
        // First, we start Applitools by calling the open method and giving it the Selenium WebDriver object
        // to interact with and then details about the check and finally a fixed browser size that Applitools will
        // resize the browser to.
        eyes.open(driver, "RBP","Login Visual Test", new RectangleSize(1400, 700));

        // Next we use Selenium to navigate to our page under test
        driver.navigate().to("http://127.0.0.1:8080/#/admin");

        // Finally we trigger the Applitools check by calling 'checkWindow' that will take a screenshot of the browser
        // and upload it to Applitools cloud to compare it against a previously stored image to compare the differences
        eyes.checkWindow("Login state");
    }

}

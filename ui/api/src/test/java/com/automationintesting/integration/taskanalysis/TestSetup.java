package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.selenium.Eyes;
import com.automationintesting.UiApplication;
import com.automationintesting.integration.taskanalysis.driverfactory.DriverFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = UiApplication.class)
public class TestSetup {

    protected WebDriver driver;
    protected Eyes eyes;

    // We add the @Before annotation so that when JUnit runs it knows to run this method before
    // the tests are started. This is known as a hook.
    @Before
    public void setUpDriver(){
        // In the before hook we need to configure both Selenium WebDriver to create an
        // instance of a browser to run our check in
        driver = new DriverFactory().create();

        // And an instances of Applitools 'Eyes' that will run the visual check.
        eyes = new Eyes();

        // For Appplitools to work, it requires an account that can be registered on their website.
        // The account will come with an API key that you can assign to the environmental variable
        // APPLITOOLS_API_KEY to use in your checks.
        eyes.setApiKey(System.getenv("APPLITOOLS_API_KEY"));
    }

    // We add the @After annotation so that when JUnit runs it knows to run this method after
    // the tests are started. This is known as a hook.
    @After
    public void teardownDriver(){
        // Once the check is complete we need to close the Applitools and WebDriver instances so that
        // we can rebuild new ones for the next check
        eyes.close();

        driver.quit();

        eyes.abortIfNotClosed();
    }

}

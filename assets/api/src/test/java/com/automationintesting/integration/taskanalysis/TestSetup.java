package com.automationintesting.integration.taskanalysis;

import com.applitools.eyes.selenium.Eyes;
import com.automationintesting.UiApplication;
import com.automationintesting.integration.taskanalysis.driverfactory.DriverFactory;
import com.xebialabs.restito.server.StubServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

// We need to start the app up to test it. So we use the SpringRunner class and SpringBootTest to configure
// and run the app.
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = UiApplication.class)
public class TestSetup {

    // Our test rely on multiples services so we want to mock each of the
    // services the UI uses
    StubServer brandingApi, authApi, roomApi;

    // We require instances of WebDriver and AppliTools eyes that will be
    // inherited by the classes that use this setup class
    protected WebDriver driver;
    protected Eyes eyes;

    // We add the @Before annotation so that when JUnit runs it knows to run this method before
    // the tests are started. This is known as a hook.
    @BeforeEach
    public void setUpDriver(){
        // In the before hook we need to configure both Selenium WebDriver to create an
        // instance of a browser to run our check in
        driver = new DriverFactory().create();

        // And an instances of Applitools 'Eyes' that will run the visual check.
        eyes = new Eyes();

        // For Appplitools to work, it requires an account that can be registered on their website.
        // The account will come with an API key that you can assign to the environmental variable
        // APPLITOOLS_API_KEY to use in your checks.
        //eyes.setApiKey("");
        eyes.setApiKey(System.getenv("APPLITOOLS_API_KEY"));
        eyes.setForceFullPageScreenshot(true);

        // With the browser setup, we begin to configure our mocked services
        brandingApi = new StubServer(3002).run();
        authApi = new StubServer(3004).run();
        roomApi = new StubServer(3001).run();
    }

    // We add the @After annotation so that when JUnit runs it knows to run this method after
    // the tests are started. This is known as a hook.
    @AfterEach
    public void teardownDriver() throws InterruptedException {
        // Once the check is complete we need to close the Applitools and WebDriver instances so that
        // we can rebuild new ones for the next check
        eyes.close();

        driver.quit();

        // We also need to close our mocks down to get them ready for the next check
        brandingApi.stop();
        authApi.stop();
        roomApi.stop();

        // Sadly we have to wait a second to allow the mocks to properly turn off
        Thread.sleep(1000);
    }

}

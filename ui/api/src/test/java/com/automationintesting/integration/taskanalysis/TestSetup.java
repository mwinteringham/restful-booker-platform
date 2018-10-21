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

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, classes = UiApplication.class)
public class TestSetup {

    protected WebDriver driver;
    protected Eyes eyes;

    @Before
    public void setUpDriver(){
        driver = new DriverFactory().create();
        eyes = new Eyes();

        eyes.setApiKey(System.getenv("APPLITOOLS_API_KEY"));
    }

    @After
    public void teardownDriver(){
        eyes.close();

        driver.quit();

        eyes.abortIfNotClosed();
    }

}

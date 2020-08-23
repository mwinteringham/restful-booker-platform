package com.automationintesting.integration.taskanalysis.driverfactory;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;

public class DriverFactory {

    private static String OS = System.getProperty("os.name").toLowerCase();

    public WebDriver create() {
        if(System.getenv("BROWSER") != null){
            switch (System.getenv("BROWSER")) {
                case "chrome":
                    return prepareChromeDriver();
                case "remote":
                    return prepareRemoteDriver();
                default:
                    System.out.println("WARN: Browser option '" + System.getenv("BROWSER") + "' not recognised. Falling back to ChromeDriver");
                    return prepareChromeDriver();
            }
        }

        System.out.println("WARN: No browser option detected. Defaulting to ChromeDriver but if you want to use a different browser please assign a browser to the env var 'BROWSER'.");
        return prepareChromeDriver();
    }

    private WebDriver prepareChromeDriver(){
        WebDriverManager.chromedriver().setup();

        return new ChromeDriver();
    }

    private WebDriver prepareRemoteDriver(){
        if(System.getenv("SAUCE_USERNAME") == null){
            throw new RuntimeException("To use remote driver a Sauce lab account is required. Please assign your Sauce labs account name to the environmental variable 'sauce_username'");
        }

        if(System.getenv("SAUCE_ACCESS_KEY") == null){
            throw new RuntimeException("To use remote driver a Sauce lab account is required. Please assign your Sauce labs access key to the environmental variable 'sauce_access_key'");
        }

        String URL = "https://" + System.getenv("SAUCE_USERNAME") + ":" + System.getenv("SAUCE_ACCESS_KEY") + "@ondemand.eu-central-1.saucelabs.com:443/wd/hub";

        FirefoxOptions firefoxOptions = new FirefoxOptions();
        firefoxOptions.setCapability("screenResolution", "1440x900");
        firefoxOptions.setCapability("extendedDebugging", "true");

        try {
            return new RemoteWebDriver(new URL(URL), firefoxOptions);
        } catch (MalformedURLException e) {
            throw new RuntimeException("WARN: An error occurred attempting to create a remote driver connection. See the following error: " + e);
        }
    }
}

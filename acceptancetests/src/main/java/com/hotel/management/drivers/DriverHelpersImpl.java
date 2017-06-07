package com.hotel.management.drivers;

import io.github.bonigarcia.wdm.ChromeDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.support.PageFactory;

import java.util.concurrent.TimeUnit;

public class DriverHelpersImpl  {

    public static WebDriver driver;
    private String browser = "chrome";

    public DriverHelpersImpl(){
        PageFactory.initElements(driver,this);
    }

    public void openBrowser() {
        switch (browser) {
            case "chrome":
                ChromeDriverManager.getInstance().setup();
                driver = new ChromeDriver();
                break;
            case "ie":
                driver = new InternetExplorerDriver();
                break;
            default:
                driver = new FirefoxDriver();
                break;
        }
    }

    public void closeBrowser() {
        driver.quit();
    }

    public void maximiseWindow() {
        driver.manage().window().maximize();
    }

    public void waits() {
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
    }

    public void navigateTo(String url) {
        driver.get(url);
    }

    public WebDriver getDriver(){
        return driver;
    }
}

package driverfactory;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class DriverFactory
{
    private static String OS = System.getProperty("os.name").toLowerCase();

    public WebDriver create()
    {
        return generateDriver();
    }

    private WebDriver generateDriver(){
        String classLocation = DriverFactory.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        String pathToChromeDriver = "";

        if(OS.contains("win")) {
//            pathToChromeDriver = System.getProperty("user.dir") + "/end-to-end-tests/chromedrivers/windows/chromedriver.exe";
            pathToChromeDriver = classLocation + "../..//chromedrivers/windows/chromedriver.exe";
        }
        else if (OS.contains("mac")) {
//            pathToChromeDriver = System.getProperty("user.dir") + "/end-to-end-tests/chromedrivers/mac/chromedriver";
            pathToChromeDriver = classLocation + "../..//chromedrivers/mac/chromedriver";
        }

        System.setProperty("webdriver.chrome.driver", pathToChromeDriver);
        return new ChromeDriver();
    }
}

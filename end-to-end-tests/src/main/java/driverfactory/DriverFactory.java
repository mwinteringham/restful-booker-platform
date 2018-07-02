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

        if(OS.contains("win"))
        {
            String pathToChromeDriver = System.getProperty("user.dir") + "/end-to-end-tests/chromedrivers/windows/chromedriver.exe";
            System.setProperty("webdriver.chrome.driver", pathToChromeDriver);
        }
        else if (OS.contains("mac"))
        {
            String pathToChromeDriver = System.getProperty("user.dir") + "/end-to-end-tests/chromedrivers/mac/chromedriver";
            System.setProperty("webdriver.chrome.driver", pathToChromeDriver);
        }

        return new ChromeDriver();
    }
}

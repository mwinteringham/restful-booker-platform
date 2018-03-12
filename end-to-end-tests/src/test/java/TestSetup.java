import driverfactory.DriverFactory;
import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.WebDriver;

import java.util.concurrent.TimeUnit;

public class TestSetup
{
    protected WebDriver driver;
    protected String baseUrl;

    @Before
    public void SetUp()
    {
        driver = new DriverFactory().create();
        driver.manage().timeouts().implicitlyWait(2, TimeUnit.SECONDS);
        baseUrl = "http://localhost:3003/";
    }

    @After
    public void TearDown()
    {
        driver.quit();
    }

}

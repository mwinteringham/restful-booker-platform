package pageobjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import pageobjects.BasePage;

import java.util.List;

public class MessagePage extends BasePage {

    @FindBy(how = How.CSS, using = ".roomDelete")
    List<WebElement> aRoomDelete;

    public MessagePage(WebDriver driver) {
        super(driver);
    }

    public List<WebElement> getMessages() {
        return aRoomDelete;
    }
}

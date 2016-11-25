package com.hotel.management.pages;


import com.hotel.management.drivers.DriverHelpersImpl;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;

import java.util.ArrayList;
import java.util.List;

public class EntryPage extends DriverHelpersImpl {

    public EntryPage provideLoginDetails(String user, String password) {
        _login.click();
        _userName.sendKeys(user);
        _password.sendKeys(password);
        return this;
    }

    public void clickSubmit() {
        _submit.click();
    }

    public EntryPage provideHotelDetails(String name, String address, String owner, String number, String email) {
        _hotel.sendKeys(name);
        _address.sendKeys(address);
        _owner.sendKeys(owner);
        _phone.sendKeys(number);
        _email.sendKeys(email);
        return this;
    }

    public void clickCreateBTN() {
        _createBtn.click();
    }

    public void deleteHotel() {
        driver.navigate().refresh();
        driver.findElement(By.id(""+Integer.parseInt(delete.getAttribute("id")) )).click();
    }

    public List<String> listOfHotelsNames() {
        List<String> hotels = new ArrayList<String>();
        sleep(3000);
        for (WebElement list : hotelList) {
            hotels.add(list.getText());
        }
        return hotels;
    }

    public void sleep(int time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @FindBy(linkText = "Login")
    private WebElement _login;

    @FindBy(id = "username")
    private WebElement _userName;

    @FindBy(id = "password")
    private WebElement _password;

    @FindBy(id = "doLogin")
    private WebElement _submit;

    @FindBy(id = "hotelName")
    private WebElement _hotel;

    @FindBy(id = "address")
    private WebElement _address;

    @FindBy(id = "owner")
    private WebElement _owner;

    @FindBy(id = "phone")
    private WebElement _phone;

    @FindBy(id = "email")
    private WebElement _email;

    @FindBy(id = "createHotel")
    private WebElement _createBtn;

    @FindAll(@FindBy(xpath = "html/body/div[1]/div/div[1]/div[1]/p"))
    private List<WebElement> hotelList;

    @FindBy(css = ".col-sm-1>span")
    private WebElement delete;
}

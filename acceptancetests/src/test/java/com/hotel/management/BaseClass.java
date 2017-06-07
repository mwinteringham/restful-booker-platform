package com.hotel.management;


import com.hotel.management.drivers.DriverHelpers;
import com.hotel.management.drivers.DriverHelpersImpl;
import cucumber.api.java.After;
import cucumber.api.java.Before;

public class BaseClass {
    DriverHelpersImpl driverHelpers;

    @Before
    public void browserSetUp(){
        driverHelpers=new DriverHelpersImpl();
        driverHelpers.openBrowser();
        driverHelpers.navigateTo("http://localhost:3003");
        driverHelpers.maximiseWindow();
        driverHelpers.waits();
    }

    @After
    public void browserTearDown(){
        driverHelpers.closeBrowser();
    }
}

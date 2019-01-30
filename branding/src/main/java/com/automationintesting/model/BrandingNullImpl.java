package com.automationintesting.model;

public class BrandingNullImpl implements Branding {

    @Override
    public Map getMap() {
        return new MapNullImpl();
    }

    @Override
    public Logo getLogo() {
        return new LogoNullImpl();
    }

    @Override
    public String getDescription() {
        return "";
    }

    @Override
    public Contact getContact() {
        return new ContactNullImpl();
    }

}

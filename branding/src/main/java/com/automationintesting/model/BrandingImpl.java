package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BrandingImpl implements Branding {

    @JsonProperty
    private Map map;
    @JsonProperty
    private Logo logo;
    @JsonProperty
    private String description;
    @JsonProperty
    private Contact contact;

    public BrandingImpl(Map map, Logo logo, String description, Contact contact) {
        this.map = map;
        this.logo = logo;
        this.description = description;
        this.contact = contact;
    }

    public BrandingImpl(ResultSet result) throws SQLException {
        this.map = new MapImpl();
        this.logo = new LogoImpl();
        this.description = result.getString("description");
        this.contact = new ContactImpl();
    }

    @Override
    public Map getMap() {
        return map;
    }

    @Override
    public Logo getLogo() {
        return logo;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public Contact getContact() {
        return contact;
    }

}

package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Branding {

    @JsonProperty
    private String name;
    @JsonProperty
    private Map map;
    @JsonProperty
    private String logoUrl;
    @JsonProperty
    private String description;
    @JsonProperty
    private Contact contact;

    public Branding() {}

    public Branding(String name, Map map, String logoUrl, String description, Contact contact) {
        this.name = name;
        this.map = map;
        this.logoUrl = logoUrl;
        this.description = description;
        this.contact = contact;
    }

    public Branding(ResultSet result) throws SQLException {
        this.name = result.getString("name");
        this.map = new Map(result);
        this.logoUrl = result.getString("logo_url");
        this.description = result.getString("description");
        this.contact = new Contact(result);
    }

    public String getName() {
        return name;
    }

    public Map getMap() {
        return map;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getDescription() {
        return description;
    }

    public Contact getContact() {
        return contact;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMap(Map map) {
        this.map = map;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    @Override
    public String toString() {
        return "Branding{" +
                "name='" + name + '\'' +
                ", map=" + map +
                ", logoUrl='" + logoUrl + '\'' +
                ", description='" + description + '\'' +
                ", contact=" + contact +
                '}';
    }
}

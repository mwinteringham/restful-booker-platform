package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.URL;

import javax.persistence.Entity;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.sql.ResultSet;
import java.sql.SQLException;

@Entity
public class Branding {

    @JsonProperty
    @NotNull(message = "Name should not be null")
    @NotBlank(message = "Name should not be blank")
    @Size(min = 3, max = 100)
    @Pattern(regexp = "[A-Za-z& ]*", message = "Name can only contain alpha characters and the & sign")
    private String name;

    @JsonProperty
    @Valid
    private Map map;

    @JsonProperty
    @NotNull(message = "Url should not be null")
    @NotBlank(message = "Url should not be blank")
    @URL(message = "Url should be a correct url format")
    private String logoUrl;

    @JsonProperty
    @NotNull(message = "Description should not be null")
    @NotBlank(message = "Description should not be blank")
    @Pattern(regexp = "[a-zA-Z,&. ]*", message = "Description can only contain alpha characters and basic grammar")
    @Size(min = 3, max = 500)
    private String description;

    @JsonProperty
    @Valid
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
                ", map=" + map.toString() +
                ", logoUrl='" + logoUrl + '\'' +
                ", description='" + description + '\'' +
                ", contact=" + contact.toString() +
                '}';
    }

    public static class BrandingBuilder{

        private String name;
        private Map map;
        private String logoUrl;
        private String description;
        private Contact contact;

        public BrandingBuilder setName(String name) {
            this.name = name;

            return this;
        }

        public BrandingBuilder setMap(Map map) {
            this.map = map;

            return this;
        }

        public BrandingBuilder setLogoUrl(String logoUrl) {
            this.logoUrl = logoUrl;

            return this;
        }

        public BrandingBuilder setDescription(String description) {
            this.description = description;

            return this;
        }

        public BrandingBuilder setContact(Contact contact) {
            this.contact = contact;

            return this;
        }

        public Branding build(){
            return new Branding(name, map, logoUrl, description, contact);
        }
    }
}

package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.*;
import java.sql.ResultSet;
import java.sql.SQLException;

@Entity
public class Contact {

    @JsonProperty
    @NotNull(message = "Contact name should not be null")
    @NotBlank(message = "Contact Name should not be blank")
    @Size(min = 3, max = 40)
    @Pattern(regexp = "[A-Za-z& ]*", message = "Contact name can only contain alpha characters and the & sign")
    private String name;

    @JsonProperty
    @NotNull(message = "Address should not be null")
    @NotBlank(message = "Address should not be blank")
    @Size(min = 10, max = 200)
    private String address;

    @JsonProperty
    @NotNull(message = "Phone should not be null")
    @NotBlank(message = "Phone should not be blank")
    @Min(11)
    private String phone;

    @JsonProperty
    @NotNull(message = "Email should not be null")
    @NotBlank(message = "Email should not be blank")
    @Email(message = "Email should be a valid email format")
    private String email;

    public Contact(String name, String address, String phone, String email) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

    public Contact(ResultSet result) throws SQLException {
        this.name = result.getString("contact_name");
        this.address = result.getString("address");
        this.phone = result.getString("phone");
        this.email = result.getString("email");
    }

    public Contact() {}

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}

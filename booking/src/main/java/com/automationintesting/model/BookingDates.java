package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
public class BookingDates {

    @JsonProperty
    @NotBlank(message = "Checkin should not be blank")
    @NotNull(message = "Checkin should not be null")
    private Date checkin;

    @JsonProperty
    @NotBlank(message = "Checkout should not be blank")
    @NotNull(message = "Checkout should not be null")
    private Date checkout;

    public BookingDates() {
    }

    public BookingDates(Date checkin, Date checkout) {
        this.checkin = checkin;
        this.checkout = checkout;
    }

    public Date getCheckin() {
        return checkin;
    }

    public void setCheckin(Date checkin) {
        this.checkin = checkin;
    }

    public Date getCheckout() {
        return checkout;
    }

    public void setCheckout(Date checkout) {
        this.checkout = checkout;
    }

    @Override
    public String toString() {
        return "BookingDates{" +
                "checkin=" + checkin +
                ", checkout=" + checkout +
                '}';
    }
}

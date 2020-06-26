package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class BookingDates {

    @JsonProperty
    @NotNull
    private LocalDate checkin;

    @JsonProperty
    @NotNull
    private LocalDate checkout;

    public BookingDates() {
    }

    public BookingDates(LocalDate checkin, LocalDate checkout) {
        this.checkin = checkin;
        this.checkout = checkout;
    }

    public LocalDate getCheckin() {
        return checkin;
    }

    public void setCheckin(LocalDate checkin) {
        this.checkin = checkin;
    }

    public LocalDate getCheckout() {
        return checkout;
    }

    public void setCheckout(LocalDate checkout) {
        this.checkout = checkout;
    }

    @Override
    public String toString() {
        return "BookingDates{" +
                "checkin=" + checkin.toString() +
                ", checkout=" + checkout.toString() +
                '}';
    }
}

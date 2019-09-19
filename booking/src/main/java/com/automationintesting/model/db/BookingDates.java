package com.automationintesting.model.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class BookingDates {

    @JsonProperty
    @NotNull
    private Date checkin;

    @JsonProperty
    @NotNull
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
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        return "BookingDates{" +
                "checkin=" + sdf.format(checkin) +
                ", checkout=" + sdf.format(checkout) +
                '}';
    }
}

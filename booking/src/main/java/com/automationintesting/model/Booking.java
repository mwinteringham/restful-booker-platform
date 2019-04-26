package com.automationintesting.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Entity;
import javax.validation.Valid;
import javax.validation.constraints.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

@Entity
public class Booking {

    @JsonProperty
    private int bookingid;

    @JsonProperty
    private int roomid;

    @JsonProperty
    @NotBlank(message = "Firstname should not be blank")
    @NotNull(message = "Firstname should not be null")
    @Size(min = 3, max = 18)
    private String firstname;

    @JsonProperty
    @NotBlank(message = "Lastname should not be blank")
    @NotNull(message = "Lastname should not be null")
    @Size(min = 3, max = 30)
    private String lastname;

    @JsonProperty
    @NotNull(message = "Total price should not be null")
    @Min(10)
    @Max(999)
    private int totalprice;

    @JsonProperty
    @NotNull(message = "Deposit paid should not be null")
    private boolean depositpaid;

    @JsonProperty(value = "bookingdates")
    @Valid
    private BookingDates bookingDates;

    public Booking(int bookingid, int roomid, String firstname, String lastname, int totalprice, boolean depositpaid, BookingDates bookingDates) {
        this.bookingid = bookingid;
        this.roomid = roomid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.totalprice = totalprice;
        this.depositpaid = depositpaid;
        this.bookingDates = bookingDates;
    }

    public Booking(ResultSet result) throws SQLException {
        this.bookingid = result.getInt("bookingid");
        this.roomid = result.getInt("roomid");
        this.firstname = result.getString("firstname");
        this.lastname = result.getString("lastname");
        this.totalprice = result.getInt("totalprice");
        this.depositpaid = result.getBoolean("depositpaid");
        this.bookingDates = new BookingDates(result.getDate("checkin"), result.getDate("checkout"));
    }

    public Booking() {
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public int getTotalprice() {
        return totalprice;
    }

    public boolean isDepositpaid() {
        return depositpaid;
    }

    public BookingDates getBookingDates() {
        return bookingDates;
    }

    public int getRoomid() {
        return roomid;
    }

    public int getBookingid() {
        return bookingid;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public void setTotalprice(int totalprice) {
        this.totalprice = totalprice;
    }

    public void setDepositpaid(boolean depositpaid) {
        this.depositpaid = depositpaid;
    }

    public void setBookingDates(BookingDates bookingDates) {
        this.bookingDates = bookingDates;
    }

    public void setRoomid(int roomid) {
        this.roomid = roomid;
    }

    public void setBookingid(int bookingid) {
        this.bookingid = bookingid;
    }

    @Override
    public String toString() {
        return "Booking{" +
                "roomid=" + roomid +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", totalprice=" + totalprice +
                ", depositpaid=" + depositpaid +
                ", bookingDates=" + bookingDates +
                '}';
    }

    public static class BookingBuilder {

        private int roomid;
        private String firstname;
        private String lastname;
        private int totalprice;
        private boolean depositpaid;
        private Date checkin;
        private Date checkout;

        public BookingBuilder setRoomid(int roomid){
            this.roomid = roomid;

            return this;
        }

        public BookingBuilder setFirstname(String firstname) {
            this.firstname = firstname;

            return this;
        }

        public BookingBuilder setLastname(String lastname) {
            this.lastname = lastname;

            return this;
        }

        public BookingBuilder setTotalprice(int totalprice) {
            this.totalprice = totalprice;

            return this;
        }

        public BookingBuilder setDepositpaid(boolean depositpaid) {
            this.depositpaid = depositpaid;

            return this;
        }

        public BookingBuilder setCheckin(Date checkin) {
            this.checkin = checkin;

            return this;
        }

        public BookingBuilder setCheckout(Date checkout) {
            this.checkout = checkout;

            return this;
        }

        public Booking build(){
            BookingDates bookingDates = new BookingDates(checkin, checkout);

            return new Booking(0, roomid, firstname, lastname, totalprice, depositpaid, bookingDates);
        }
    }
}

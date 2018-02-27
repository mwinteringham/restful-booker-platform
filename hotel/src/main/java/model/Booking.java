package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Booking {

    @JsonProperty
    private int bookingid;
    @JsonProperty
    private int hotelid;
    @JsonProperty
    private String firstname;
    @JsonProperty
    private String lastname;
    @JsonProperty
    private int totalprice;
    @JsonProperty
    private boolean depositpaid;
    @JsonProperty(value = "bookingdates")
    private BookingDates bookingDates;

    public Booking(ResultSet result) throws SQLException {
        this.bookingid = result.getInt("bookingid");
        this.hotelid = result.getInt("hotelid");
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

    public int getHotelid() {
        return hotelid;
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

    public void setHotelid(int hotelId) {
        this.hotelid = hotelId;
    }

}

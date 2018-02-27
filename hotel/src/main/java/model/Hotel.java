package model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

public class Hotel {

    @JsonProperty
    private int hotelid;

    @JsonProperty
    private String name;

    @JsonProperty
    private String address;

    @JsonProperty
    private Date regdate;

    @JsonProperty
    private Contact contact;

    @JsonProperty
    private List<Booking> bookings;

    public Hotel() {
    }

    public Hotel(String name, String address, Date regdate, Contact contact) {
        this.name = name;
        this.address = address;
        this.regdate = regdate;
        this.contact = contact;
    }

    public Hotel(ResultSet result) throws SQLException {
        this.hotelid = result.getInt("hotelid");
        this.name = result.getString("name");
        this.address = result.getString("address");
        this.regdate = result.getDate("regdate");
        this.contact = new Contact(result.getString("contactName"), result.getString("contactPhone"), result.getString("contactEmail"));
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getRegdate() {
        return regdate;
    }

    public void setRegdate(Date regdate) {
        this.regdate = regdate;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public int getHotelid() {
        return hotelid;
    }

    public void setHotelid(int hotelid) {
        this.hotelid = hotelid;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}

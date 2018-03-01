package payload;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

public class Booking {

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

    public Booking(int hotelid, String firstname, String lastname, int totalprice, boolean depositpaid, BookingDates bookingDates) {
        this.hotelid = hotelid;
        this.firstname = firstname;
        this.lastname = lastname;
        this.totalprice = totalprice;
        this.depositpaid = depositpaid;
        this.bookingDates = bookingDates;
    }

    public Booking(ResultSet result) throws SQLException {
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

    @Override
    public String toString() {
        return "Booking{" +
                "hotelid=" + hotelid +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", totalprice=" + totalprice +
                ", depositpaid=" + depositpaid +
                ", bookingDates=" + bookingDates +
                '}';
    }

    public static class BookingBuilder {

        private int hotelid;
        private String firstname;
        private String lastname;
        private int totalprice;
        private boolean depositpaid;
        private Date checkin;
        private Date checkout;

        public BookingBuilder setHotelid(int hotelid){
            this.hotelid = hotelid;

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

            return new Booking(hotelid, firstname, lastname, totalprice, depositpaid, bookingDates);
        }
    }
}

package db;

import model.Booking;

import java.text.SimpleDateFormat;
import java.util.Date;

public class InsertSql {

    private int hotelid;
    private String firstname;
    private String lastname;
    private int totalprice;
    private boolean depositpaid;
    private Date checkin;
    private Date checkout;
    private SimpleDateFormat dateFormat;

    public InsertSql(Booking booking) {
        this.hotelid = booking.getHotelid();
        this.firstname = booking.getFirstname();
        this.lastname = booking.getLastname();
        this.totalprice = booking.getTotalprice();
        this.depositpaid = booking.isDepositpaid();
        this.checkin = booking.getBookingDates().getCheckin();
        this.checkout = booking.getBookingDates().getCheckout();

        dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }

    public String buildSql(){
        return "INSERT INTO BOOKINGS(hotelid, firstname, lastname, totalprice, depositpaid, checkin, checkout) VALUES(" +
                hotelid + "," +
                "'" + firstname + "'," +
                "'" + lastname + "'," +
                totalprice + "," +
                depositpaid + "," +
                "'" + dateFormat.format(checkin) + "'," +
                "'" + dateFormat.format(checkout) + "');";
    }

}

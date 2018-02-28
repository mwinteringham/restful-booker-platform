package db;

import model.Booking;

import java.text.SimpleDateFormat;
import java.util.Date;

public class UpdateSql {

    private int id;
    private String firstname;
    private String lastname;
    private int totalprice;
    private boolean depositpaid;
    private Date checkin;
    private Date checkout;
    private SimpleDateFormat dateFormat;

    UpdateSql(int id, Booking booking) {
        this.id = id;
        this.firstname = booking.getFirstname();
        this.lastname = booking.getLastname();
        this.totalprice = booking.getTotalprice();
        this.depositpaid = booking.isDepositpaid();
        this.checkin = booking.getBookingDates().getCheckin();
        this.checkout = booking.getBookingDates().getCheckout();

        dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }

    public String buildSql(){
        return "UPDATE BOOKINGS SET "
                + "firstname='" + firstname + "',"
                + "lastname='" + lastname + "',"
                + "totalprice=" + totalprice + ","
                + "depositpaid=" + depositpaid + ","
                + "checkin='" + dateFormat.format(checkin) + "',"
                + "checkout='" + dateFormat.format(checkout) + "' WHERE bookingid=" + id;
    }
}

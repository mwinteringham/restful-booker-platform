package db;

import model.Hotel;

import java.text.SimpleDateFormat;
import java.util.Date;

public class UpdateSql {

    private int id;
    private String name;
    private String address;
    private Date regdate;
    private String contactName;
    private String contactPhone;
    private String contactEmail;

    private SimpleDateFormat dateFormat;

    public UpdateSql(int id, Hotel hotel) {
        this.id = id;
        this.name = hotel.getName();
        this.address = hotel.getAddress();
        this.regdate = hotel.getRegdate();
        this.contactName = hotel.getContact().getName();
        this.contactPhone = hotel.getContact().getPhone();
        this.contactEmail = hotel.getContact().getEmail();

        dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }

    public String buildSql(){
        return "UPDATE HOTELS SET "
                + "name='" + name + "',"
                + "address='" + address + "',"
                + "regdate='" + dateFormat.format(regdate) + "',"
                + "contactName='" + contactName + "',"
                + "contactPhone='" + contactPhone + "',"
                + "contactEmail='" + contactEmail + "' WHERE hotelid=" + id;
    }

}

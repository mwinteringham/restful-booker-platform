package db;

import model.Hotel;

import java.text.SimpleDateFormat;
import java.util.Date;

public class InsertSql {

    private String name;
    private String address;
    private Date regdate;
    private String contactName;
    private String contactPhone;
    private String contactEmail;

    private SimpleDateFormat dateFormat;

    public InsertSql(Hotel hotel) {
        this.name = hotel.getName();
        this.address = hotel.getAddress();
        this.regdate = hotel.getRegdate();
        this.contactName = hotel.getContact().getName();
        this.contactPhone = hotel.getContact().getPhone();
        this.contactEmail = hotel.getContact().getEmail();

        dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    }

    public String buildSql(){
        return "INSERT INTO HOTELS(name, address, regdate, contactName, contactPhone, contactEmail) VALUES(" +
                "'" + name + "'," +
                "'" + address + "'," +
                "'" + dateFormat.format(regdate) + "'," +
                "'" + contactName + "'," +
                "'" + contactPhone + "'," +
                "'" + contactEmail + "');";
    }

}

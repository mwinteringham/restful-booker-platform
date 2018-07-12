package db;

import model.Room;

import java.text.SimpleDateFormat;
import java.util.Date;

public class InsertSql {

    private int roomNumber;
    private String type;
    private int beds;
    private boolean accessible;
    private String details;

    public InsertSql(Room room) {
        this.roomNumber = room.getRoomNumber();
        this.type = room.getType();
        this.beds = room.getBeds();
        this.accessible = room.isAccessible();
        this.details = room.getDetails();
    }

    public String buildSql(){
        return "INSERT INTO ROOMS (room_number, type, beds, accessible, details) " +
                "VALUES(" + roomNumber + ", '" + type + "', " + beds + ", " + accessible + ", '" + details + "');";
    }

}

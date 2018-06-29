package db;

import model.Room;

import java.text.SimpleDateFormat;
import java.util.Date;

public class UpdateSql {

    private int id;
    private int roomNumber;
    private String type;
    private int beds;
    private boolean accessible;
    private String details;


    public UpdateSql(int id, Room room) {
        this.id = id;
        this.roomNumber = room.getRoomNumber();
        this.type = room.getType();
        this.beds = room.getBeds();
        this.accessible = room.isAccessible();
        this.details = room.getDetails();
    }

    public String buildSql(){
        return "UPDATE ROOMS SET "
                + "room_number='" + roomNumber + "',"
                + "type='" + type + "',"
                + "beds='" + beds + "',"
                + "accessible='" + accessible + "',"
                + "details='" + details + "' WHERE roomid=" + id;
    }

}

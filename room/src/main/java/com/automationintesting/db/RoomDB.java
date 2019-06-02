package com.automationintesting.db;

import com.automationintesting.model.Room;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RoomDB {

    private Connection connection;
    private final String SELECT_ROOMS = "SELECT * FROM ROOMS";
    private final String SELECT_BY_ROOMID = "SELECT * FROM ROOMS WHERE roomid = ?";
    private final String DELETE_BY_ROOMID = "DELETE FROM ROOMS WHERE roomid = ?";
    private final String DELETE_ALL_ROOMS = "DELETE FROM ROOMS";
    private final String CREATE_DB = "CREATE table ROOMS ( roomid int NOT NULL AUTO_INCREMENT, room_number int, type varchar(255), beds int, accessible boolean, image varchar(2000), description varchar(2000), features ARRAY, roomPrice int, primary key (roomid))";

    public RoomDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        Server server = Server.createTcpServer("-tcpPort", "9091", "-tcpAllowOthers").start();

        connection.prepareStatement(CREATE_DB).executeUpdate();

        Room room = new Room(101,
                "Twin",
                false,
                "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
                "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante.",
                new String[]{"Wifi", "TV", "Safe"},
                100);

        InsertSql insertSql = new InsertSql(connection, room);
        PreparedStatement createBooking = insertSql.getPreparedStatement();

        createBooking.executeUpdate();
    }

    public Room create(Room room) throws SQLException {
        InsertSql insertSql = new InsertSql(connection, room);
        PreparedStatement createPs = insertSql.getPreparedStatement();

        if(createPs.executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
            ps.setInt(1, lastInsertId.getInt("LAST_INSERT_ID()"));

            ResultSet result = ps.executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public Room query(int id) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
        ps.setInt(1, id);

        ResultSet result = ps.executeQuery();
        result.next();

        return new Room(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_ROOMID);
        ps.setInt(1, bookingid);

        int resultSet = ps.executeUpdate();
        return resultSet == 1;
    }

    public Room update(int id, Room room) throws SQLException {
        UpdateSql updateSql = new UpdateSql(connection, id, room);
        PreparedStatement updatePs = updateSql.getPreparedStatement();

        if(updatePs.executeUpdate() > 0){
            PreparedStatement ps = connection.prepareStatement(SELECT_BY_ROOMID);
            ps.setInt(1, id);

            ResultSet result = ps.executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public List<Room> queryRooms() throws SQLException {
        List<Room> listToReturn = new ArrayList<Room>();

        PreparedStatement ps = connection.prepareStatement(SELECT_ROOMS);

        ResultSet results = ps.executeQuery();
        while(results.next()){
            listToReturn.add(new Room(results));
        }

        return listToReturn;
    }

    public void resetDB() throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_ROOMS);

        ps.executeUpdate();

        PreparedStatement resetPs = connection.prepareStatement("ALTER TABLE ROOMS ALTER COLUMN roomid RESTART WITH 1");

        resetPs.execute();
    }
}

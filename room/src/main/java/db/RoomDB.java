package db;

import model.Room;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RoomDB {

    private Connection connection;

    public RoomDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        Server server = Server.createTcpServer("-tcpPort", "9091").start();

        String prepareDb = "CREATE table ROOMS ( roomid int NOT NULL AUTO_INCREMENT," +
                           " room_number int," +
                           " type varchar(255)," +
                           " beds int," +
                           " accessible boolean," +
                           " details varchar(2000)," +
                           " primary key (roomid));";
        connection.prepareStatement(prepareDb).executeUpdate();

        String injectBooking = "INSERT INTO ROOMS (room_number, type, beds, accessible, details) " +
                               "VALUES(101, 'Twin', 2, false, 'WiFi, TV, Mini-bar');";
        connection.prepareStatement(injectBooking).executeUpdate();
    }

    public Room create(Room room) throws SQLException {
        InsertSql insertSql = new InsertSql(room);
        String sql = insertSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            String querySql = "SELECT * FROM ROOMS WHERE roomid='" + lastInsertId.getInt("LAST_INSERT_ID()") + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public Room query(int id) throws SQLException {
        String sql = "SELECT * FROM ROOMS WHERE roomid='" + id + "'";

        ResultSet result = connection.prepareStatement(sql).executeQuery();
        result.next();

        return new Room(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        String sql = "DELETE FROM ROOMS WHERE roomid='" + bookingid + "'";

        int resultSet = connection.prepareStatement(sql).executeUpdate();
        return resultSet == 1;
    }

    public Room update(int id, Room room) throws SQLException {
        UpdateSql updateSql = new UpdateSql(id, room);
        String sql = updateSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            String querySql = "SELECT * FROM ROOMS WHERE roomid='" + id + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Room createdRoom = new Room(result);
            createdRoom.setRoomid(result.getInt("roomid"));

            return createdRoom;
        } else {
            return null;
        }
    }

    public List<Room> searchRooms(String keyword) throws SQLException {
        List<Room> listToReturn = new ArrayList<Room>();
        String sql = "SELECT * FROM ROOMS WHERE name = '" + keyword + "';";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Room(results));
        }

        return listToReturn;
    }

    public List<Room> queryRooms() throws SQLException {
        List<Room> listToReturn = new ArrayList<Room>();
        String sql = "SELECT * FROM ROOMS";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Room(results));
        }

        return listToReturn;
    }
}

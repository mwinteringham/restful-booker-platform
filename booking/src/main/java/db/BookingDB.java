package db;

import model.Booking;
import model.CreatedBooking;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BookingDB {

    private Connection connection;

    public BookingDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        Server server = Server.createTcpServer("-tcpPort", "9090", "-tcpAllowOthers").start();

        String prepareDb = "CREATE table BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, roomid int, firstname varchar(255), lastname varchar(255), totalprice int, depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));";
        connection.prepareStatement(prepareDb).executeUpdate();

        String injectBooking = "INSERT INTO BOOKINGS(roomid, firstname, lastname, totalprice, depositpaid, checkin, checkout) VALUES(1,'James','Dean',100,true,'2018-02-26','2018-02-26');";
        connection.prepareStatement(injectBooking).executeUpdate();
    }

    public CreatedBooking create(Booking booking) throws SQLException {
        InsertSql insertSql = new InsertSql(booking);
        String sql = insertSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            String querySql = "SELECT * FROM BOOKINGS WHERE bookingid='" + lastInsertId.getInt("LAST_INSERT_ID()") + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Booking createdBooking = new Booking(result);

            return new CreatedBooking(result.getInt("bookingid"), createdBooking);
        } else {
            return null;
        }
    }

    public List<Booking> queryBookingsById(String roomid) throws SQLException {
        List<Booking> listToReturn = new ArrayList<Booking>();
        String sql = "SELECT * FROM BOOKINGS WHERE roomid = " + roomid;

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Booking(results));
        }

        return listToReturn;
    }

    public List<Booking> queryBookingsByName(String keyword) throws SQLException {
        List<Booking> listToReturn = new ArrayList<Booking>();
        String sql = "SELECT * FROM BOOKINGS WHERE firstname = '" + keyword + "' OR lastname = '" + keyword + "';";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Booking(results));
        }

        return listToReturn;
    }

    public Booking query(int id) throws SQLException {
        String sql = "SELECT * FROM BOOKINGS WHERE bookingid='" + id + "'";

        ResultSet result = connection.prepareStatement(sql).executeQuery();
        result.next();

        return new Booking(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        String sql = "DELETE FROM BOOKINGS WHERE bookingid='" + bookingid + "'";

        int resultSet = connection.prepareStatement(sql).executeUpdate();
        return resultSet == 1;
    }

    public CreatedBooking update(int id, Booking booking) throws SQLException {
        UpdateSql updateSql = new UpdateSql(id, booking);
        String sql = updateSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            String querySql = "SELECT * FROM BOOKINGS WHERE bookingid='" + id + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Booking createdBooking = new Booking(result);

            return new CreatedBooking(result.getInt("bookingid"), createdBooking);
        } else {
            return null;
        }
    }
}

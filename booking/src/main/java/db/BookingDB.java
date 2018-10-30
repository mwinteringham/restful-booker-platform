package db;

import model.Booking;
import model.CreatedBooking;
import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

public class BookingDB {

    private Connection connection;

    private final String CREATE_DB = "CREATE table BOOKINGS ( bookingid int NOT NULL AUTO_INCREMENT, roomid int, firstname varchar(255), lastname varchar(255), totalprice int, depositpaid Boolean, checkin Date, checkout Date, primary key (bookingid));";
    private final String SELECT_BY_BOOKINGID = "SELECT * FROM BOOKINGS WHERE bookingid=?";
    private final String DELETE_BY_ID = "DELETE FROM BOOKINGS WHERE bookingid = ?" ;
    private final String SELECT_BY_NAME = "SELECT * FROM BOOKINGS WHERE firstname = ? OR lastname = ?;";
    private final String DELETE_ALL_BOOKINGS = "DELETE FROM BOOKINGS";
    private final String SELECT_DATE_CONFLICTS = "SELECT COUNT(1) FROM BOOKINGS WHERE ((checkin BETWEEN ? AND ?) OR (checkout BETWEEN ? AND ?) OR (checkin <= ? AND checkout >= ?)) AND (roomid = ?)";

    public BookingDB(boolean enableServer) throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        if (enableServer) {
            Server server = Server.createTcpServer("-tcpPort", "9090", "-tcpAllowOthers").start();
        }

        connection.prepareStatement(CREATE_DB).executeUpdate();

        Booking booking = new Booking.BookingBuilder()
                .setRoomid(1)
                .setFirstname("James")
                .setLastname("Dean")
                .setTotalprice(100)
                .setDepositpaid(true)
                .setCheckin(new GregorianCalendar(2018,1,26).getTime())
                .setCheckout(new GregorianCalendar(2018,1,26).getTime())
                .build();

        InsertSql insertSql = new InsertSql(connection, booking);
        insertSql.getPreparedStatement().executeUpdate();
    }

    public CreatedBooking create(Booking booking) throws SQLException {
        InsertSql insertSql = new InsertSql(connection, booking);

        PreparedStatement createPs = insertSql.getPreparedStatement();

        if(createPs.executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            PreparedStatement ps = connection.prepareStatement(SELECT_BY_BOOKINGID);
            ps.setInt(1, lastInsertId.getInt("LAST_INSERT_ID()") );

            ResultSet result = ps.executeQuery();
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

        PreparedStatement ps = connection.prepareStatement(SELECT_BY_NAME);
        ps.setString(1, keyword);
        ps.setString(2, keyword);

        ResultSet results = ps.executeQuery();
        while(results.next()){
            listToReturn.add(new Booking(results));
        }

        return listToReturn;
    }

    public Booking query(int id) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_BY_BOOKINGID);
        ps.setInt(1, id);

        ResultSet result = ps.executeQuery();
        result.next();

        return new Booking(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_BY_ID);
        ps.setInt(1, bookingid);

        int resultSet = ps.executeUpdate();
        return resultSet == 1;
    }

    public CreatedBooking update(int id, Booking booking) throws SQLException {
        UpdateSql updateSql = new UpdateSql(connection, id, booking);
        PreparedStatement updatePs = updateSql.getPreparedStatement();

        if(updatePs.executeUpdate() > 0){
            PreparedStatement ps = connection.prepareStatement(SELECT_BY_BOOKINGID);
            ps.setInt(1, id);

            ResultSet result = ps.executeQuery();
            result.next();

            Booking createdBooking = new Booking(result);

            return new CreatedBooking(result.getInt("bookingid"), createdBooking);
        } else {
            return null;
        }
    }

    public void resetDB() throws SQLException {
        PreparedStatement ps = connection.prepareStatement(DELETE_ALL_BOOKINGS);

        ps.executeUpdate();

        PreparedStatement resetPs = connection.prepareStatement("ALTER TABLE BOOKINGS ALTER COLUMN bookingid RESTART WITH 1");

        resetPs.execute();
    }

    public Boolean checkForBookingConflict(Booking bookingToCheck) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_DATE_CONFLICTS);

        for(int i = 1; i <= 6; i++){
            if (i % 2 == 0){
                ps.setDate(i, new Date(bookingToCheck.getBookingDates().getCheckout().getTime()));
            } else {
                ps.setDate(i, new Date(bookingToCheck.getBookingDates().getCheckin().getTime()));
            }
        }

        ps.setInt(7, bookingToCheck.getRoomid());

        ResultSet result = ps.executeQuery();
        result.next();

        return result.getInt("COUNT(1)") > 0;
    }
}

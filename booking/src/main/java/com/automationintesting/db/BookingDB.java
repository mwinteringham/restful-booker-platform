package com.automationintesting.db;

import com.automationintesting.model.Booking;
import com.automationintesting.model.CreatedBooking;
import org.h2.jdbcx.JdbcDataSource;
import org.springframework.stereotype.Component;

import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Component
public class BookingDB {

    private Connection connection;

    private final String SELECT_BY_BOOKINGID = "SELECT * FROM PUBLIC.BOOKINGS WHERE bookingid=?";
    private final String DELETE_BY_ID = "DELETE FROM PUBLIC.BOOKINGS WHERE bookingid = ?" ;
    private final String DELETE_ALL_BOOKINGS = "DELETE FROM PUBLIC.BOOKINGS";
    private final String SELECT_DATE_CONFLICTS = "SELECT COUNT(1) FROM PUBLIC.BOOKINGS WHERE ((checkin BETWEEN ? AND ?) OR (checkout BETWEEN ? AND ?) OR (checkin <= ? AND checkout >= ?)) AND (roomid = ?)";

    public BookingDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:rbp");
        ds.setUser("user");
        ds.setPassword("password");
        connection = ds.getConnection();

        // If you would like to access the DB for this API locally. Uncomment the line below and
        // use a SQL client to access jdbc:h2:tcp://localhost:9090/mem:rbp
        // Server server = Server.createTcpServer("-tcpPort", "9090", "-tcpAllowOthers").start();
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

        PreparedStatement resetPs = connection.prepareStatement("ALTER TABLE PUBLIC.BOOKINGS ALTER COLUMN bookingid RESTART WITH 1");

        resetPs.execute();
    }

    public Boolean checkForBookingConflict(Booking bookingToCheck) throws SQLException {
        PreparedStatement ps = connection.prepareStatement(SELECT_DATE_CONFLICTS);

        Calendar parseCheckinDate = Calendar.getInstance();
        parseCheckinDate.setTime(bookingToCheck.getBookingDates().getCheckin());
        parseCheckinDate.add(Calendar.DATE, 1);

        for(int i = 1; i <= 6; i++){
            if (i % 2 == 0){
                ps.setDate(i, new Date(bookingToCheck.getBookingDates().getCheckout().getTime()));
            } else {
                ps.setDate(i, new Date(parseCheckinDate.getTimeInMillis()));
            }
        }

        ps.setInt(7, bookingToCheck.getRoomid());

        ResultSet result = ps.executeQuery();
        result.next();

        return result.getInt("COUNT(1)") > 0;
    }
}

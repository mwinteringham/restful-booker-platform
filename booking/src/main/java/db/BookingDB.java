package db;

import model.Booking;
import model.CreatedBooking;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BookingDB {

    private Connection connection;

    public BookingDB() throws SQLException {
        connection = DriverManager.getConnection("jdbc:mysql://" + System.getenv("mysqlDomain") + ":3306/rbp?user=root&password=password");
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

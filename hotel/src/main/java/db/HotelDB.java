package db;

import model.CreatedHotel;
import model.Hotel;
import org.h2.jdbcx.JdbcDataSource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class HotelDB {

    private Connection connection;

    public HotelDB() throws SQLException {
        JdbcDataSource ds = new JdbcDataSource();
        ds.setURL("jdbc:h2:mem:");
        ds.setUser("hotel");
        ds.setPassword("hotel");
        connection = ds.getConnection();

        String prepareDb = "CREATE table HOTELS ( hotelid int NOT NULL AUTO_INCREMENT, name varchar(255), address varchar(255), regdate Date, contactName varchar(255), contactPhone varchar(255), contactEmail varchar(255), primary key (hotelid));";
        connection.prepareStatement(prepareDb).executeUpdate();

        String injectBooking = "INSERT INTO HOTELS (name, address, regdate, contactName, contactPhone, contactEmail) VALUES('Hilton', '52 The Street, City', '2018-01-01', 'Mark', '01612829348', 'mark@hilton.com');";
        connection.prepareStatement(injectBooking).executeUpdate();
    }

    public CreatedHotel create(Hotel hotel) throws SQLException {
        InsertSql insertSql = new InsertSql(hotel);
        String sql = insertSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            ResultSet lastInsertId = connection.prepareStatement("SELECT LAST_INSERT_ID()").executeQuery();
            lastInsertId.next();

            String querySql = "SELECT * FROM HOTELS WHERE hotelid='" + lastInsertId.getInt("LAST_INSERT_ID()") + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Hotel createdHotel = new Hotel(result);

            return new CreatedHotel(result.getInt("hotelid"), createdHotel);
        } else {
            return null;
        }
    }

    public Hotel query(int id) throws SQLException {
        String sql = "SELECT * FROM HOTELS WHERE hotelid='" + id + "'";

        ResultSet result = connection.prepareStatement(sql).executeQuery();
        result.next();

        return new Hotel(result);
    }

    public Boolean delete(int bookingid) throws SQLException {
        String sql = "DELETE FROM HOTELS WHERE hotelid='" + bookingid + "'";

        int resultSet = connection.prepareStatement(sql).executeUpdate();
        return resultSet == 1;
    }

    public CreatedHotel update(int id, Hotel hotel) throws SQLException {
        UpdateSql updateSql = new UpdateSql(id, hotel);
        String sql = updateSql.buildSql();

        if(connection.prepareStatement(sql).executeUpdate() > 0){
            String querySql = "SELECT * FROM HOTELS WHERE hotelid='" + id + "'";

            ResultSet result = connection.prepareStatement(querySql).executeQuery();
            result.next();

            Hotel createdHotel = new Hotel(result);

            return new CreatedHotel(result.getInt("hotelid"), createdHotel);
        } else {
            return null;
        }
    }

    public List<Hotel> searchHotels(String keyword) throws SQLException {
        List<Hotel> listToReturn = new ArrayList<Hotel>();
        String sql = "SELECT * FROM HOTELS WHERE name = '" + keyword + "';";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Hotel(results));
        }

        return listToReturn;
    }

    public List<Hotel> queryHotels() throws SQLException {
        List<Hotel> listToReturn = new ArrayList<Hotel>();
        String sql = "SELECT * FROM HOTELS";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Hotel(results));
        }

        return listToReturn;
    }
}

package db;

import model.CreatedHotel;
import model.Hotel;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class HotelDB {

    private Connection connection;

    public HotelDB() throws SQLException {
        connection = DriverManager.getConnection("jdbc:mysql://" + System.getenv("mysqlDomain") + ":3306/rbp?user=root&password=password");
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

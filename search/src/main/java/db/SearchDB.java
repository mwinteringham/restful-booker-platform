package db;

import model.Booking;
import model.Hotel;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SearchDB {

    private Connection connection;

    public SearchDB() throws SQLException {
        connection = DriverManager.getConnection("jdbc:mysql://" + System.getenv("mysqlDomain") + ":3306/rbp?user=root&password=password");
    }


    public List<Booking> queryBookingsById(String hotelid) throws SQLException {
            List<Booking> listToReturn = new ArrayList<Booking>();
            String sql = "SELECT * FROM BOOKINGS WHERE hotelid = " + hotelid;

            ResultSet results = connection.prepareStatement(sql).executeQuery();
            while(results.next()){
                listToReturn.add(new Booking(results));
            }

            return listToReturn;
    }

    public List<Hotel> queryHotelsByName(String keyword) throws SQLException {
        List<Hotel> listToReturn = new ArrayList<Hotel>();
        String sql = "SELECT * FROM HOTELS WHERE name = '" + keyword + "';";

        ResultSet results = connection.prepareStatement(sql).executeQuery();
        while(results.next()){
            listToReturn.add(new Hotel(results));
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
}

package db;

import model.Report;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReportDB {

    private Connection connection;

    public ReportDB() throws SQLException {
        String host;

        if(System.getenv("mysqlDomain") == null){
            host = "localhost";
        } else {
            host = System.getenv("mysqlDomain");
        }

        connection = DriverManager.getConnection("jdbc:mysql://" + host + ":3306/rbp?user=root&password=password");
    }

    public Report getStats() throws SQLException {
        List<String> hotels = new ArrayList<String>();
        int[] totals;

        ResultSet queriedHotels = connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                ResultSet.CONCUR_READ_ONLY).executeQuery("SELECT hotelid, name FROM HOTELS;");

        queriedHotels.last();
        totals = new int[queriedHotels.getRow()];
        queriedHotels.first();

        boolean iterate = true;
        int count = 0;

        while(iterate){
            int total = 0;

            hotels.add(queriedHotels.getString("name"));
            int id = queriedHotels.getInt("hotelid");

            ResultSet queriedBookings = connection.prepareStatement("SELECT totalprice FROM BOOKINGS where hotelid = '" + id + "'").executeQuery();

            while (queriedBookings.next()){
                total = total + queriedBookings.getInt("totalPrice");
            }

            totals[count] = total;
            count++;
            iterate = queriedHotels.next();
        }

        return new Report(hotels, totals);
    }

}

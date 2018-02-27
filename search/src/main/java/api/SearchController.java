package api;

import db.SearchDB;
import model.SearchResults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Optional;

@RestController
public class SearchController {

    private SearchDB searchDB;

    public SearchController() throws SQLException {
        searchDB = new SearchDB();
    }

    @CrossOrigin(value = "*")
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ResponseEntity<SearchResults> getHotels(@RequestParam("hotelid") Optional<String> hotelid, @RequestParam("keyword") Optional<String> keyword) throws SQLException {
        if(keyword.isPresent()){
            return ResponseEntity.ok(new SearchResults(searchDB.queryBookingsByName(keyword.get()), searchDB.queryHotelsByName(keyword.get())));
        }

        if(hotelid.isPresent()){
            return ResponseEntity.ok(new SearchResults(searchDB.queryBookingsById(hotelid.get()), null));
        }

        return ResponseEntity.ok().build();
    }

}

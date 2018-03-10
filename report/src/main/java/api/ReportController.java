package api;

import db.ReportDB;
import model.Report;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

@RestController
public class ReportController {

    private ReportDB reportDB;

    public ReportController() throws SQLException {
        reportDB = new ReportDB();
    }

    @CrossOrigin
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public Report createBooking() throws SQLException {
        return reportDB.getStats();
    }

}

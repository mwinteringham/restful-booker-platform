package com.automationintesting.api;

import com.automationintesting.model.report.Report;
import com.automationintesting.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.automationintesting.requests.BookingRequests;
import com.automationintesting.requests.RoomRequests;


import java.sql.SQLException;

@RestController
public class ReportController {

    @Autowired
    private ReportService reportService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Report> getAllRoomReports() {
        Report report = reportService.getAllRoomsReport();

        return ResponseEntity.status(HttpStatus.OK).body(report);
    }

    @RequestMapping(value = "/room/{id:[0-9]*}", method = RequestMethod.GET)
    public ResponseEntity<Report> getSpecificRoomReport(@PathVariable(value = "id") int roomId){
        Report report = reportService.getSpecificRoomReport(roomId);

        return ResponseEntity.status(HttpStatus.OK).body(report);
    }

}

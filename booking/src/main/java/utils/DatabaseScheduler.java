package utils;

import db.BookingDB;
import model.Booking;
import model.CreatedBooking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.GregorianCalendar;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class DatabaseScheduler {

    static Logger logger = LoggerFactory.getLogger(DatabaseScheduler.class);

    public static void setupScheduler(BookingDB bookingDB){
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        Runnable r = () -> {
            try {
                logger.info("Resetting database");
                bookingDB.resetDB();

                Booking booking = new Booking.BookingBuilder()
                        .setRoomid(1)
                        .setFirstname("James")
                        .setLastname("Dean")
                        .setTotalprice(100)
                        .setDepositpaid(true)
                        .setCheckin(new GregorianCalendar(2018,1,26).getTime())
                        .setCheckout(new GregorianCalendar(2018,1,26).getTime())
                        .build();

                bookingDB.create(booking);
            } catch ( Exception e ) {
                logger.error("Scheduler failed " + e.getMessage());
            }
        };

        executor.scheduleAtFixedRate ( r , 0L , 10L , TimeUnit.MINUTES );
    }

}

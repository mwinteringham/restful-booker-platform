package utils;

import db.RoomDB;
import model.Room;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class DatabaseScheduler {

    static Logger logger = LoggerFactory.getLogger(DatabaseScheduler.class);

    public static void setupScheduler(RoomDB roomDB){
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        Runnable r = () -> {
            try {
                logger.info("Resetting database");
                roomDB.resetDB();

                Room room = new Room(101, "Twin", 2, false , "Wifi, TV, Mini-bar");

                roomDB.create(room);
            } catch ( Exception e ) {
                logger.error("Scheduler failed " + e.getMessage());
            }
        };

        executor.scheduleAtFixedRate ( r , 0L , 10L , TimeUnit.MINUTES );
    }

}

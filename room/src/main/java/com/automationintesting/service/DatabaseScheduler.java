package com.automationintesting.service;

import com.automationintesting.db.RoomDB;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class DatabaseScheduler {

    private Logger logger = LoggerFactory.getLogger(DatabaseScheduler.class);
    private int resetCount;
    private boolean stop;

    public DatabaseScheduler() {
        if(System.getenv("dbRefresh") == null){
            this.resetCount = 0;
        } else {
            this.resetCount = Integer.parseInt(System.getenv("dbRefresh"));
        }
    }

    public void startScheduler(RoomDB roomDB, TimeUnit timeUnit){
        if(resetCount > 0){
            ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

            Runnable r = () -> {
                if(!stop){
                    try {
                        logger.info("Resetting database");

                        roomDB.seedDB();
                    } catch ( Exception e ) {
                        logger.error("Scheduler failed " + e.getMessage());
                    }
                }
            };

            executor.scheduleAtFixedRate ( r , 0L , resetCount , timeUnit );
        } else {
            logger.info("No env var was set for DB refresh (or set as 0) so not running DB reset");
        }
    }

    public int getResetCount() {
        return resetCount;
    }

    public void stepScheduler() {
        stop = true;
    }
}

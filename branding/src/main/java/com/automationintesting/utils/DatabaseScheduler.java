package com.automationintesting.utils;

import com.automationintesting.db.BrandingDB;
import com.automationintesting.model.Branding;
import com.automationintesting.model.Contact;
import com.automationintesting.model.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

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

    public void startScheduler(BrandingDB brandingDB, TimeUnit timeUnit){
        if(resetCount > 0){
            ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

            Runnable r = () -> {
                if(!stop){
                    try {
                        logger.info("Resetting database");
                        brandingDB.resetDB();

                        Branding branding = new Branding(
                                "Shady Meadows B&B",
                                new Map(52.6351204, 1.2733774),
                                "https://www.mwtestconsultancy.co.uk/img/rbp-logo.png",
                                "Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.",
                                new Contact("Shady Meadows B&B", "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S", "012345678901", "fake@fakeemail.com")
                        );

                        brandingDB.update(branding);
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
    
}

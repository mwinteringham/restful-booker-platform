package com.automationintesting.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import springfox.documentation.oas.annotations.EnableOpenApi;

import java.util.TimeZone;

@SpringBootApplication
@ComponentScan(basePackages = "com.automationintesting")
@EnableOpenApi
public class BookingApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Etc/UTC"));

        SpringApplication.run(BookingApplication.class, args);
    }

}

package com.automationintesting.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.automationintesting")
public class BrandingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BrandingApplication.class, args);
    }

}

package com.automationintesting.api;

import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RestController
public class BrandingController {

    @Bean
    public WebMvcConfigurer configurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String originHost = "http://localhost:3003";

                if(System.getenv("cors") != null){
                    originHost = System.getenv("cors");
                }

                registry.addMapping("/*")
                        .allowedMethods("GET", "POST", "DELETE", "PUT")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    public BrandingController() {
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity getBranding() {
        String jsonString = "{\n" +
                "    \"map\": {\n" +
                "        \"hotelName\": \"Shady meadows B&B\",\n" +
                "        \"latitude\": 52.6351204,\n" +
                "        \"longitude\": 1.2733774\n" +
                "    },\n" +
                "    \"logo\": {\n" +
                "        \"url\": \"https://www.mwtestconsultancy.co.uk/img/rbp-logo.png\"\n" +
                "    },\n" +
                "    \"description\": \"Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It\"s a delightful place.\",\n" +
                "    \"contact\": {\n" +
                "        \"name\": \"Shady Meadows B&B\",\n" +
                "        \"address\": \"The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S\",\n" +
                "        \"phone\": \"0123456789\",\n" +
                "        \"email\": \"fake@fakeemail.com\"\n" +
                "    }\n" +
                "}";

        return ResponseEntity.ok().body(jsonString);
    }

}

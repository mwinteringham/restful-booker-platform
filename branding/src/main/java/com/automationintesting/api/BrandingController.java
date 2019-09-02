package com.automationintesting.api;

import com.automationintesting.db.BrandingDB;
import com.automationintesting.model.Branding;
import com.automationintesting.requests.AuthRequests;
import com.automationintesting.utils.DatabaseScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.concurrent.TimeUnit;

@RestController
public class BrandingController {

    @Autowired
    private BrandingDB brandingDB;
    private AuthRequests authRequest;

    @Bean
    public WebMvcConfigurer configurer() {

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
            DatabaseScheduler databaseScheduler = new DatabaseScheduler();
            databaseScheduler.startScheduler(brandingDB, TimeUnit.MINUTES);

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

    public BrandingController() throws SQLException {
        this.authRequest = new AuthRequests();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Branding> getBranding() throws SQLException {
        Branding branding = brandingDB.queryBranding();

        return ResponseEntity.ok(branding);
    }

    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBranding(@Valid @RequestBody Branding branding, @CookieValue(value ="token", required = false) String token) throws SQLException {
        if(authRequest.postCheckAuth(token)){
            Branding updatedBranding = brandingDB.update(branding);

            return ResponseEntity.ok(updatedBranding);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}

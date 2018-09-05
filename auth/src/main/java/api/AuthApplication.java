package api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan()
public class AuthApplication {

    // Testing the lookup by making a change in search
    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }

}

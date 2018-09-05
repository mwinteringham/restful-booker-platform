package api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan()
public class SearchApplication {

    // Testing the lookup by making a change in search
    public static void main(String[] args) {
        SpringApplication.run(SearchApplication.class, args);
    }

}

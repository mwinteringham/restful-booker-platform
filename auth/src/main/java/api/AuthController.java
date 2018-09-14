package api;

import auth.Tokens;
import model.Auth;
import model.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RestController
public class AuthController {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String originHost = "http://localhost:3003";

                if(System.getenv("cors") != null){
                    originHost = System.getenv("cors");
                }

                registry.addMapping("/*")
                        .allowedOrigins(originHost)
                        .allowCredentials(true);
            }
        };
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<Token> createToken(@RequestBody Auth auth) {
        if(auth.getUsername().equals("admin") && auth.getPassword().equals("password")){
            return ResponseEntity.ok(new Token(Tokens.create()));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @RequestMapping(value = "/validate", method = RequestMethod.POST)
    public ResponseEntity<Token> validateToken(@RequestBody Token token) {
        if(Tokens.verify(token.getToken())){
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity clearToken(@RequestBody Token token) {
        Tokens.clear(token.getToken());

        return ResponseEntity.status(HttpStatus.OK).build();
    }

}

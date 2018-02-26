package api;

import auth.Tokens;
import model.Auth;
import model.Token;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

//    @RequestMapping(value = "/ping", method = RequestMethod.GET)
//    public ResponseEntity sendHeartbeat(){
//        return ResponseEntity.status(HttpStatus.OK).build();
//    }

    @CrossOrigin()
    @RequestMapping(value = "/auth", method = RequestMethod.POST)
    public ResponseEntity<Token> createToken(@RequestBody Auth auth) {
        if(auth.getUsername().equals("admin") && auth.getPassword().equals("password")){
            return ResponseEntity.ok(new Token(Tokens.create()));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @CrossOrigin()
    @RequestMapping(value = "/validate", method = RequestMethod.POST)
    public ResponseEntity<Token> validateToken(@RequestBody Token token) {
        if(Tokens.verify(token.getToken())){
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @CrossOrigin()
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ResponseEntity clearToken(@RequestBody Token token) {
        Tokens.clear(token.getToken());

        return ResponseEntity.status(HttpStatus.OK).build();
    }

}

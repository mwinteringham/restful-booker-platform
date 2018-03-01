package payload;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenPayload {

    @JsonProperty
    private String token;

    public TokenPayload() {
    }

    public TokenPayload(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

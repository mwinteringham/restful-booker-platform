package com.automationintesting.api;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI(@Value("${swagger.server-url:/branding/}") String serverUrl) {
        return new OpenAPI()
                .addServersItem(new Server().url(serverUrl));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("branding-api")
                .pathsToMatch("/**")
                .build();
    }

}

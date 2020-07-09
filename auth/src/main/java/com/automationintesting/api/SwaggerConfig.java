package com.automationintesting.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket postsApi() {
        return new Docket(DocumentationType.SWAGGER_2).groupName("public-api")
                .apiInfo(apiInfo())
                .select()
                    .apis(RequestHandlerSelectors.basePackage("com.automationintesting.api"))
                    .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("RestfulBooker Auth service")
                .description("Authorisation service for Restful Booker. An application for teaching Automation in Testing")
                .contact(new Contact("Mark Winteringham / Richard Bradshaw", "https://automationintesting.com/", "mark@mwtestconsultancy.co.uk"))
                .license("MIT")
                .licenseUrl("https://opensource.org/licenses/MIT")
                .version("1.0")
                .build();
    }

}

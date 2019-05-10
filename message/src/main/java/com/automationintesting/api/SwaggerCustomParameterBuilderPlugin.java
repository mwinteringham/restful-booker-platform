package com.automationintesting.api;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CookieValue;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.ParameterBuilderPlugin;
import springfox.documentation.spi.service.contexts.ParameterContext;
import springfox.documentation.swagger.common.SwaggerPluginSupport;

import java.lang.annotation.Annotation;
import java.util.List;

import static springfox.documentation.swagger.common.SwaggerPluginSupport.pluginDoesApply;

@Component
@Order(SwaggerPluginSupport.SWAGGER_PLUGIN_ORDER + 1000)
public class SwaggerCustomParameterBuilderPlugin implements ParameterBuilderPlugin {

    @Override
    public void apply(ParameterContext context) {
        if (isCookieValue(context)) {
            context.parameterBuilder().parameterType("cookie");
        }
    }

    private boolean isCookieValue(ParameterContext context) {
        List<Annotation> annotations = context.resolvedMethodParameter().getAnnotations();
        return annotations.stream().anyMatch(annotation -> annotation.annotationType() == CookieValue.class);
    }

    @Override
    public boolean supports(DocumentationType documentationType) {
        return pluginDoesApply(documentationType);
    }

}

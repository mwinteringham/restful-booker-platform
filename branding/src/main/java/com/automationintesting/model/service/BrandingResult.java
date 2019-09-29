package com.automationintesting.model.service;

import com.automationintesting.model.db.Branding;
import org.springframework.http.HttpStatus;

public class BrandingResult {

    private HttpStatus httpStatus;
    private Branding branding;

    public BrandingResult(HttpStatus httpStatus, Branding branding) {
        this.httpStatus = httpStatus;
        this.branding = branding;
    }

    public BrandingResult(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public Branding getBranding() {
        return branding;
    }

    public void setBranding(Branding branding) {
        this.branding = branding;
    }
}

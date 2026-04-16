package com.portfolio.courtreservation.dto;

public class ReserveRequest {

    private String bookerName;
    private String bookerEmail;

    public ReserveRequest() {}

    public ReserveRequest(String bookerName, String bookerEmail) {
        this.bookerName = bookerName;
        this.bookerEmail = bookerEmail;
    }

    public String getBookerName() {
        return bookerName;
    }

    public String getBookerEmail() {
        return bookerEmail;
    }
}

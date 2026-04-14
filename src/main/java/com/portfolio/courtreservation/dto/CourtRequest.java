package com.portfolio.courtreservation.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class CourtRequest {
    private String name;
    private String type;
    private LocalTime operatingHoursStart;
    private LocalTime operatingHoursEnd;
    private Integer maxDaysOut;
}

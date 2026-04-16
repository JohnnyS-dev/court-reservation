package com.portfolio.courtreservation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class CourtResponse {
    private UUID id;
    private String name;
    private String type;
    private LocalTime operatingHoursStart;
    private LocalTime operatingHoursEnd;
    private Integer maxDaysOut;
    private Boolean active;
}

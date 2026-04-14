package com.portfolio.courtreservation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ReserveResponse {
    private String confirmationCode;
    private UUID slotId;
    private String bookerName;
    private LocalDate date;
    private LocalTime startTime;
}

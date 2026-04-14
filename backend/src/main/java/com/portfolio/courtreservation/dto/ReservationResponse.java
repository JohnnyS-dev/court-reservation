package com.portfolio.courtreservation.dto;

import com.portfolio.courtreservation.model.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ReservationResponse {

    private UUID id;
    private String bookerName;
    private String bookerEmail;
    private String confirmationCode;
    private LocalDateTime createdAt;
    private ReservationStatus status;

    private UUID slotId;
    private LocalDate slotDate;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;
}

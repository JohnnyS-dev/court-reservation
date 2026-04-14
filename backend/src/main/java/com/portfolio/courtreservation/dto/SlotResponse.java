package com.portfolio.courtreservation.dto;

import com.portfolio.courtreservation.model.enums.SlotStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class SlotResponse {
    private UUID id;
    private UUID courtId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
}

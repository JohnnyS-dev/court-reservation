package com.portfolio.courtreservation.controller;

import com.portfolio.courtreservation.dto.ReserveRequest;
import com.portfolio.courtreservation.dto.ReserveResponse;
import com.portfolio.courtreservation.dto.SlotResponse;
import com.portfolio.courtreservation.model.TimeSlot;
import com.portfolio.courtreservation.repository.TimeSlotRepository;
import com.portfolio.courtreservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class PublicController {

    private final TimeSlotRepository timeSlotRepository;
    private final ReservationService reservationService;

    @GetMapping("/{courtId}/slots")
    public ResponseEntity<List<SlotResponse>> getSlots(
            @PathVariable UUID courtId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<SlotResponse> slots = timeSlotRepository
                .findByCourtIdAndDateBetween(courtId, startDate, endDate)
                .stream()
                .map(this::toSlotResponse)
                .toList();

        return ResponseEntity.ok(slots);
    }

    @PostMapping("/{courtId}/slots/{slotId}/reserve")
    public ResponseEntity<ReserveResponse> reserve(
            @PathVariable UUID courtId,
            @PathVariable UUID slotId,
            @RequestBody ReserveRequest request) {

        // TODO: courtId is not validated against the slot's court here; add check if needed
        ReserveResponse response = reservationService.createReservation(slotId, request);
        return ResponseEntity.ok(response);
    }

    private SlotResponse toSlotResponse(TimeSlot slot) {
        return SlotResponse.builder()
                .id(slot.getId())
                .courtId(slot.getCourt().getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .status(slot.getStatus())
                .build();
    }
}

package com.portfolio.courtreservation.controller;

import com.portfolio.courtreservation.dto.CourtRequest;
import com.portfolio.courtreservation.model.Court;
import com.portfolio.courtreservation.model.Reservation;
import com.portfolio.courtreservation.service.CourtService;
import com.portfolio.courtreservation.service.ReservationService;
import com.portfolio.courtreservation.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CourtService courtService;
    private final SlotService slotService;
    private final ReservationService reservationService;

    @PostMapping("/courts")
    public ResponseEntity<Court> createCourt(@RequestBody CourtRequest request) {
        return ResponseEntity.ok(courtService.createCourt(request));
    }

    @PutMapping("/courts/{courtId}")
    public ResponseEntity<Court> updateCourt(
            @PathVariable UUID courtId,
            @RequestBody CourtRequest request) {
        return ResponseEntity.ok(courtService.updateCourt(courtId, request));
    }

    @GetMapping("/courts")
    public ResponseEntity<List<Court>> getAllCourts() {
        return ResponseEntity.ok(courtService.getAllCourts());
    }

    @GetMapping("/courts/{courtId}/reservations")
    public ResponseEntity<List<Reservation>> getReservationsForCourt(@PathVariable UUID courtId) {
        return ResponseEntity.ok(reservationService.getReservationsForCourt(courtId));
    }

    @DeleteMapping("/reservations/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable UUID reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/courts/{courtId}/generate-slots")
    public ResponseEntity<Void> generateSlots(@PathVariable UUID courtId) {
        slotService.generateSlots(courtId);
        return ResponseEntity.noContent().build();
    }
}

package com.portfolio.courtreservation.service;

import com.portfolio.courtreservation.dto.ReservationResponse;
import com.portfolio.courtreservation.dto.ReserveRequest;
import com.portfolio.courtreservation.dto.ReserveResponse;
import com.portfolio.courtreservation.model.Reservation;
import com.portfolio.courtreservation.model.TimeSlot;
import com.portfolio.courtreservation.model.enums.ReservationStatus;
import com.portfolio.courtreservation.model.enums.SlotStatus;
import com.portfolio.courtreservation.repository.ReservationRepository;
import com.portfolio.courtreservation.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final String CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final TimeSlotRepository timeSlotRepository;
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;

    @Transactional
    public ReserveResponse createReservation(UUID slotId, ReserveRequest request) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found: " + slotId));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot is not available.");
        }

        String confirmationCode = generateConfirmationCode();

        Reservation reservation = Reservation.builder()
                .slot(slot)
                .bookerName(request.getBookerName())
                .bookerEmail(request.getBookerEmail())
                .confirmationCode(confirmationCode)
                .createdAt(LocalDateTime.now())
                .status(ReservationStatus.CONFIRMED)
                .build();

        slot.setStatus(SlotStatus.BOOKED);
        timeSlotRepository.save(slot);

        try {
            reservationRepository.save(reservation);
            reservationRepository.flush(); // force DB write so constraint violations surface here
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("This slot has already been booked.");
        }

        emailService.sendConfirmationEmail(
                request.getBookerEmail(),
                request.getBookerName(),
                confirmationCode,
                slot.getDate(),
                slot.getStartTime()
        );

        return ReserveResponse.builder()
                .confirmationCode(confirmationCode)
                .slotId(slotId)
                .bookerName(request.getBookerName())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .build();
    }

    public List<ReservationResponse> getReservationsForCourt(UUID courtId) {
        return reservationRepository.findBySlot_Court_Id(courtId).stream()
                .map(r -> ReservationResponse.builder()
                        .id(r.getId())
                        .bookerName(r.getBookerName())
                        .bookerEmail(r.getBookerEmail())
                        .confirmationCode(r.getConfirmationCode())
                        .createdAt(r.getCreatedAt())
                        .status(r.getStatus())
                        .slotId(r.getSlot().getId())
                        .slotDate(r.getSlot().getDate())
                        .slotStartTime(r.getSlot().getStartTime())
                        .slotEndTime(r.getSlot().getEndTime())
                        .build())
                .toList();
    }

    public void cancelReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + reservationId));

        reservation.setStatus(ReservationStatus.CANCELLED);

        TimeSlot slot = reservation.getSlot();
        slot.setStatus(SlotStatus.AVAILABLE);
        timeSlotRepository.save(slot);

        reservationRepository.save(reservation);
    }

    private String generateConfirmationCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }
}

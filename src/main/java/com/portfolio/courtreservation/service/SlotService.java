package com.portfolio.courtreservation.service;

import com.portfolio.courtreservation.model.Court;
import com.portfolio.courtreservation.model.TimeSlot;
import com.portfolio.courtreservation.model.enums.SlotStatus;
import com.portfolio.courtreservation.repository.CourtRepository;
import com.portfolio.courtreservation.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final CourtRepository courtRepository;
    private final TimeSlotRepository timeSlotRepository;

    /**
     * Generates one-hour TimeSlots for every operating hour, for each day from
     * today through court.maxDaysOut (inclusive). Slots that already exist for a
     * given court/date/startTime are skipped so this method is safe to call
     * repeatedly.
     */
    public void generateSlots(UUID courtId) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new RuntimeException("Court not found: " + courtId));

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(court.getMaxDaysOut());

        for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalTime current = court.getOperatingHoursStart();

            // TODO: consider whether slots that end exactly at operatingHoursEnd should be included
            while (!current.plusHours(1).isAfter(court.getOperatingHoursEnd())) {
                LocalTime slotStart = current;
                LocalTime slotEnd = current.plusHours(1);

                if (!timeSlotRepository.existsByCourtIdAndDateAndStartTime(courtId, date, slotStart)) {
                    TimeSlot slot = TimeSlot.builder()
                            .court(court)
                            .date(date)
                            .startTime(slotStart)
                            .endTime(slotEnd)
                            .status(SlotStatus.AVAILABLE)
                            .build();
                    timeSlotRepository.save(slot);
                }

                current = current.plusHours(1);
            }
        }
    }
}

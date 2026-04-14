package com.portfolio.courtreservation.repository;

import com.portfolio.courtreservation.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {

    List<TimeSlot> findByCourtIdAndDateBetween(UUID courtId, LocalDate startDate, LocalDate endDate);

    boolean existsByCourtIdAndDateAndStartTime(UUID courtId, LocalDate date, LocalTime startTime);
}

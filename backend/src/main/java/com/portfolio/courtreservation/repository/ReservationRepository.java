package com.portfolio.courtreservation.repository;

import com.portfolio.courtreservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    // Traverse slot → court to filter reservations by court
    List<Reservation> findBySlot_Court_Id(UUID courtId);
}

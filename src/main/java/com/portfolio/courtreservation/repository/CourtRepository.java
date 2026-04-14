package com.portfolio.courtreservation.repository;

import com.portfolio.courtreservation.model.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CourtRepository extends JpaRepository<Court, UUID> {
}

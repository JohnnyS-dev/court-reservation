package com.portfolio.courtreservation.service;

import com.portfolio.courtreservation.dto.CourtRequest;
import com.portfolio.courtreservation.model.Court;
import com.portfolio.courtreservation.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;

    public Court createCourt(CourtRequest request) {
        Court court = Court.builder()
                .name(request.getName())
                .type(request.getType())
                .operatingHoursStart(request.getOperatingHoursStart())
                .operatingHoursEnd(request.getOperatingHoursEnd())
                .maxDaysOut(request.getMaxDaysOut())
                .active(true)
                .build();
        return courtRepository.save(court);
    }

    public Court updateCourt(UUID courtId, CourtRequest request) {
        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new RuntimeException("Court not found: " + courtId));

        court.setName(request.getName());
        court.setType(request.getType());
        court.setOperatingHoursStart(request.getOperatingHoursStart());
        court.setOperatingHoursEnd(request.getOperatingHoursEnd());
        court.setMaxDaysOut(request.getMaxDaysOut());
        return courtRepository.save(court);
    }

    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }
}

package com.portfolio.courtreservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "court")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalTime operatingHoursStart;

    @Column(nullable = false)
    private LocalTime operatingHoursEnd;

    // Maximum number of days into the future that slots can be generated
    @Column(nullable = false)
    private Integer maxDaysOut;

    @Column(nullable = false)
    private Boolean active;
}

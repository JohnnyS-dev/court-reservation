package com.portfolio.courtreservation.model;

import com.portfolio.courtreservation.model.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // UNIQUE enforced at DB level to guard against race conditions on concurrent bookings
    @OneToOne
    @JoinColumn(name = "slot_id", unique = true, nullable = false)
    private TimeSlot slot;

    @Column(nullable = false)
    private String bookerName;

    @Column(nullable = false)
    private String bookerEmail;

    @Column(nullable = false)
    private String confirmationCode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;
}

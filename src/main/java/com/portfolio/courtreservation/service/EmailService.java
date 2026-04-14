package com.portfolio.courtreservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendConfirmationEmail(
            String bookerEmail,
            String bookerName,
            String confirmationCode,
            LocalDate date,
            LocalTime startTime) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(bookerEmail);
        message.setSubject("Court Reservation Confirmation – " + confirmationCode);
        message.setText(
                "Hi " + bookerName + ",\n\n" +
                "Your court reservation is confirmed.\n\n" +
                "Date:              " + date + "\n" +
                "Start time:        " + startTime + "\n" +
                "Confirmation code: " + confirmationCode + "\n\n" +
                "Please save this code — you may need it to manage your reservation.\n\n" +
                "See you on the court!"
        );

        // TODO: set a dedicated from-address via a configurable property
        mailSender.send(message);
    }
}

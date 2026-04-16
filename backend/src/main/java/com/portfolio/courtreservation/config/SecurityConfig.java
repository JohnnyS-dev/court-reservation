package com.portfolio.courtreservation.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    @Order(1)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.debug("SecurityConfig filterChain loaded");
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courts/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/courts/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Allow H2 console in dev; TODO: restrict or remove in prod
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            // Allow H2 console frames in dev
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder().encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

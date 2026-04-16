# Public Court Reservation System

A full-stack web application that allows park visitors to reserve public courts and fields via a QR code posted at the facility. Built as a portfolio project to demonstrate full-stack and backend engineering skills.

---

## System Architecture

Three-component monorepo:

- **backend/** — Spring Boot REST API. Manages courts, time slots, reservations, and email confirmations.
- **admin-panel/** — React admin UI. Allows park staff to create courts, generate slots, and view reservations.
- **booking-app/** — React mobile-first booking UI. Reached via QR code. No login required.

```
court-reservation/
├── backend/          # Spring Boot 3 REST API
├── admin-panel/      # React + Vite admin interface
└── booking-app/      # React + Vite public booking interface
```

---

## Tech Stack

| Layer    | Technologies                                          |
|----------|-------------------------------------------------------|
| Backend  | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JavaMail |
| Database | H2 (development), PostgreSQL (production)             |
| Frontend | React, Vite, React Router, plain CSS                  |

---

## Features

### For Park Visitors
- Scan a QR code at the facility to open the booking app
- View available and booked time slots for the current week
- Reserve a slot by entering a name and email address
- Receive an email confirmation with a unique confirmation code

### For Park Administrators
- Create and manage courts
- Generate time slots for any date range and time window
- View all upcoming reservations per court
- Protected by HTTP Basic authentication

---

## How to Run Locally

**1. Clone the repository**
```bash
git clone <repo-url>
cd court-reservation
```

**2. Set environment variables**

The backend requires the following environment variables:

| Variable           | Description                              |
|--------------------|------------------------------------------|
| `GMAIL_ADDRESS`    | Gmail address used to send confirmations |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) |
| `ADMIN_USERNAME`   | Username for the admin panel login       |
| `ADMIN_PASSWORD`   | Password for the admin panel login       |

**3. Run the backend**
```bash
cd backend
./mvnw spring-boot:run
```
Runs at `http://localhost:8080`

**4. Run the admin panel**
```bash
cd admin-panel
npm install
npm run dev
```
Runs at `http://localhost:5173`

**5. Run the booking app**
```bash
cd booking-app
npm install
npm run dev
```
Runs at `http://localhost:5174`

> **Note:** The H2 in-memory database resets on every backend restart. After starting the backend, use the admin panel to create a court and generate slots before the booking app will show any availability.

---

## What This Demonstrates

- **Multi-frontend architecture** — two independent React apps consuming a single REST API
- **RESTful API design** — resource-oriented endpoints with Spring Boot and Spring Data JPA
- **Scheduling and conflict detection** — slot generation with overlap prevention and status management
- **Spring Security** — HTTP Basic authentication guarding all admin endpoints
- **Email integration** — transactional confirmation emails via JavaMail and Gmail SMTP
- **Mobile-first React UI** — QR code entry point, no auth, optimized for small screens
- **SQL data modeling** — relational schema across courts, slots, and reservations
- **QR code entry point pattern** — stateless public URL designed for physical deployment

---

## Note on Production

The project uses an H2 in-memory database for local development and demonstration. It is designed to swap to PostgreSQL (via Supabase) for a persistent production deployment with no application code changes — only environment variable configuration.

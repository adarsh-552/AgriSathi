# AgriSathi (రైతు నేస్తం / कृषि साथी)
> **A Farmer-First, Safety-Gated Digital Crop Companion for Indian Agriculture**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Pan-India](https://img.shields.io/badge/Coverage-28%20States%20%2B%208%20UTs-blue.svg)](#)

---

## 🌾 Overview
**AgriSathi** is an independent, non-commercial digital crop companion built specifically for smallholder farmers across India. It eliminates commercial bias (no chemical sales/ads), addresses diagnostic amnesia through persistent **Crop Memory**, and enforces a **Safety-First Agronomic Decision Engine**.

### Core Differentiators
1. **Dynamic "Seed to Sale" Crop Journey**: Adapts dynamically to field milestones and weather events rather than following a rigid calendar.
2. **Contextual Crop Memory**: An immutable plot ledger logging irrigations, sprays, fertilizers, and weather events. Diagnostic checks recall the last 30 days of context before evaluating causes.
3. **Safety-Gated Problem Solver**: Prioritizes non-chemical Integrated Pest Management (IPM) first. Chemical sprays are strictly a last resort verified against **CIBRC label claims** with mandatory Pre-Harvest Interval (PHI) warnings.
4. **Multilingual & Voice-First**: Designed for low-literacy farmers in **Telugu, Hindi, and English** (ready to scale across 14+ Indian languages).
5. **Role-Separated Governance**: Secure, backend-protected admin management console (`ROLE_ADMIN`) for agronomic content verification with traceable citations (ICAR/SAU).

---

## 📱 16-Screen Storyboard Flow
* **Screen 01**: Splash Screen (`రైతు కోసం... రైతు భాషలో... రైతు తోడుగా...`)
* **Screen 02**: Low-Friction Login (Mobile Number / Email OTP)
* **Screen 03**: 6-Digit OTP Verification
* **Screen 04**: Language Selector (14+ Indian Languages)
* **Screen 05**: Location Selector (State $\rightarrow$ District $\rightarrow$ Mandal)
* **Screen 06**: Farmer Dashboard (Daily task with audio readout & weather spray advice)
* **Screen 07**: Crop Information & Catalog (Paddy, Chilli, Cotton, Maize, Groundnut, Soybean)
* **Screen 08**: Ask AgriSathi Voice / Text Assistant
* **Screen 09**: Problem Details (Symptoms & Causes)
* **Screen 10**: Solution & Guidance (Safe IPM steps, caution alerts, KVK scientist call)
* **Screen 11**: Weather & Agro-Met Advisories (5-day forecast & irrigation guidance)
* **Screen 12**: Market Prices & Mandi Trends (Kurnool Market Yard, 7/30/90-day price trend chart)
* **Screen 13**: Farming Knowledge Base
* **Screen 14**: Alerts & Notifications Feed
* **Screen 15**: Farmer Profile Management
* **Screen 16**: Role-Protected Admin Dashboard

---

## 🛠️ Technology Stack
* **Frontend**: React 18+, Tailwind CSS, Lucide Icons, Web Speech API & HTML5 Audio
* **Backend**: Java 21 LTS, Spring Boot 3.x, Spring Security 6 (Stateless JWT), Spring Data JPA
* **Database**: MySQL 8.0 (Production) / In-Memory H2 (Local zero-config dev)
* **Authoritative Data Sources**: ICAR, State Agricultural Universities, CIBRC, IMD, Agmarknet

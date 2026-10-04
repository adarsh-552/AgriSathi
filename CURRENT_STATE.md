# AgriSathi — Current State Audit (Phase 1 Inspection)

Date: 2026-10-04
Audit performed against `implementation_plan.md` and user requirements.

---

## 1. Feature Status Matrix

| Module | Feature Area | Status | Code State & Findings | Required Action |
|---|---|:---:|---|---|
| **Auth & OTP** | OTP Generation & Verification | ⚠️ Broken in browser | Backend uses `SecureRandom` and rejects `123456`. However, in real browser testing, farmers cannot see the OTP because no SMS gateway is configured and the frontend does not show the dev OTP preview. Also, `/api/v1/auth/otp/dev-preview` lacks `@Profile("dev")` / environment check, and invalid OTP needs explicit 401 response handling. | 1. Add `authService.getDevOtp(identifier)` in frontend.<br>2. Add dev simulated SMS banner on `03_OtpScreen.jsx` so browser tester can see & auto-fill the real generated OTP.<br>3. Restrict dev-preview to `dev`/`test` profile.<br>4. Add 10-digit Indian mobile validation on `02_LoginScreen.jsx`. |
| **Profile & Geo** | Pan-India State/District | ✅ Implemented | 28 States & 8 UTs in `indiaGeoData.js`. Profile fields (`pincode`, `landAreaAcres`, `soilType`, `irrigationSource`) persisted in DB via `FarmerProfileController`. | Ensure `05_LocationScreen.jsx` preserves farmer selection without fallback overriding. |
| **Dashboard** | Farmer Home Screen | ✅ Implemented | Shows profile, active crop, age, stage, GDD, today's task, weather summary, mandi preview, urgent alerts, and 6 action cards. | Polish i18n keys so changing language from Telugu to English/Hindi changes all labels. |
| **Crop Journey** | GDD & Dynamic Tasks | ✅ Implemented | 6 master crops with base temps, GDD heat unit formula, dynamic tasks from DB with fallback, and Add Crop modal. | Verify multiple crops and stage transitions in browser. |
| **Crop Memory** | Append-Only Ledger | ✅ Implemented | `CropMemoryController.java` (`GET/POST /api/v1/memory/{cropId}`), quick presets (Irrigation, Fertilizer, Spray, Weather), clean empty state. | Manual browser verification of event adding. |
| **Diagnostics** | Safety Gate & CIBRC | ✅ Implemented | 5 differential branches (`LEAF_YELLOWING`, `SUCKING_PEST`, `WILTING`, `BOLL_DAMAGE`, `LEAF_SPOT`), non-chemical priority for waterlogging, CIBRC toxicity bands & PHI. | Manual browser verification of diagnosis and KVK prefill. |
| **Weather** | 5-Day Agro-Advisory | ✅ Implemented | 5-day IMD forecast, `safeToSpray` indicator, dynamic district selection. | Verify in browser. |
| **Mandi** | APMC Market Rates | ✅ Implemented | APMC yard switcher, commodity filters, modal prices and trends. | Verify in browser. |
| **Schemes** | Central & State Schemes | ✅ Implemented | 6 authentic schemes seeded (PM-KISAN, PMFBY, PMKSY, Soil Health Card, SMAM, Rythu Bharosa) with category filters & portal links. | Verify in browser. |
| **Knowledge** | ICAR Agronomic Guides | ✅ Implemented | 4 verified ICAR guides with citations. | Verify in browser. |
| **Alerts** | Dynamic Engine | ✅ Implemented | Weather/pest alerts, notification bell with badge, `19_AlertsScreen.jsx`. | Verify in browser. |
| **Escalation** | KVK Scientist Support | ✅ Implemented | Ticket creation, status tracking (`PENDING`, `CONTACTED`, `RESOLVED`), district directory. | Verify in browser. |
| **Admin** | Role Security & Metrics | ✅ Implemented | `ROLE_ADMIN` check, 403 Forbidden for farmers, overview metrics. | Verify in browser. |
| **i18n** | Multilingual UI | ⚠️ Partially Implemented | Key files exist (`te.json`, `hi.json`, `en.json`), but some screen components have raw strings. | Replace remaining raw strings with translation keys. |
| **Daemons** | Runtime Services | ⚠️ Stopped | Background tasks terminated on server restart. | Start Spring Boot (8080) and Vite (5173) daemons and verify health. |

---

## 2. Immediate Action Plan

1. **Phase 2 (OTP Fix)**:
   - Secure `dev-preview` in `AuthController.java` with profile check (dev/test only).
   - Ensure explicit HTTP 401 on `BadCredentialsException` in `AuthController.java`.
   - Update `authService.js` to add `getDevOtp(identifier)`.
   - Update `03_OtpScreen.jsx` to fetch and display simulated SMS banner with genuine generated OTP in dev mode, with one-click "Auto-fill".
   - Add 10-digit Indian mobile regex validation in `02_LoginScreen.jsx`.
2. **Phase 3-15 (i18n & UI polish)**:
   - Ensure `HomeScreen.jsx` and other screens use translation keys for all cards and labels.
   - Ensure `05_LocationScreen.jsx` reacts smoothly to profile changes.
3. **Phase 19 (Verification)**:
   - Start backend daemon on port 8080.
   - Start frontend daemon on port 5173.
   - Run complete 20-scenario verification suite.
   - Perform real browser verification of the complete farmer flow (Login -> Dev OTP -> Lang -> Location -> Dashboard -> Add Crop -> Memory -> Diagnosis -> KVK -> Schemes -> Knowledge -> Alerts -> Mandi -> Weather) and Admin flow.
4. **Phase 20 (Git Sync)**:
   - Commit and push to `origin main`.

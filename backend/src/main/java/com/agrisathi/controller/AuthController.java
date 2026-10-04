package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.service.AuthService;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final Environment environment;

    public AuthController(AuthService authService, Environment environment) {
        this.authService = authService;
        this.environment = environment;
    }

    @PostMapping("/otp/request")
    public ResponseEntity<?> requestOtp(@RequestBody DTOs.OtpRequest request) {
        String identifier = request.getIdentifier() != null && !request.getIdentifier().isBlank()
                ? request.getIdentifier()
                : (request.getMobileNumber() != null ? request.getMobileNumber() : request.getEmail());
        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile number or email is required."));
        }
        try {
            String msg = authService.generateAndSendOtp(identifier);
            Map<String, Object> resp = new HashMap<>();
            resp.put("message", msg);
            resp.put("identifier", identifier);
            if (environment.matchesProfiles("dev", "test")) {
                resp.put("devOtp", authService.getDevOtp(identifier));
            }
            return ResponseEntity.ok(resp);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(429).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody DTOs.VerifyOtpRequest request) {
        if (request.getIdentifier() == null || request.getOtp() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Identifier and OTP are required."));
        }
        try {
            DTOs.AuthResponse response = authService.verifyOtp(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/otp/dev-preview")
    public ResponseEntity<?> getDevOtp(@RequestParam String identifier) {
        // Restricted to dev or test profiles only
        boolean isDevOrTest = environment.matchesProfiles("dev", "test");
        if (!isDevOrTest) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Dev OTP preview is disabled in production environments."));
        }
        String otp = authService.getDevOtp(identifier);
        if (otp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No active OTP found for this identifier or it has expired."));
        }
        return ResponseEntity.ok(Map.of("identifier", identifier, "otp", otp));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody DTOs.AdminLoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }
        try {
            DTOs.AuthResponse response = authService.adminLogin(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", ex.getMessage()));
    }
}

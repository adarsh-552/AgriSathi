package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
            return ResponseEntity.ok(Map.of("message", msg, "identifier", identifier));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(429).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody DTOs.VerifyOtpRequest request) {
        if (request.getIdentifier() == null || request.getOtp() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Identifier and OTP are required."));
        }
        DTOs.AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody DTOs.AdminLoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
        }
        DTOs.AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }
}

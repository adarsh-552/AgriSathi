package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.security.UserPrincipal;
import com.agrisathi.service.FarmerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;

    public FarmerProfileController(FarmerProfileService farmerProfileService) {
        this.farmerProfileService = farmerProfileService;
    }

    @GetMapping
    public ResponseEntity<DTOs.ProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        DTOs.ProfileResponse response = farmerProfileService.getProfile(principal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<DTOs.ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DTOs.ProfileUpdateRequest request) {
        DTOs.ProfileResponse response = farmerProfileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(response);
    }
}

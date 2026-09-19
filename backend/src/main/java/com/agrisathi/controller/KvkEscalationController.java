package com.agrisathi.controller;

import com.agrisathi.dto.DTOs.KvkEscalationRequest;
import com.agrisathi.dto.DTOs.KvkEscalationResponse;
import com.agrisathi.security.UserPrincipal;
import com.agrisathi.service.KvkEscalationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/escalations")
public class KvkEscalationController {

    private final KvkEscalationService escalationService;

    public KvkEscalationController(KvkEscalationService escalationService) {
        this.escalationService = escalationService;
    }

    @PostMapping
    public ResponseEntity<KvkEscalationResponse> createEscalation(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody KvkEscalationRequest request) {
        return ResponseEntity.ok(escalationService.createEscalation(principal.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<KvkEscalationResponse>> getMyEscalations(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(escalationService.getMyEscalations(principal.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<KvkEscalationResponse>> getAllEscalations() {
        return ResponseEntity.ok(escalationService.getAllEscalations());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KvkEscalationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String officerNotes = payload.get("officerNotes");
        return ResponseEntity.ok(escalationService.updateStatus(id, status, officerNotes));
    }
}

package com.agrisathi.controller;

import com.agrisathi.dto.DTOs.AlertResponse;
import com.agrisathi.security.UserPrincipal;
import com.agrisathi.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAlerts(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(alertService.getAlertsForUser(principal != null ? principal.getId() : null));
    }
}

package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.ProblemDiagnosis;
import com.agrisathi.service.SafetyGateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/problems")
public class DiagnosticController {

    private final SafetyGateService safetyGateService;

    public DiagnosticController(SafetyGateService safetyGateService) {
        this.safetyGateService = safetyGateService;
    }

    @PostMapping("/evaluate")
    public ResponseEntity<ProblemDiagnosis> evaluateSymptom(
            @RequestBody DTOs.ProblemReportRequest request,
            @RequestParam(required = false) Long cropId) {
        if (request.getFarmerCropId() == null && cropId != null) {
            request.setFarmerCropId(cropId);
        }
        ProblemDiagnosis diagnosis = safetyGateService.evaluateProblem(request);
        return ResponseEntity.ok(diagnosis);
    }
}

package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.Crop;
import com.agrisathi.entity.FarmerCrop;
import com.agrisathi.repository.CropRepository;
import com.agrisathi.security.UserPrincipal;
import com.agrisathi.service.CropJourneyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/crops")
public class FarmerCropController {

    private final CropJourneyService cropJourneyService;
    private final CropRepository cropRepository;

    public FarmerCropController(CropJourneyService cropJourneyService, CropRepository cropRepository) {
        this.cropJourneyService = cropJourneyService;
        this.cropRepository = cropRepository;
    }

    @GetMapping("/catalog")
    public ResponseEntity<List<Crop>> getCropCatalog() {
        return ResponseEntity.ok(cropRepository.findByActiveTrue());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(cropJourneyService.getDashboardData(principal.getId()));
    }

    @PostMapping("/farmer-crops")
    public ResponseEntity<FarmerCrop> createCrop(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DTOs.CropCreateRequest request) {
        FarmerCrop crop = cropJourneyService.createFarmerCrop(principal.getId(), request);
        return ResponseEntity.ok(crop);
    }

    @PostMapping("/{cropId}/milestone")
    public ResponseEntity<?> confirmMilestone(
            @PathVariable Long cropId,
            @RequestBody Map<String, String> payload) {
        String targetStageCode = payload.get("stageCode");
        cropJourneyService.confirmMilestone(cropId, targetStageCode);
        return ResponseEntity.ok(Map.of("message", "Milestone confirmed and stage recalculated."));
    }
}

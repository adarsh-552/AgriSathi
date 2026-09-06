package com.agrisathi.controller;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.CropEvent;
import com.agrisathi.service.CropMemoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/memory")
public class CropMemoryController {

    private final CropMemoryService cropMemoryService;

    public CropMemoryController(CropMemoryService cropMemoryService) {
        this.cropMemoryService = cropMemoryService;
    }

    @GetMapping("/{cropId}/timeline")
    public ResponseEntity<List<CropEvent>> getTimeline(@PathVariable Long cropId) {
        return ResponseEntity.ok(cropMemoryService.getPlotTimeline(cropId));
    }

    @PostMapping("/{cropId}/log")
    public ResponseEntity<CropEvent> logCustomEvent(
            @PathVariable Long cropId,
            @RequestBody DTOs.EventLogRequest request) {
        CropEvent event = cropMemoryService.logEvent(cropId, request, "FARMER");
        return ResponseEntity.ok(event);
    }
}

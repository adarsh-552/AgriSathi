package com.agrisathi.service;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.CropEvent;
import com.agrisathi.entity.FarmerCrop;
import com.agrisathi.repository.CropEventRepository;
import com.agrisathi.repository.FarmerCropRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CropMemoryService {

    private final CropEventRepository cropEventRepository;
    private final FarmerCropRepository farmerCropRepository;

    public CropMemoryService(CropEventRepository cropEventRepository, FarmerCropRepository farmerCropRepository) {
        this.cropEventRepository = cropEventRepository;
        this.farmerCropRepository = farmerCropRepository;
    }

    @Transactional
    public CropEvent logEvent(Long farmerCropId, DTOs.EventLogRequest request, String loggedBy) {
        FarmerCrop farmerCrop = farmerCropRepository.findById(farmerCropId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer crop plot not found: " + farmerCropId));

        int cropAgeDays = (int) ChronoUnit.DAYS.between(farmerCrop.getSowingDate(), LocalDate.now());
        if (cropAgeDays < 0) cropAgeDays = 0;

        CropEvent event = new CropEvent(
                farmerCrop,
                request.getEventType(),
                cropAgeDays,
                request.getTitle(),
                request.getNotes(),
                request.getPayloadJson(),
                loggedBy
        );

        return cropEventRepository.save(event);
    }

    public List<CropEvent> getPlotTimeline(Long farmerCropId) {
        return cropEventRepository.findByFarmerCropIdOrderByEventTimestampDesc(farmerCropId);
    }

    public PlotContext extractRecentContext(Long farmerCropId) {
        List<CropEvent> recentEvents = cropEventRepository.findByFarmerCropIdOrderByEventTimestampDesc(farmerCropId);

        boolean recentRain = false;
        boolean recentUrea = false;
        boolean recentSpray = false;
        String lastIntervention = "None recorded";

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        for (CropEvent event : recentEvents) {
            if (event.getEventTimestamp().isAfter(thirtyDaysAgo)) {
                if ("WEATHER_ALERT".equals(event.getEventType()) || (event.getNotes() != null && event.getNotes().toLowerCase().contains("rain"))) {
                    recentRain = true;
                }
                if ("FERTILIZER_APPLIED".equals(event.getEventType()) || (event.getNotes() != null && event.getNotes().toLowerCase().contains("urea"))) {
                    recentUrea = true;
                }
                if ("SPRAY_APPLIED".equals(event.getEventType())) {
                    recentSpray = true;
                }
            }
        }

        if (!recentEvents.isEmpty()) {
            lastIntervention = recentEvents.get(0).getTitle() + " (" + recentEvents.get(0).getEventTimestamp().toLocalDate() + ")";
        }

        return new PlotContext(recentRain, recentUrea, recentSpray, lastIntervention, recentEvents.size());
    }

    public static class PlotContext {
        public final boolean recentRainOrWaterlog;
        public final boolean recentUreaApplied;
        public final boolean recentChemicalSpray;
        public final String lastInterventionSummary;
        public final int totalHistoryEntries;

        public PlotContext(boolean recentRainOrWaterlog, boolean recentUreaApplied, boolean recentChemicalSpray, String lastInterventionSummary, int totalHistoryEntries) {
            this.recentRainOrWaterlog = recentRainOrWaterlog;
            this.recentUreaApplied = recentUreaApplied;
            this.recentChemicalSpray = recentChemicalSpray;
            this.lastInterventionSummary = lastInterventionSummary;
            this.totalHistoryEntries = totalHistoryEntries;
        }
    }
}

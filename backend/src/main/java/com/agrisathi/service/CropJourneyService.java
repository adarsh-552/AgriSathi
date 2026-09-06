package com.agrisathi.service;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.*;
import com.agrisathi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CropJourneyService {

    private final FarmerCropRepository farmerCropRepository;
    private final CropRepository cropRepository;
    private final CropStageRepository cropStageRepository;
    private final CropTaskRepository cropTaskRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final CropMemoryService cropMemoryService;

    public CropJourneyService(FarmerCropRepository farmerCropRepository, CropRepository cropRepository, CropStageRepository cropStageRepository, CropTaskRepository cropTaskRepository, FarmerProfileRepository farmerProfileRepository, CropMemoryService cropMemoryService) {
        this.farmerCropRepository = farmerCropRepository;
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
        this.cropTaskRepository = cropTaskRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.cropMemoryService = cropMemoryService;
    }

    @Transactional
    public FarmerCrop createFarmerCrop(Long userId, DTOs.CropCreateRequest request) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user: " + userId));

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new IllegalArgumentException("Crop not found: " + request.getCropId()));

        if (request.getState() != null) profile.setState(request.getState());
        if (request.getDistrict() != null) profile.setDistrict(request.getDistrict());
        if (request.getMandal() != null) profile.setMandal(request.getMandal());
        farmerProfileRepository.save(profile);

        List<CropStage> stages = cropStageRepository.findByCropIdOrderByStageSequenceAsc(crop.getId());
        CropStage initialStage = stages.isEmpty() ? null : stages.get(0);

        FarmerCrop farmerCrop = new FarmerCrop(
                profile,
                crop,
                request.getPlotIdentifier(),
                request.getSowingDate(),
                initialStage,
                request.getLandAreaAcres()
        );
        farmerCrop = farmerCropRepository.save(farmerCrop);

        // Recalculate appropriate stage based on days elapsed
        recalculateStage(farmerCrop);

        // Log sowing into Crop Memory
        DTOs.EventLogRequest log = new DTOs.EventLogRequest();
        log.setEventType("STAGE_TRANSITION");
        log.setTitle("Crop Sown: " + crop.getCommonNameEn());
        log.setNotes("Sowing completed on " + request.getSowingDate() + " at " + profile.getDistrict() + ", " + profile.getState());
        cropMemoryService.logEvent(farmerCrop.getId(), log, "FARMER");

        return farmerCrop;
    }

    public Map<String, Object> getDashboardData(Long userId) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found"));

        List<FarmerCrop> activeCrops = farmerCropRepository.findByFarmerProfileIdAndStatus(profile.getId(), "ACTIVE");
        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("farmerName", profile.getFullName() != null ? profile.getFullName() : "రైతు గారు");
        dashboard.put("preferredLanguage", profile.getPreferredLanguage());
        dashboard.put("state", profile.getState());
        dashboard.put("district", profile.getDistrict());
        dashboard.put("mandal", profile.getMandal());

        if (activeCrops.isEmpty()) {
            dashboard.put("hasActiveCrop", false);
            return dashboard;
        }

        FarmerCrop currentCrop = activeCrops.get(0);
        recalculateStage(currentCrop);

        int cropAgeDays = (int) ChronoUnit.DAYS.between(currentCrop.getSowingDate(), LocalDate.now());
        if (cropAgeDays < 0) cropAgeDays = 0;

        dashboard.put("hasActiveCrop", true);
        dashboard.put("farmerCropId", currentCrop.getId());
        dashboard.put("cropCode", currentCrop.getCrop().getCropCode());
        dashboard.put("cropNameEn", currentCrop.getCrop().getCommonNameEn());
        dashboard.put("cropNameTe", currentCrop.getCrop().getCommonNameTe());
        dashboard.put("cropNameHi", currentCrop.getCrop().getCommonNameHi());
        dashboard.put("plotIdentifier", currentCrop.getPlotIdentifier());
        dashboard.put("sowingDate", currentCrop.getSowingDate());
        dashboard.put("cropAgeDays", cropAgeDays);

        CropStage stage = currentCrop.getCurrentStage();
        if (stage != null) {
            dashboard.put("stageCode", stage.getStageCode());
            dashboard.put("stageSequence", stage.getStageSequence());
            dashboard.put("stageNameEn", stage.getStageNameEn());
            dashboard.put("stageNameTe", stage.getStageNameTe());
            dashboard.put("stageNameHi", stage.getStageNameHi());
            dashboard.put("inspectionPromptTe", stage.getInspectionPromptTe());
            dashboard.put("inspectionPromptEn", stage.getInspectionPromptEn());

            List<CropTask> tasks = cropTaskRepository.findByCropStageIdOrderByDayOffsetAsc(stage.getId());
            if (!tasks.isEmpty()) {
                CropTask todayTask = tasks.get(0);
                dashboard.put("todayTaskId", todayTask.getId());
                dashboard.put("todayTaskNameEn", todayTask.getTaskNameEn());
                dashboard.put("todayTaskNameTe", todayTask.getTaskNameTe());
                dashboard.put("todayTaskNameHi", todayTask.getTaskNameHi());
                dashboard.put("todayTaskDescTe", todayTask.getTaskDescTe());
                dashboard.put("todayTaskCategory", todayTask.getTaskCategory());
                dashboard.put("todayTaskRiskTier", todayTask.getRiskTier());
            }
        }

        dashboard.put("weatherSprayAlert", "Safe to Spray today (No rain next 48h)");
        dashboard.put("weatherTemp", "31°C");

        return dashboard;
    }

    @Transactional
    public void confirmMilestone(Long farmerCropId, String targetStageCode) {
        FarmerCrop crop = farmerCropRepository.findById(farmerCropId)
                .orElseThrow(() -> new IllegalArgumentException("Crop plot not found"));

        CropStage targetStage = cropStageRepository.findByCropIdAndStageCode(crop.getCrop().getId(), targetStageCode)
                .orElse(null);

        if (targetStage != null) {
            crop.setCurrentStage(targetStage);
            farmerCropRepository.save(crop);

            DTOs.EventLogRequest log = new DTOs.EventLogRequest();
            log.setEventType("STAGE_TRANSITION");
            log.setTitle("Transitioned to: " + targetStage.getStageNameEn());
            log.setNotes("Farmer confirmed visual biological milestone on field.");
            cropMemoryService.logEvent(crop.getId(), log, "FARMER");
        }
    }

    private void recalculateStage(FarmerCrop farmerCrop) {
        int days = (int) ChronoUnit.DAYS.between(farmerCrop.getSowingDate(), LocalDate.now());
        if (days < 0) days = 0;

        List<CropStage> stages = cropStageRepository.findByCropIdOrderByStageSequenceAsc(farmerCrop.getCrop().getId());
        for (CropStage s : stages) {
            if (days >= s.getStandardStartDay() && days <= s.getStandardEndDay()) {
                farmerCrop.setCurrentStage(s);
                farmerCropRepository.save(farmerCrop);
                break;
            }
        }
    }
}

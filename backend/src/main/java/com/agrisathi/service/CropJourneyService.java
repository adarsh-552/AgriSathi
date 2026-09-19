package com.agrisathi.service;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.*;
import com.agrisathi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class CropJourneyService {

    private final FarmerCropRepository farmerCropRepository;
    private final CropRepository cropRepository;
    private final CropStageRepository cropStageRepository;
    private final CropTaskRepository cropTaskRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final CropMemoryService cropMemoryService;

    public CropJourneyService(FarmerCropRepository farmerCropRepository,
                              CropRepository cropRepository,
                              CropStageRepository cropStageRepository,
                              CropTaskRepository cropTaskRepository,
                              FarmerProfileRepository farmerProfileRepository,
                              WeatherDataRepository weatherDataRepository,
                              CropMemoryService cropMemoryService) {
        this.farmerCropRepository = farmerCropRepository;
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
        this.cropTaskRepository = cropTaskRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.weatherDataRepository = weatherDataRepository;
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
                request.getPlotIdentifier() != null ? request.getPlotIdentifier() : "Plot 1",
                request.getSowingDate() != null ? request.getSowingDate() : LocalDate.now(),
                initialStage,
                request.getLandAreaAcres() != null ? request.getLandAreaAcres() : profile.getLandAreaAcres()
        );
        farmerCrop = farmerCropRepository.save(farmerCrop);

        // Recalculate appropriate stage based on days elapsed or GDD
        recalculateStage(farmerCrop);

        // Log sowing into Crop Memory
        DTOs.EventLogRequest log = new DTOs.EventLogRequest();
        log.setEventType("SOWING");
        log.setTitle("Crop Sown: " + crop.getCommonNameEn());
        log.setNotes("Sowing registered on " + request.getSowingDate() + " at " + profile.getDistrict() + ", " + profile.getState());
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
            dashboard.put("allCrops", Collections.emptyList());
            return dashboard;
        }

        FarmerCrop currentCrop = activeCrops.get(0);
        recalculateStage(currentCrop);

        int cropAgeDays = (int) ChronoUnit.DAYS.between(currentCrop.getSowingDate(), LocalDate.now());
        if (cropAgeDays < 0) cropAgeDays = 0;

        // GDD Engine Accumulation
        double accumulatedGdd = calculateAccumulatedGdd(currentCrop, profile.getDistrict(), cropAgeDays);

        dashboard.put("hasActiveCrop", true);
        dashboard.put("farmerCropId", currentCrop.getId());
        dashboard.put("cropCode", currentCrop.getCrop().getCropCode());
        dashboard.put("cropNameEn", currentCrop.getCrop().getCommonNameEn());
        dashboard.put("cropNameTe", currentCrop.getCrop().getCommonNameTe());
        dashboard.put("cropNameHi", currentCrop.getCrop().getCommonNameHi());
        dashboard.put("plotIdentifier", currentCrop.getPlotIdentifier());
        dashboard.put("sowingDate", currentCrop.getSowingDate().toString());
        dashboard.put("cropAgeDays", cropAgeDays);
        dashboard.put("accumulatedGdd", Math.round(accumulatedGdd));
        dashboard.put("landAreaAcres", currentCrop.getLandAreaAcres());

        // Stage details
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
            List<Map<String, Object>> taskList = new ArrayList<>();
            for (CropTask t : tasks) {
                Map<String, Object> tm = new HashMap<>();
                tm.put("id", t.getId());
                tm.put("taskNameEn", t.getTaskNameEn());
                tm.put("taskNameTe", t.getTaskNameTe());
                tm.put("taskNameHi", t.getTaskNameHi());
                tm.put("taskDescTe", t.getTaskDescTe());
                tm.put("taskCategory", t.getTaskCategory());
                tm.put("riskTier", t.getRiskTier());
                tm.put("dayOffset", t.getDayOffset());
                taskList.add(tm);
            }

            if (taskList.isEmpty()) {
                Map<String, Object> defaultTask = new HashMap<>();
                defaultTask.put("id", 0L);
                defaultTask.put("taskNameEn", stage.getStageNameEn() + " Field Scouting");
                defaultTask.put("taskNameTe", stage.getStageNameTe() + " పొలం పరిశీలన");
                defaultTask.put("taskNameHi", stage.getStageNameHi() + " खेत निरीक्षण");
                defaultTask.put("taskDescTe", stage.getInspectionPromptTe() != null ? stage.getInspectionPromptTe() : "పంట ఎదుగుదల మరియు నేల తేమను పరిశీలించండి.");
                defaultTask.put("taskCategory", "INSPECTION");
                defaultTask.put("riskTier", "LOW");
                defaultTask.put("dayOffset", 0);
                taskList.add(defaultTask);
            }

            dashboard.put("stageTasks", taskList);

            Map<String, Object> todayTask = taskList.get(0);
            dashboard.put("todayTaskId", todayTask.get("id"));
            dashboard.put("todayTaskNameEn", todayTask.get("taskNameEn"));
            dashboard.put("todayTaskNameTe", todayTask.get("taskNameTe"));
            dashboard.put("todayTaskNameHi", todayTask.get("taskNameHi"));
            dashboard.put("todayTaskDescTe", todayTask.get("taskDescTe"));
            dashboard.put("todayTaskCategory", todayTask.get("taskCategory"));
            dashboard.put("todayTaskRiskTier", todayTask.get("riskTier"));
        }

        // All Stages for Journey Stepper
        List<CropStage> allStages = cropStageRepository.findByCropIdOrderByStageSequenceAsc(currentCrop.getCrop().getId());
        List<Map<String, Object>> stageList = new ArrayList<>();
        for (CropStage s : allStages) {
            Map<String, Object> sm = new HashMap<>();
            sm.put("id", s.getId());
            sm.put("stageCode", s.getStageCode());
            sm.put("stageSequence", s.getStageSequence());
            sm.put("stageNameEn", s.getStageNameEn());
            sm.put("stageNameTe", s.getStageNameTe());
            sm.put("stageNameHi", s.getStageNameHi());
            sm.put("standardStartDay", s.getStandardStartDay());
            sm.put("standardEndDay", s.getStandardEndDay());
            sm.put("gddThreshold", s.getGddThreshold());
            sm.put("isCurrent", stage != null && stage.getId().equals(s.getId()));
            sm.put("isCompleted", stage != null && stage.getStageSequence() > s.getStageSequence());
            stageList.add(sm);
        }
        dashboard.put("allStages", stageList);

        // All Active Crops list for switcher
        List<Map<String, Object>> cropsList = new ArrayList<>();
        for (FarmerCrop fc : activeCrops) {
            Map<String, Object> cm = new HashMap<>();
            cm.put("id", fc.getId());
            cm.put("cropNameTe", fc.getCrop().getCommonNameTe());
            cm.put("cropNameEn", fc.getCrop().getCommonNameEn());
            cm.put("plotIdentifier", fc.getPlotIdentifier());
            cm.put("sowingDate", fc.getSowingDate().toString());
            cropsList.add(cm);
        }
        dashboard.put("allCrops", cropsList);

        // Weather Spray Alert summary
        String district = profile.getDistrict() != null ? profile.getDistrict() : "Kurnool";
        List<WeatherData> weather = weatherDataRepository.findByDistrictOrderByForecastDateAsc(district);
        if (!weather.isEmpty()) {
            WeatherData w = weather.get(0);
            if (w.getRainProbability() >= 40 || !w.isSafeToSpray()) {
                dashboard.put("weatherSprayAlert", "వర్ష సూచన ఉంది (" + w.getRainProbability() + "%). పిచికారీ వాయిదా వేయండి.");
            } else if (w.getWindSpeedKmh() > 15.0) {
                dashboard.put("weatherSprayAlert", "అధిక గాలి వేగం (" + Math.round(w.getWindSpeedKmh()) + " km/h). పిచికారీ నిలవదు.");
            } else {
                dashboard.put("weatherSprayAlert", "ఈ రోజు పిచికారీకి అనుకూలమైన సమయం (స్పష్టమైన ఆకాశం).");
            }
            dashboard.put("weatherTemp", Math.round(w.getTempMax()) + "°C");
        } else {
            dashboard.put("weatherSprayAlert", "ఈ రోజు పిచికారీకి అనుకూలమైన సమయం.");
            dashboard.put("weatherTemp", "31°C");
        }

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

    private double calculateAccumulatedGdd(FarmerCrop crop, String district, int cropAgeDays) {
        double baseTemp = 10.0;
        String cropCode = crop.getCrop().getCropCode();
        if ("COTTON".equalsIgnoreCase(cropCode)) {
            baseTemp = 15.5;
        } else if ("MAIZE".equalsIgnoreCase(cropCode) || "CHILLI".equalsIgnoreCase(cropCode) || "PADDY".equalsIgnoreCase(cropCode)) {
            baseTemp = 10.0;
        }

        // Get temperature samples from weather repo for district
        List<WeatherData> weather = weatherDataRepository.findByDistrictOrderByForecastDateAsc(district != null ? district : "Kurnool");
        double avgMax = 32.0;
        double avgMin = 22.0;
        if (!weather.isEmpty()) {
            avgMax = weather.stream().mapToDouble(WeatherData::getTempMax).average().orElse(32.0);
            avgMin = weather.stream().mapToDouble(WeatherData::getTempMin).average().orElse(22.0);
        }

        double dailyMean = (avgMax + avgMin) / 2.0;
        double dailyGdd = Math.max(0.0, dailyMean - baseTemp);

        return dailyGdd * Math.min(cropAgeDays, 180);
    }
}

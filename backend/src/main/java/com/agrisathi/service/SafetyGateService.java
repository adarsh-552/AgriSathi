package com.agrisathi.service;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.CropProblem;
import com.agrisathi.entity.FarmerCrop;
import com.agrisathi.entity.ProblemDiagnosis;
import com.agrisathi.repository.CropProblemRepository;
import com.agrisathi.repository.FarmerCropRepository;
import com.agrisathi.repository.ProblemDiagnosisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SafetyGateService {

    private final CropProblemRepository cropProblemRepository;
    private final ProblemDiagnosisRepository problemDiagnosisRepository;
    private final FarmerCropRepository farmerCropRepository;
    private final CropMemoryService cropMemoryService;

    public SafetyGateService(CropProblemRepository cropProblemRepository, ProblemDiagnosisRepository problemDiagnosisRepository, FarmerCropRepository farmerCropRepository, CropMemoryService cropMemoryService) {
        this.cropProblemRepository = cropProblemRepository;
        this.problemDiagnosisRepository = problemDiagnosisRepository;
        this.farmerCropRepository = farmerCropRepository;
        this.cropMemoryService = cropMemoryService;
    }

    @Transactional
    public ProblemDiagnosis evaluateProblem(DTOs.ProblemReportRequest request) {
        FarmerCrop farmerCrop = farmerCropRepository.findById(request.getFarmerCropId())
                .orElseThrow(() -> new IllegalArgumentException("Farmer crop not found: " + request.getFarmerCropId()));

        // 1. Record the problem ticket
        CropProblem problem = new CropProblem(
                farmerCrop,
                request.getSymptomCategory(),
                request.getAffectedPart(),
                request.getDescription(),
                null
        );
        problem = cropProblemRepository.save(problem);

        // 2. Query Crop Memory for past 30 days
        CropMemoryService.PlotContext context = cropMemoryService.extractRecentContext(farmerCrop.getId());

        // 3. Deterministic Safety Gate Evaluation
        ProblemDiagnosis diagnosis = new ProblemDiagnosis();
        diagnosis.setCropProblem(problem);

        String category = request.getSymptomCategory();
        String loc = request.getSymptomLocation() != null ? request.getSymptomLocation() : "LOWER_OLD_LEAVES";
        boolean waterlogged = Boolean.TRUE.equals(request.getSoilWaterlogged()) || context.recentRainOrWaterlog;

        if ("YELLOW_LEAVES".equalsIgnoreCase(category) || "LEAF_YELLOWING".equalsIgnoreCase(category)) {
            if ("LOWER_OLD_LEAVES".equalsIgnoreCase(loc) && waterlogged) {
                // Scenario A: Yellowing on lower leaves + waterlogging/rain -> Nitrogen leaching from excess water
                diagnosis.setSuspectedCauseEn("Nitrogen Leaching due to Soil Waterlogging");
                diagnosis.setSuspectedCauseTe("భారీ వర్షం లేదా నీటి నిల్వ కారణంగా నత్రజని లోపం (లీచింగ్)");
                diagnosis.setSuspectedCauseHi("अधिक पानी भराव के कारण नाइट्रोजन लीचिंग (कमी)");
                diagnosis.setConfidenceLevel("HIGH");
                diagnosis.setDifferentialEvidence("Crop Memory indicates recent rainfall / soil waterlogging. Symptoms located specifically on lower older leaves.");

                diagnosis.setSafeImmediateStepsTe("1. వెంటనే పొలం నుండి నిల్వ ఉన్న నీటిని బయటకు తీయండి (కాలువలు తీసి వేయండి).\n2. నేల ఆరిన తర్వాత మాత్రమే 1% యూరియా లేదా 19-19-19 ద్రావణాన్ని పిచికారీ చేయండి.");
                diagnosis.setSafeImmediateStepsHi("1. तुरंत खेत से जमा हुआ अतिरिक्त पानी बाहर निकालें।\n2. मिट्टी सूखने के बाद ही 1% यूरिया या 19-19-19 का हल्का छिड़काव करें।");
                diagnosis.setSafeImmediateStepsEn("1. Immediately drain standing water from the field.\n2. Allow soil aeration; apply light foliar spray of 1% Urea or 19-19-19 only after field dries.");

                diagnosis.setWhatNotToDoTe("రసాయన పురుగుమందులు అస్సలు పిచికారీ చేయవద్దు. తడి నేలలో యూరియా వేయవద్దు (నీటితో కొట్టుకుపోతుంది).");
                diagnosis.setWhatNotToDoHi("कीटनाशक का छिड़काव बिल्कुल न करें। गीली मिट्टी में यूरिया न डालें।");
                diagnosis.setWhatNotToDoEn("Do NOT spray any chemical pesticides. Do NOT apply granular urea into waterlogged soil.");

                diagnosis.setChemicalRecommended(false);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);

            } else if ("UPPER_NEW_LEAVES".equalsIgnoreCase(loc)) {
                // Scenario B: Micronutrient deficiency (Iron / Zinc)
                diagnosis.setSuspectedCauseEn("Micronutrient (Zinc / Iron) Deficiency");
                diagnosis.setSuspectedCauseTe("సూక్ష్మ పోషకాల (జింక్ లేదా ఐరన్) లోపం");
                diagnosis.setSuspectedCauseHi("सूक्ष्म पोषक तत्वों (जिंक/आयरन) की कमी");
                diagnosis.setConfidenceLevel("MODERATE");
                diagnosis.setDifferentialEvidence("Yellowing isolated to upper young leaf canopy without insect presence.");

                diagnosis.setSafeImmediateStepsTe("జింక్ సల్ఫేట్ 2 గ్రాములు లేదా ఫెర్రస్ సల్ఫేట్ 5 గ్రాములు లీటరు నీటిలో కలిపి పిచికారీ చేయండి.");
                diagnosis.setSafeImmediateStepsHi("जिंक सल्फेट (2 ग्राम) या फेरस सल्फेट (5 ग्राम) प्रति लीटर पानी में मिलाकर छिड़कें।");
                diagnosis.setSafeImmediateStepsEn("Foliar spray of Zinc Sulphate (2g/L) or Ferrous Sulphate (5g/L).");

                diagnosis.setWhatNotToDoTe("భారీ రసాయన కీటకనాశనులు వాడకండి.");
                diagnosis.setWhatNotToDoHi("तेज रासायनिक कीटनाशकों का प्रयोग न करें।");
                diagnosis.setWhatNotToDoEn("Do NOT use heavy chemical insecticides.");

                diagnosis.setChemicalRecommended(false);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);

            } else {
                // Potential Whitefly virus vector or complex blight -> IPM First
                diagnosis.setSuspectedCauseEn("Sucking Pest (Whitefly / Jassids) Infestation");
                diagnosis.setSuspectedCauseTe("రసం పీల్చే పురుగులు (తెల్లదోమ / పచ్చదోమ) వ్యాప్తి");
                diagnosis.setSuspectedCauseHi("रस चूसक कीट (सफेद मक्खी) का प्रकोप");
                diagnosis.setConfidenceLevel("MODERATE");
                diagnosis.setDifferentialEvidence("Leaf yellowing with leaf curling observed.");

                diagnosis.setSafeImmediateStepsTe("1. ఎకరాకు 10-15 పసుపు జిగురు అట్టలు (Yellow sticky traps) ఏర్పాటు చేయండి.\n2. 5% వేప గింజల కషాయం (NSKE) లేదా వేప నూనె (1500 ppm) 5 మి.లీ లీటరు నీటికి పిచికారీ చేయండి.");
                diagnosis.setSafeImmediateStepsHi("1. प्रति एकड़ 10-15 पीले चिपचिपे जाल (Yellow Sticky Traps) लगाएं।\n2. 5% नीम अर्क या नीम का तेल (5 मिली प्रति लीटर) का छिड़काव करें।");
                diagnosis.setSafeImmediateStepsEn("1. Install 10-15 Yellow Sticky Traps per acre.\n2. Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 1500ppm at 5ml/L.");

                diagnosis.setWhatNotToDoTe("మిత్ర పురుగులను (లేడీబర్డ్ బీటిల్స్) నాశనం చేసే సింథటిక్ పైరెథ్రాయిడ్స్ వాడకండి.");
                diagnosis.setWhatNotToDoHi("मित्र कीटों को मारने वाले कीटनाशकों का अंधाधुंध उपयोग न करें।");
                diagnosis.setWhatNotToDoEn("Do NOT spray broad-spectrum synthetic pyrethroids which kill beneficial predator bugs.");

                diagnosis.setChemicalRecommended(false);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);
            }
        } else {
            // General / Ambiguous problem -> Escalate to local KVK Scientist
            diagnosis.setSuspectedCauseEn("Uncertain Agro-Symptom (Requires Expert Visual Inspection)");
            diagnosis.setSuspectedCauseTe("స్పష్టత లేని లక్షణం (వ్యవసాయ నిపుణుడి పరిశీలన అవసరం)");
            diagnosis.setSuspectedCauseHi("अस्पष्ट लक्षण (कृषि वैज्ञानिक द्वारा निरीक्षण आवश्यक)");
            diagnosis.setConfidenceLevel("LOW");
            diagnosis.setDifferentialEvidence("Insufficient symptom patterns to provide safe algorithmic diagnosis.");

            diagnosis.setSafeImmediateStepsTe("దగ్గరలోని కృషి విజ్ఞాన కేంద్రం (KVK) శాస్త్రవేత్తను లేదా వ్యవసాయ అధికారిని సంప్రదించండి.");
            diagnosis.setSafeImmediateStepsHi("नजदीकी कृषि विज्ञान केंद्र (KVK) के वैज्ञानिक या कृषि अधिकारी से परामर्श लें।");
            diagnosis.setSafeImmediateStepsEn("Consult your nearest Krishi Vigyan Kendra (KVK) agricultural scientist.");

            diagnosis.setWhatNotToDoTe("ధృవీకరించని రసాయన మందులను షాపుల సలహాతో పిచికారీ చేయవద్దు.");
            diagnosis.setWhatNotToDoHi("बिना जांचे कीटनाशकों का छिड़काव न करें।");
            diagnosis.setWhatNotToDoEn("Do NOT spray unverified chemical cocktails from local dealers.");

            diagnosis.setChemicalRecommended(false);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(true); // Automatically flag for KVK assistance!
        }

        // 4. Log diagnosis into Crop Memory ledger
        DTOs.EventLogRequest eventLog = new DTOs.EventLogRequest();
        eventLog.setEventType("SYMPTOM_REPORTED");
        eventLog.setTitle("Reported: " + category + " -> " + diagnosis.getSuspectedCauseEn());
        eventLog.setNotes("Diagnosis confidence: " + diagnosis.getConfidenceLevel() + "; Safe advice: " + diagnosis.getSafeImmediateStepsEn());
        cropMemoryService.logEvent(farmerCrop.getId(), eventLog, "SYSTEM");

        return problemDiagnosisRepository.save(diagnosis);
    }
}

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

    public SafetyGateService(CropProblemRepository cropProblemRepository,
                             ProblemDiagnosisRepository problemDiagnosisRepository,
                             FarmerCropRepository farmerCropRepository,
                             CropMemoryService cropMemoryService) {
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

        String category = request.getSymptomCategory() != null ? request.getSymptomCategory().toUpperCase() : "GENERAL";
        String loc = request.getSymptomLocation() != null ? request.getSymptomLocation().toUpperCase() : "LOWER_OLD_LEAVES";
        boolean waterlogged = Boolean.TRUE.equals(request.getSoilWaterlogged()) || context.recentRainOrWaterlog;

        // ==========================================
        // CATEGORY 1: LEAF YELLOWING / CHLOROSIS
        // ==========================================
        if (category.contains("YELLOW") || category.contains("CHLOROSIS")) {
            if ("LOWER_OLD_LEAVES".equalsIgnoreCase(loc) && waterlogged) {
                // Nitrogen leaching from excess water / soil waterlogging
                diagnosis.setSuspectedCauseEn("Nitrogen Leaching due to Soil Waterlogging");
                diagnosis.setSuspectedCauseTe("భారీ వర్షం లేదా నీటి నిల్వ కారణంగా నత్రజని లోపం (లీచింగ్)");
                diagnosis.setSuspectedCauseHi("अधिक पानी भराव के कारण नाइट्रोजन लीचिंग (कमी)");
                diagnosis.setConfidenceLevel("HIGH");
                diagnosis.setDifferentialEvidence("Crop Memory indicates recent rainfall / soil waterlogging. Yellowing isolated to lower older leaves.");

                diagnosis.setSafeImmediateStepsTe("1. వెంటనే పొలం నుండి నిల్వ ఉన్న నీటిని బయటకు తీయండి (కాలువలు తీసి వేయండి).\n2. నేల ఆరిన తర్వాత మాత్రమే 1% యూరియా లేదా 19-19-19 (10 గ్రా/లీ) పిచికారీ చేయండి.");
                diagnosis.setSafeImmediateStepsHi("1. तुरंत खेत से जमा हुआ अतिरिक्त पानी बाहर निकालें।\n2. मिट्टी सूखने के बाद ही 1% यूरिया या 19-19-19 का हल्का पर्णीय छिड़काव करें।");
                diagnosis.setSafeImmediateStepsEn("1. Immediately drain standing water from the field.\n2. Allow soil aeration; apply light foliar spray of 1% Urea or 19-19-19 (10g/L) only after field dries.");

                diagnosis.setWhatNotToDoTe("రసాయన పురుగుమందులు అస్సలు పిచికారీ చేయవద్దు. తడి నేలలో యూరియా వేయవద్దు (నీటితో కొట్టుకుపోతుంది).");
                diagnosis.setWhatNotToDoHi("कीटनाशक का छिड़काव बिल्कुल न करें। गीली मिट्टी में यूरिया न डालें।");
                diagnosis.setWhatNotToDoEn("Do NOT spray chemical insecticides. Do NOT apply granular urea into waterlogged soil.");

                diagnosis.setChemicalRecommended(false);
                diagnosis.setToxicityBand("GREEN");
                diagnosis.setPreHarvestIntervalDays(0);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);

            } else if ("UPPER_NEW_LEAVES".equalsIgnoreCase(loc)) {
                // Micronutrient deficiency (Iron / Zinc)
                diagnosis.setSuspectedCauseEn("Micronutrient (Iron / Zinc) Deficiency");
                diagnosis.setSuspectedCauseTe("సూక్ష్మ పోషకాల (ఇనుము / జింక్) లోపం");
                diagnosis.setSuspectedCauseHi("सूक्ष्म पोषक तत्वों (आयरन/जिंक) की कमी");
                diagnosis.setConfidenceLevel("MODERATE");
                diagnosis.setDifferentialEvidence("Yellowing isolated to upper young leaf canopy without sucking pest presence.");

                diagnosis.setSafeImmediateStepsTe("1. లీటరు నీటికి ఫెర్రస్ సల్ఫేట్ 5 గ్రా + నిమ్మ ఉప్పు 1 గ్రా లేదా జింక్ సల్ఫేట్ 2 గ్రా కలిపి పిచికారీ చేయండి.\n2. నేలలో సేంద్రీయ ఎరువులు (FYM) వాడకాన్ని పెంచండి.");
                diagnosis.setSafeImmediateStepsHi("1. प्रति लीटर पानी में फेरस सल्फेट (5 ग्राम) या जिंक सल्फेट (2 ग्राम) मिलाकर छिड़कें।\n2. खेत में गोबर की खाद का उपयोग बढ़ाएं।");
                diagnosis.setSafeImmediateStepsEn("1. Foliar spray of Ferrous Sulphate (5g/L) with Citric Acid (1g/L) or Zinc Sulphate (2g/L).\n2. Enhance soil organic matter with well-rotted FYM.");

                diagnosis.setWhatNotToDoTe("పురుగుల మందులు లేదా రసాయన కాక్‌టెయిల్‌లను పిచికారీ చేయవద్దు.");
                diagnosis.setWhatNotToDoHi("रासायनिक कीटनाशकों का अनावश्यक छिड़काव न करें।");
                diagnosis.setWhatNotToDoEn("Do NOT spray unneeded insecticides for nutritional chlorosis.");

                diagnosis.setChemicalRecommended(false);
                diagnosis.setToxicityBand("GREEN");
                diagnosis.setPreHarvestIntervalDays(0);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);

            } else {
                // Sucking pest or gemini mosaic vector
                diagnosis.setSuspectedCauseEn("Sucking Pest (Whitefly / Jassid) Induced Chlorosis");
                diagnosis.setSuspectedCauseTe("రసం పీల్చే పురుగులు (తెల్లదోమ / పచ్చదోమ) వలన ఆకులు పసుపు రంగుకు మారడం");
                diagnosis.setSuspectedCauseHi("रस चूसक कीट (सफेद मक्खी) द्वारा पत्तियों का पीला पड़ना");
                diagnosis.setConfidenceLevel("HIGH");
                diagnosis.setDifferentialEvidence("Leaf curling and mosaic yellow patches observed on leaves.");

                diagnosis.setSafeImmediateStepsTe("1. ఎకరాకు 10-15 పసుపు మరియు నీలి జిగురు అట్టలు అమర్చండి.\n2. వేప నూనె (1500 ppm) 5 మి.లీ లీటరు నీటికి కలిపి ఆకుల అడుగుభాగం తడిసేలా పిచికారీ చేయండి.");
                diagnosis.setSafeImmediateStepsHi("1. प्रति एकड़ 10-15 पीले चिपचिपे जाल लगाएं।\n2. 1500 पीपीएम नीम तेल (5 मिली प्रति लीटर) का छिड़काव करें।");
                diagnosis.setSafeImmediateStepsEn("1. Install 10-15 Yellow and Blue Sticky Traps per acre.\n2. Spray Neem Oil 1500 ppm @ 5ml/L targeting lower surface of leaves.");

                diagnosis.setWhatNotToDoTe("మిత్ర పురుగులను (లేడీబర్డ్ బీటిల్స్) చంపే తీవ్ర సింథటిక్ పైరెథ్రాయిడ్స్ వాడకండి.");
                diagnosis.setWhatNotToDoHi("सिंथेटिक पाइरेथ्रोइड्स जैसे तेज रसायनों का प्रयोग न करें।");
                diagnosis.setWhatNotToDoEn("Do NOT use synthetic pyrethroids which cause resurgence of sucking pests.");

                diagnosis.setChemicalRecommended(true);
                diagnosis.setChemicalActiveIngredient("Flonicamid 50 WG @ 0.3g/L (Only if pest population exceeds ETL 10 insects/leaf)");
                diagnosis.setToxicityBand("BLUE");
                diagnosis.setPreHarvestIntervalDays(15);
                diagnosis.setSafetyGatePassed(true);
                diagnosis.setEscalatedKvk(false);
            }

        // ==========================================
        // CATEGORY 2: SUCKING PESTS (Aphids, Jassids, Thrips)
        // ==========================================
        } else if (category.contains("SUCKING") || category.contains("CURL") || category.contains("THRIPS") || category.contains("APHID")) {
            diagnosis.setSuspectedCauseEn("Sucking Pest Complex (Thrips / Aphids / Jassids)");
            diagnosis.setSuspectedCauseTe("రసం పీల్చే పురుగుల ఉధృతి (తామర పురుగులు, పేనుబంక, పచ్చదోమ)");
            diagnosis.setSuspectedCauseHi("रस चूसक कीट प्रकोप (थ्रिप्स, एफिड्स, जैसिड्स)");
            diagnosis.setConfidenceLevel("HIGH");
            diagnosis.setDifferentialEvidence("Upward leaf curl, silvery patches on underside, honeydew excretion observed.");

            diagnosis.setSafeImmediateStepsTe("1. ఎకరాకు 20 నీలి జిగురు అట్టలు (తామర పురుగులకు) మరియు పసుపు అట్టలు ఏర్పాటు చేయండి.\n2. 5% వేప గింజల కషాయం (NSKE) లేదా లేసీవింగ్ బగ్స్ మిత్ర పురుగులను రక్షించండి.");
            diagnosis.setSafeImmediateStepsHi("1. प्रति एकड़ 20 नीले और पीले चिपचिपे जाल लगाएं।\n2. 5% नीम बीज अर्क (NSKE) का छिड़काव करें और मित्र कीटों का संरक्षण करें।");
            diagnosis.setSafeImmediateStepsEn("1. Erect 20 Blue sticky traps (for thrips) and Yellow sticky traps per acre.\n2. Spray 5% NSKE (Neem Seed Kernel Extract) and conserve predator chrysoperla bugs.");

            diagnosis.setWhatNotToDoTe("రసాయనాల మిశ్రమాన్ని (Cocktail sprays) లేదా సిఫార్సు చేయని ఎరువుల పిచికారీని నిలిపివేయండి.");
            diagnosis.setWhatNotToDoHi("दुकानदारों के कहने पर रसायनों का मिश्रण (कॉकटेल) न छिड़कें।");
            diagnosis.setWhatNotToDoEn("Do NOT spray unverified tank mixes or non-recommended chemical combinations.");

            diagnosis.setChemicalRecommended(true);
            diagnosis.setChemicalActiveIngredient("Acetamiprid 20% SP @ 0.2g/L or Diafenthiuron 50% WP @ 1.25g/L (Only after ETL confirmation)");
            diagnosis.setToxicityBand("BLUE");
            diagnosis.setPreHarvestIntervalDays(14);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(false);

        // ==========================================
        // CATEGORY 3: WILTING & ROOT ROT
        // ==========================================
        } else if (category.contains("WILT") || category.contains("ROOT_ROT") || category.contains("DROOP")) {
            diagnosis.setSuspectedCauseEn("Vascular Wilting / Root Rot (Fusarium / Rhizoctonia)");
            diagnosis.setSuspectedCauseTe("వేరుకుళ్లు / వడలు తెగులు (ఫ్యుసేరియం లేదా రైజోక్టోనియా శిలీంధ్రం)");
            diagnosis.setSuspectedCauseHi("उकठा / जड़ गलन रोग (फ्युजेरियम या राइजोक्टोनिया फंगस)");
            diagnosis.setConfidenceLevel("HIGH");
            diagnosis.setDifferentialEvidence("Drooping foliage despite moist soil, vascular browning at crown level.");

            diagnosis.setSafeImmediateStepsTe("1. పొలంలో నీటి నిల్వ లేకుండా అదనపు నీటిని వెంటనే బయటకు మళ్లించండి.\n2. ట్రైకోడెర్మా విరిడే (Trichoderma viride) జీవ శిలీంద్రనాశిని 10 గ్రాములు లీటరు నీటికి కలిపి మొదళ్ళ వద్ద పోయండి (Drenching).");
            diagnosis.setSafeImmediateStepsHi("1. खेत से जल निकासी सुनिश्चित करें।\n2. ट्राइकोडर्मा विरिडी (10 ग्राम/लीटर) से पौधों की जड़ों के पास ड्रेंचिंग करें।");
            diagnosis.setSafeImmediateStepsEn("1. Immediately provide deep drainage channels to prevent root suffocation.\n2. Soil drenching around base with bio-fungicide Trichoderma viride or Pseudomonas fluorescens @ 10g/L.");

            diagnosis.setWhatNotToDoTe("పైరుపై ఆకులపై రసాయన మందులు పిచికారీ చేయవద్దు (ఈ తెగులు నేలలోని వేర్లలో ఉంటుంది). పొలానికి అధిక నీరు పెట్టవద్దు.");
            diagnosis.setWhatNotToDoHi("पत्तियों पर फफूंदनाशक का छिड़काव न करें (रोग जड़ में होता है)। खेत में अधिक पानी न लगाएं।");
            diagnosis.setWhatNotToDoEn("Do NOT spray foliar fungicides (pathogen is soil-borne in root vascular bundle). Avoid flood irrigation.");

            diagnosis.setChemicalRecommended(true);
            diagnosis.setChemicalActiveIngredient("Copper Oxychloride 50% WP @ 3g/L drenching around plant base (if bio-control unavailable)");
            diagnosis.setToxicityBand("BLUE");
            diagnosis.setPreHarvestIntervalDays(15);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(true); // Flag for KVK inspection

        // ==========================================
        // CATEGORY 4: BOLL DAMAGE / FRUIT BORER
        // ==========================================
        } else if (category.contains("BOLL") || category.contains("BORER") || category.contains("FRUIT") || category.contains("CATERPILLAR")) {
            diagnosis.setSuspectedCauseEn("Bollworm / Fruit Borer Attack (Helicoverpa / Pink Bollworm)");
            diagnosis.setSuspectedCauseTe("కాయ తొలుచు పురుగు / గులాబీ రంగు పురుగు (Pink Bollworm) ఉధృతి");
            diagnosis.setSuspectedCauseHi("फल छेदक / गुलाबी सुंडी (पिंक बॉलवॉर्म) का आक्रमण");
            diagnosis.setConfidenceLevel("HIGH");
            diagnosis.setDifferentialEvidence("Rosette flowers, boreholes plugged with frass, premature boll drop detected.");

            diagnosis.setSafeImmediateStepsTe("1. ఎకరాకు 8 లింగాకర్షక బుట్టలు (Pheromone traps) అమర్చి పురుగుల సంఖ్యను లెక్కించండి.\n2. ఎకరాకు 20 పక్షి స్థావరాలు (Bird perches) ఏర్పాటు చేయండి.\n3. విత్తిన 45-50 రోజులకు ట్రైకోగ్రామా పరాన్నజీవి గుడ్ల కార్డులను పొలంలో ఉంచండి.");
            diagnosis.setSafeImmediateStepsHi("1. प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं और निगरानी करें।\n2. प्रति एकड़ 20 पक्षी बसेरे (बर्ड पर्च) लगाएं।\n3. ट्राइकोग्रामा परजीवी के अंडे के कार्ड लगाएं।");
            diagnosis.setSafeImmediateStepsEn("1. Install 8 Pheromone Traps per acre with species-specific lures.\n2. Erect 15-20 Bird Perches per acre to encourage insectivorous birds.\n3. Release Trichogramma egg parasitoid cards @ 60,000/acre.");

            diagnosis.setWhatNotToDoTe("పురుగుల సంఖ్య తెలియకుండా విచక్షణారహితంగా ప్రమాదకరమైన ఎరుపు/పసుపు బ్యాండ్ మందులు వాడవద్దు.");
            diagnosis.setWhatNotToDoHi("बिना आवश्यकता के अत्यधिक विषैले लाल या पीले त्रिकोण वाले कीटनाशक न डालें।");
            diagnosis.setWhatNotToDoEn("Do NOT use heavy organophosphates or banned hazardous chemicals without monitoring trap counts.");

            diagnosis.setChemicalRecommended(true);
            diagnosis.setChemicalActiveIngredient("Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.3ml/L (Strictly after ETL)");
            diagnosis.setToxicityBand("GREEN");
            diagnosis.setPreHarvestIntervalDays(14);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(false);

        // ==========================================
        // CATEGORY 5: LEAF SPOT / FUNGAL BLIGHT
        // ==========================================
        } else if (category.contains("SPOT") || category.contains("BLIGHT") || category.contains("FUNGAL")) {
            diagnosis.setSuspectedCauseEn("Fungal Leaf Spot / Alternaria Blight");
            diagnosis.setSuspectedCauseTe("ఆల్టర్నేరియా ఆకుమచ్చ లేదా బూడిద తెగులు (Fungal Blight)");
            diagnosis.setSuspectedCauseHi("पत्ती धब्बा / अल्टरनेरिया झुलसा रोग");
            diagnosis.setConfidenceLevel("HIGH");
            diagnosis.setDifferentialEvidence("Circular necrotic lesions with concentric rings on leaf lamina.");

            diagnosis.setSafeImmediateStepsTe("1. తెగులు సోకి రాలిన ఆకులను ఏరివేసి నాశనం చేయండి.\n2. సూడోమోనాస్ ఫ్లోరోసెన్స్ (5 గ్రా/లీ) పిచికారీ చేసి పంటకు బలాన్నివ్వండి.");
            diagnosis.setSafeImmediateStepsHi("1. संक्रमित पत्तियों को इकट्ठा करके नष्ट करें।\n2. स्यूडोमोनास फ्लोरोसेंस (5 ग्राम/लीटर) का छिड़काव करें।");
            diagnosis.setSafeImmediateStepsEn("1. Collect and destroy heavily infected lower foliage.\n2. Spray biocontrol agent Pseudomonas fluorescens @ 5g/L.");

            diagnosis.setWhatNotToDoTe("వర్షం పడే అవకాశం ఉన్నప్పుడు లేదా అధిక ఎండ వేళల్లో పిచికారీ చేయవద్దు.");
            diagnosis.setWhatNotToDoHi("बारिश की संभावना या तेज धूप में छिड़काव न करें।");
            diagnosis.setWhatNotToDoEn("Do NOT spray during rainfall or peak noon heat.");

            diagnosis.setChemicalRecommended(true);
            diagnosis.setChemicalActiveIngredient("Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L");
            diagnosis.setToxicityBand("BLUE");
            diagnosis.setPreHarvestIntervalDays(15);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(false);

        // ==========================================
        // FALLBACK: AMBIGUOUS OR COMPLEX SYMPTOM -> ESCALATE TO KVK
        // ==========================================
        } else {
            diagnosis.setSuspectedCauseEn("Uncertain Agro-Symptom (Requires Expert Visual Inspection)");
            diagnosis.setSuspectedCauseTe("స్పష్టత లేని లక్షణం (వ్యవసాయ శాస్త్రవేత్త పరిశీలన అవసరం)");
            diagnosis.setSuspectedCauseHi("अस्पष्ट लक्षण (कृषि वैज्ञानिक द्वारा निरीक्षण आवश्यक)");
            diagnosis.setConfidenceLevel("LOW");
            diagnosis.setDifferentialEvidence("Symptom patterns do not match standard single-pathogen profiles safely.");

            diagnosis.setSafeImmediateStepsTe("దగ్గరలోని కృషి విజ్ఞాన కేంద్రం (KVK) శాస్త్రవేత్తను లేదా గ్రామ వ్యవసాయ సహాయకుడిని సంప్రదించండి.");
            diagnosis.setSafeImmediateStepsHi("नजदीकी कृषि विज्ञान केंद्र (KVK) के वैज्ञानिक या कृषि अधिकारी से परामर्श लें।");
            diagnosis.setSafeImmediateStepsEn("Consult your nearest Krishi Vigyan Kendra (KVK) scientist or Village Agriculture Assistant.");

            diagnosis.setWhatNotToDoTe("ధృవీకరించని రసాయన మందులను షాపుల సలహాతో పిచికారీ చేయవద్దు.");
            diagnosis.setWhatNotToDoHi("बिना वैज्ञानिक सलाह के कीटनाशकों का छिड़काव न करें।");
            diagnosis.setWhatNotToDoEn("Do NOT spray unverified chemical cocktails from local dealers.");

            diagnosis.setChemicalRecommended(false);
            diagnosis.setToxicityBand("GREEN");
            diagnosis.setPreHarvestIntervalDays(0);
            diagnosis.setSafetyGatePassed(true);
            diagnosis.setEscalatedKvk(true); // Flag for KVK assistance
        }

        // 4. Log diagnosis into Crop Memory ledger
        DTOs.EventLogRequest eventLog = new DTOs.EventLogRequest();
        eventLog.setEventType("SYMPTOM_REPORTED");
        eventLog.setTitle("Reported: " + category + " -> " + diagnosis.getSuspectedCauseEn());
        eventLog.setNotes("Diagnosis: " + diagnosis.getSuspectedCauseEn() + " | Confidence: " + diagnosis.getConfidenceLevel());
        cropMemoryService.logEvent(farmerCrop.getId(), eventLog, "SYSTEM");

        return problemDiagnosisRepository.save(diagnosis);
    }
}

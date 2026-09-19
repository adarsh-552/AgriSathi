package com.agrisathi.service;

import com.agrisathi.dto.DTOs.AlertResponse;
import com.agrisathi.entity.FarmerCrop;
import com.agrisathi.entity.FarmerProfile;
import com.agrisathi.entity.User;
import com.agrisathi.entity.WeatherData;
import com.agrisathi.repository.FarmerCropRepository;
import com.agrisathi.repository.FarmerProfileRepository;
import com.agrisathi.repository.WeatherDataRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlertService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final FarmerCropRepository farmerCropRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public AlertService(FarmerProfileRepository farmerProfileRepository,
                        FarmerCropRepository farmerCropRepository,
                        WeatherDataRepository weatherDataRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
        this.farmerCropRepository = farmerCropRepository;
        this.weatherDataRepository = weatherDataRepository;
    }

    public List<AlertResponse> getAlertsForUser(Long userId) {
        List<AlertResponse> alerts = new ArrayList<>();
        String nowStr = LocalDateTime.now().format(formatter);
        FarmerProfile profile = (userId != null)
                ? farmerProfileRepository.findByUserId(userId).orElse(null)
                : null;
        String district = profile != null && profile.getDistrict() != null ? profile.getDistrict() : "Kurnool";

        // 1. Evaluate Weather & Spray Conditions
        List<WeatherData> weatherList = weatherDataRepository.findByDistrictOrderByForecastDateAsc(district);
        if (weatherList.isEmpty()) {
            weatherList = weatherDataRepository.findByDistrictOrderByForecastDateAsc("Kurnool");
        }

        if (!weatherList.isEmpty()) {
            WeatherData todayWeather = weatherList.get(0);

            // Spray Advisory Alert
            if (todayWeather.getRainProbability() >= 40 || !todayWeather.isSafeToSpray()) {
                alerts.add(new AlertResponse(
                        "W-RAIN-" + todayWeather.getId(),
                        "HIGH",
                        "SPRAY",
                        "Rain Expected: Postpone Pesticide / Fertilizer Spraying",
                        "వర్ష సూచన: క్రిమిసంహారక మరియు ఎరువుల పిచికారీని వాయిదా వేయండి",
                        "बारिश की संभावना: कीटनाशक और उर्वरक छिड़काव स्थगित करें",
                        "High chance of precipitation (" + todayWeather.getRainProbability() + "%). Chemical applications will be washed away. Re-evaluate post-rainfall.",
                        "రాబోయే గంటల్లో వర్షం పడే అవకాశం ఉంది (" + todayWeather.getRainProbability() + "%). మందులు కొట్టుకుపోయి వృథా అవుతాయి. వర్షం తగ్గిన తర్వాతే పిచికారీ చేయండి.",
                        "आने वाले घंटों में बारिश की संभावना है। दवाएं बह सकती हैं और व्यर्थ हो सकती हैं। बारिश रुकने के बाद ही छिड़काव करें।",
                        "WEATHER",
                        nowStr
                ));
            } else if (todayWeather.getWindSpeedKmh() > 15.0) {
                alerts.add(new AlertResponse(
                        "W-WIND-" + todayWeather.getId(),
                        "MEDIUM",
                        "SPRAY",
                        "High Wind Speed Advisory",
                        "అధిక గాలి వేగం: మందుల పిచికారీకి అనుకూలం కాదు",
                        "तेज हवा की चेतावनी: छिड़काव के लिए अनुकूल नहीं",
                        "Wind speed is " + Math.round(todayWeather.getWindSpeedKmh()) + " km/h. Spray drift may damage neighboring crops and reduce efficacy.",
                        "గాలి వేగం గంటకు " + Math.round(todayWeather.getWindSpeedKmh()) + " కి.మీ గా ఉంది. పిచికారీ చేస్తే మందు సరిగ్గా మొక్కలపై నిలవదు మరియు పక్క పొలాలపై పడే ప్రమాదం ఉంది.",
                        "हवा की गति अधिक है (" + Math.round(todayWeather.getWindSpeedKmh()) + " किमी/घंटा)। छिड़काव का प्रभाव कम होगा। शांत मौसम की प्रतीक्षा करें।",
                        "WEATHER",
                        nowStr
                ));
            } else {
                alerts.add(new AlertResponse(
                        "W-GOOD-" + todayWeather.getId(),
                        "INFO",
                        "SPRAY",
                        "Favorable Spraying Window Today",
                        "ఈ రోజు మందుల పిచికారీకి అనుకూలమైన వాతావరణం",
                        "आज छिड़काव के लिए अनुकूल मौसम",
                        "Clear sky and optimal wind speed (" + Math.round(todayWeather.getWindSpeedKmh()) + " km/h). Safe for foliar nutrient and IPM spray applications.",
                        "ఆకాశం నిర్మలంగా ఉంది, గాలి వేగం అనుకూలంగా ఉంది. పోషకాలు మరియు సిఫార్సు చేసిన సస్యరక్షణ మందుల పిచికారీకి ఇది మంచి సమయం.",
                        "मौसम साफ है और हवा की गति अनुकूल है। पर्णीय पोषण और अनुशंसित दवाओं के छिड़काव के लिए अच्छा समय है।",
                        "WEATHER",
                        nowStr
                ));
            }

            // Temperature / Irrigation Advisory
            if (todayWeather.getTempMax() > 36.0) {
                alerts.add(new AlertResponse(
                        "W-HEAT-" + todayWeather.getId(),
                        "HIGH",
                        "IRRIGATION",
                        "High Temperature: Schedule Light Evening Irrigation",
                        "ఎండ తీవ్రత: సాయంత్రం వేళ తేలికపాటి నీటి తడి ఇవ్వండి",
                        "तेज गर्मी: शाम के समय हल्की सिंचाई करें",
                        "Max temperature reaching " + Math.round(todayWeather.getTempMax()) + "°C. Avoid daytime irrigation to prevent root scald and wilting.",
                        "గరిష్ట ఉష్ణోగ్రత " + Math.round(todayWeather.getTempMax()) + "°C దాటింది. మధ్యాహ్నం వేళల్లో నీరు పెట్టవద్దు, సాయంత్రం వేళ మాత్రమే తేలికపాటి తడి అందించండి.",
                        "तापमान " + Math.round(todayWeather.getTempMax()) + "°C तक पहुंच रहा है। दोपहर में सिंचाई न करें, शाम को हल्की सिंचाई दें।",
                        "WEATHER",
                        nowStr
                ));
            }
        }

        // 2. Evaluate Active Crops & Stages
        if (profile != null) {
            List<FarmerCrop> activeCrops = farmerCropRepository.findByFarmerProfileIdAndStatus(profile.getId(), "ACTIVE");
            for (FarmerCrop fc : activeCrops) {
                long daysSinceSowing = ChronoUnit.DAYS.between(fc.getSowingDate(), LocalDate.now());
                String cropName = fc.getCrop() != null ? fc.getCrop().getCommonNameTe() : "పంట";
                String cropNameEn = fc.getCrop() != null ? fc.getCrop().getCommonNameEn() : "Crop";
                String cropNameHi = fc.getCrop() != null ? fc.getCrop().getCommonNameHi() : "फसल";

                if (daysSinceSowing >= 15 && daysSinceSowing <= 25) {
                    alerts.add(new AlertResponse(
                            "C-TASK-WEED-" + fc.getId(),
                            "MEDIUM",
                            "TASK",
                            cropNameEn + ": Intercultivation & First Weed Removal Due",
                            cropName + ": విత్తిన " + daysSinceSowing + " రోజులు — అంతరకృషి & మొదటి కలుపు తీత",
                            cropNameHi + ": बुवाई के " + daysSinceSowing + " दिन — पहली निराई-गुड़ाई का समय",
                            "Crucial weed-free period for " + cropNameEn + ". Perform shallow hoeing or hand weeding to preserve soil nutrients.",
                            cropName + " ఎదుగుదలకు మొదటి 30 రోజులు కలుపు లేకుండా ఉంచడం చాలా ముఖ్యం. వెంటనే గుంటుక లేదా చేతితో కలుపు తీత చేపట్టండి.",
                            cropNameHi + " की शुरुआती बढ़वार के लिए खेत को खरपतवार मुक्त रखें। निराई-गुड़ाई तुरंत करें।",
                            "JOURNEY",
                            nowStr
                    ));
                } else if (daysSinceSowing >= 45 && daysSinceSowing <= 75) {
                    alerts.add(new AlertResponse(
                            "C-TASK-PEST-" + fc.getId(),
                            "HIGH",
                            "TASK",
                            cropNameEn + ": Pest Monitoring & Flowering Stage Care",
                            cropName + ": పూత దశ — పురుగుల నిఘా & పోషక నిర్వహణ",
                            cropNameHi + ": फूल आने की अवस्था — कीट निगरानी और पोषण",
                            "Crop is at peak reproductive stage (Day " + daysSinceSowing + "). Check pheromone traps regularly and install yellow sticky traps.",
                            "పంట పూత దశలో ఉంది (విత్తిన " + daysSinceSowing + " రోజులు). రసం పీల్చే పురుగులు మరియు కాయతొలుచు పురుగుల కోసం లింగాకర్షక బుట్టలను తనిఖీ చేయండి.",
                            "फसल फूल आने की महत्वपूर्ण अवस्था में है। फेरोमोन ट्रैप और चिपचिपे जाल लगाएं।",
                            "JOURNEY",
                            nowStr
                    ));
                }
            }
        }

        // 3. Fallback General Welfare Alert if list is small
        if (alerts.size() < 2) {
            alerts.add(new AlertResponse(
                    "G-SCHEME-REMIND",
                    "INFO",
                    "GENERAL",
                    "Government Subsidy & Support Schemes Available",
                    "రైతులకు ప్రభుత్వ సబ్సిడీ పథకాలు & పెట్టుబడి సహాయం",
                    "किसानों के लिए सरकारी सब्सिडी और सहायता योजनाएं",
                    "Explore verified PM-KISAN, PMFBY crop insurance, and PMKSY micro-irrigation subsidies in the Schemes portal.",
                    "పీఎం కిసాన్, ఫసల్ బీమా యోజన మరియు బిందు సేద్యం రాయితీల వివరాలను 'పథకాలు' విభాగంలో చూడండి.",
                    "पीएम-किसान, फसल बीमा और सूक्ष्म सिंचाई योजनाओं का विवरण 'योजनाएं' अनुभाग में देखें।",
                    "SCHEMES",
                    nowStr
            ));
        }

        return alerts;
    }
}

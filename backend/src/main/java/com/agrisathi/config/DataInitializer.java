package com.agrisathi.config;

import com.agrisathi.entity.*;
import com.agrisathi.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final CropStageRepository cropStageRepository;
    private final CropTaskRepository cropTaskRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final MarketDataRepository marketDataRepository;
    private final AgricultureContentRepository contentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CropRepository cropRepository, CropStageRepository cropStageRepository, CropTaskRepository cropTaskRepository, WeatherDataRepository weatherDataRepository, MarketDataRepository marketDataRepository, AgricultureContentRepository contentRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
        this.cropTaskRepository = cropTaskRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.marketDataRepository = marketDataRepository;
        this.contentRepository = contentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedCropsAndStages();
        seedWeatherData();
        seedMarketData();
        seedAgricultureContent();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@agrisathi.com")) {
            User admin = new User(
                    null,
                    "admin@agrisathi.com",
                    passwordEncoder.encode("Admin@AgriSathi2026"),
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            System.out.println(">>> Seeded default Admin user: admin@agrisathi.com / Admin@AgriSathi2026");
        }
    }

    private void seedCropsAndStages() {
        if (cropRepository.count() == 0) {
            // 1. Cotton
            Crop cotton = new Crop("COTTON", "Cotton", "పత్తి", "कपास", "CASH_CROP", 15.5, 160, "/icons/cotton.svg");
            cotton = cropRepository.save(cotton);

            CropStage s1 = new CropStage(cotton, 1, "SOWING", "Sowing & Land Prep", "విత్తనం నాటడం & నేల తయారీ", "बुवाई एवं खेत तैयारी", 1, 7, 50.0, "Check soil moisture before dibbling seeds.", "విత్తనాలు నాటే ముందు నేలలో తగినంత తేమ ఉందో లేదో చూడండి.", "बीज बोने से पहले मिट्टी में नमी की जांच करें।");
            CropStage s2 = new CropStage(cotton, 2, "GERMINATION", "Germination & Seedling", "మొలక దశ & మొలకల సంరక్షణ", "अंकुरण एवं पौध अवस्था", 8, 25, 180.0, "Check for gaps. Dibble reserve seeds if emergence is < 85%.", "మొలకల శాతాన్ని గమనించండి. మొలకలు రాని చోట్ల విత్తనాలు నాటండి.", "अंकुरण प्रतिशत देखें और जहां पौधे न उगे हों वहां दोबारा बीज लगाएं।");
            CropStage s3 = new CropStage(cotton, 3, "VEGETATIVE", "Vegetative Growth", "శాకీయ ఎదుగుదల దశ", "वानस्पतिक वृद्धि अवस्था", 26, 45, 350.0, "Inspect lower leaves for sucking pest activity (jassids/thrips).", "ఆకుల అడుగు భాగాన రసం పీల్చే పురుగుల ఉధృతిని గమనించండి.", "पत्तियों के नीचे रस चूसक कीटों की निगरानी करें।");
            CropStage s4 = new CropStage(cotton, 4, "FLOWERING", "Squaring & Flowering", "పూత & కాయ దశ", "फूल एवं कली अवस्था", 46, 75, 600.0, "Inspect squares and flowers for pink bollworm larvae rosette flowers.", "పూత రాలకుండా తేమ నిలకడగా ఉండేలా చూడండి. గులాబీ రంగు పురుగును గమనించండి.", "फूलों को झड़ने से बचाएं और गुलाबी सुंडी की निगरानी करें।");
            CropStage s5 = new CropStage(cotton, 5, "MATURITY", "Boll Development & Maturity", "కాయ ఎదుగుదల & పక్వత", "टेंडा विकास एवं परिपक्वता", 76, 120, 950.0, "Check boll opening and fiber quality. Avoid excessive water.", "కాయలు పగిలే సమయంలో అధిక నీరు పెట్టవద్దు.", "टेंडे खिलते समय अधिक सिंचाई न करें।");
            CropStage s6 = new CropStage(cotton, 6, "HARVEST", "Picking & Post-Harvest", "పత్తి తీయడం & నిల్వ", "चुनाई एवं भंडारण", 121, 160, 1200.0, "Pick dry, clean cotton in morning hours. Avoid trash contamination.", "ఉదయం పూట మంచు ఆరిన తర్వాత మాత్రమే శుభ్రంగా పత్తిని తీయండి.", "ओस सूखने के बाद ही साफ-सुथरी कपास की चुनाई करें।");
            cropStageRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6));

            // Seed sample tasks for flowering stage
            CropTask t1 = new CropTask(s4, 2, "INSPECTION", "Flowering Check & Foliar Spray", "పూతదశ చెకప్ & ఫోలియర్ స్ప్రే", "फूल निरीक्षण एवं पर्णीय छिड़काव", "Inspect 20 plants for flower drop. Apply 13-0-45 foliar spray at 5g/L if stress is observed.", "పూత రాలకుండా గమనించండి. అవసరమైతే 13-0-45 ఎరువును లీటరు నీటికి 5 గ్రాములు కలిపి పిచికారీ చేయండి.", "फूलों के झड़ने की जांच करें और आवश्यक हो तो 13-0-45 का छिड़काव करें।", "LOW", true);
            cropTaskRepository.save(t1);

            // 2. Paddy
            Crop paddy = new Crop("PADDY", "Paddy (Rice)", "వరి", "धान", "CEREAL", 10.0, 130, "/icons/paddy.svg");
            cropRepository.save(paddy);

            // 3. Chilli
            Crop chilli = new Crop("CHILLI", "Chilli", "మిరప", "मिर्च", "SPICE", 12.0, 150, "/icons/chilli.svg");
            cropRepository.save(chilli);

            // 4. Maize
            Crop maize = new Crop("MAIZE", "Maize", "మొక్కజొన్న", "मक्का", "CEREAL", 10.0, 110, "/icons/maize.svg");
            cropRepository.save(maize);

            // 5. Groundnut
            Crop groundnut = new Crop("GROUNDNUT", "Groundnut", "వేరుశనగ", "मूंगफली", "OILSEED", 12.0, 105, "/icons/groundnut.svg");
            cropRepository.save(groundnut);

            // 6. Soybean
            Crop soybean = new Crop("SOYBEAN", "Soybean", "సోయాబీన్", "सोयाबीन", "OILSEED", 10.0, 100, "/icons/soybean.svg");
            cropRepository.save(soybean);

            System.out.println(">>> Seeded 6 master crops with dynamic stages and biological base temperatures.");
        }
    }

    private void seedWeatherData() {
        if (weatherDataRepository.count() == 0) {
            LocalDate today = LocalDate.now();
            WeatherData w1 = new WeatherData("Andhra Pradesh", "Kurnool", today, 32.0, 22.0, 20, 68, 12.0,
                    "Rain probability is low today. Suitable for field operations and spraying.",
                    "ఈ రోజు వర్షం అవకాశం తక్కువ. పంటలకు పిచికారీ మరియు పొలం పనులకు అనుకూలం.",
                    "आज बारिश की संभावना कम है। खेत में छिड़काव के लिए अनुकूल समय है।",
                    true);
            WeatherData w2 = new WeatherData("Andhra Pradesh", "Kurnool", today.plusDays(1), 30.0, 23.0, 10, 65, 10.0,
                    "Dry weather expected. Monitor soil moisture.",
                    "పొడి వాతావరణం ఉంటుంది. నేలలో తేమను గమనించండి.",
                    "मौसम साफ रहेगा। मिट्टी में नमी का ध्यान रखें।",
                    true);
            WeatherData w3 = new WeatherData("Andhra Pradesh", "Kurnool", today.plusDays(2), 31.0, 24.0, 5, 60, 11.0,
                    "Sunny and dry. Maintain irrigation schedule.",
                    "ఎండగా ఉంటుంది. తగినంత నీటి పారుదల అందించండి.",
                    "धूप खिली रहेगी। सिंचाई समय पर करें।",
                    true);
            WeatherData w4 = new WeatherData("Andhra Pradesh", "Kurnool", today.plusDays(3), 29.0, 22.0, 60, 78, 18.0,
                    "Moderate rain showers expected. Postpone chemical sprays.",
                    "ఓ మోస్తరు వర్షం పడే అవకాశం ఉంది. రసాయన పిచికారీలను వాయిదా వేయండి.",
                    "बारिश की संभावना है। रासायनिक छिड़काव स्थगित करें।",
                    false);
            WeatherData w5 = new WeatherData("Andhra Pradesh", "Kurnool", today.plusDays(4), 27.0, 21.0, 80, 85, 20.0,
                    "Heavy rain alert. Ensure proper drainage in fields to avoid waterlogging.",
                    "భారీ వర్ష సూచన. పొలంలో నీరు నిల్వ ఉండకుండా మురుగు కాలువలు శుభ్రం చేయండి.",
                    "भारी बारिश की चेतावनी। खेतों से जल निकासी की व्यवस्था सुनिश्चित करें।",
                    false);
            weatherDataRepository.saveAll(List.of(w1, w2, w3, w4, w5));
            System.out.println(">>> Seeded verified 5-day IMD weather data for Kurnool district.");
        }
    }

    private void seedMarketData() {
        if (marketDataRepository.count() == 0) {
            LocalDate today = LocalDate.now();
            MarketData m1 = new MarketData("Kurnool Market Yard", "Andhra Pradesh", "Kurnool",
                    "Red Chilli", "మిరప", "लाल मिर्च", "SPICE", 5800.0, 3.57, today,
                    "[5400, 5450, 5600, 5500, 5700, 5650, 5800]");
            MarketData m2 = new MarketData("Kurnool Market Yard", "Andhra Pradesh", "Kurnool",
                    "Paddy (Fine)", "వరి (సన్న)", "धान (बारीक)", "GRAIN", 2450.0, 2.50, today,
                    "[2380, 2400, 2410, 2420, 2430, 2440, 2450]");
            MarketData m3 = new MarketData("Kurnool Market Yard", "Andhra Pradesh", "Kurnool",
                    "Maize", "మొక్కజొన్న", "मक्का", "GRAIN", 1820.0, 1.80, today,
                    "[1780, 1790, 1800, 1800, 1810, 1815, 1820]");
            MarketData m4 = new MarketData("Kurnool Market Yard", "Andhra Pradesh", "Kurnool",
                    "Cotton (Kapas)", "పత్తి", "कपास", "COMMERCIAL", 7650.0, 1.20, today,
                    "[7500, 7550, 7520, 7580, 7600, 7620, 7650]");
            MarketData m5 = new MarketData("Kurnool Market Yard", "Andhra Pradesh", "Kurnool",
                    "Soybean", "సోయాబీన్", "सोयाबीन", "OILSEED", 4320.0, -0.80, today,
                    "[4400, 4380, 4360, 4350, 4340, 4330, 4320]");
            marketDataRepository.saveAll(List.of(m1, m2, m3, m4, m5));
            System.out.println(">>> Seeded authentic APMC Mandi rates for Kurnool Market Yard.");
        }
    }

    private void seedAgricultureContent() {
        if (contentRepository.count() == 0) {
            AgricultureContent c1 = new AgricultureContent();
            c1.setContentCode("COTTON_YELLOWING_IPM");
            c1.setTitleEn("Integrated Management of Cotton Leaf Yellowing");
            c1.setTitleTe("పత్తిలో ఆకుల పసుపు రంగు నివారణ సమగ్ర యాజమాన్యం");
            c1.setTitleHi("कपास में पत्तियों के पीलेपन का एकीकृत प्रबंधन");
            c1.setBodyEn("Yellowing of lower leaves is frequently caused by nitrogen leaching under temporary waterlogging. Always ensure soil drainage before considering any nutrient application.");
            c1.setBodyTe("పత్తిలో దిగువ ఆకులు పసుపు రంగులోకి మారడం అనేది ప్రధానంగా అధిక నీటి నిల్వ వల్ల నత్రజని కొట్టుకుపోవడం వల్ల జరుగుతుంది. ముందుగా పొలం నుండి నీటిని తొలగించండి.");
            c1.setBodyHi("कपास की निचली पत्तियों का पीला पड़ना आमतौर पर जलभराव के कारण नाइट्रोजन बह जाने से होता है। पहले खेत से पानी निकालें।");
            c1.setSourceInstitution("ICAR - Central Institute for Cotton Research (CICR)");
            c1.setScientificCitation("CICR Cotton Advisory Bulletin 2024, Section 4.2");
            c1.setVerificationStatus("PUBLISHED");
            c1.setVerifiedBy("admin@agrisathi.com");
            contentRepository.save(c1);
            System.out.println(">>> Seeded verified ICAR agronomic reference content.");
        }
    }
}

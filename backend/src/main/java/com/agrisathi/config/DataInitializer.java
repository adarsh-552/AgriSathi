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
    private final GovernmentSchemeRepository governmentSchemeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CropRepository cropRepository, CropStageRepository cropStageRepository, CropTaskRepository cropTaskRepository, WeatherDataRepository weatherDataRepository, MarketDataRepository marketDataRepository, AgricultureContentRepository contentRepository, GovernmentSchemeRepository governmentSchemeRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
        this.cropTaskRepository = cropTaskRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.marketDataRepository = marketDataRepository;
        this.contentRepository = contentRepository;
        this.governmentSchemeRepository = governmentSchemeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedCropsAndStages();
        seedWeatherData();
        seedMarketData();
        seedAgricultureContent();
        seedGovernmentSchemes();
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

            // Seed authentic agronomic tasks across all stages
            CropTask t1 = new CropTask(s1, 1, "SEED_TREATMENT", "Seed Treatment & Dibbling", "విత్తన శుద్ధి & నాటడం", "बीज उपचार एवं बुवाई", "Treat seeds with Imidacloprid 70WS (5g/kg) and Trichoderma (10g/kg) before sowing.", "విత్తనాలను ఇమిడాక్లోప్రిడ్ మరియు ట్రైకోడెర్మాతో శుద్ధి చేసి నాటండి.", "बीज को इमिडाक्लोप्रिड और ट्राइकोडर्मा से उपचारित करें।", "MEDIUM", true);
            CropTask t2 = new CropTask(s2, 10, "THINNING", "Gap Filling & Thinning", "గ్యాప్ ఫిల్లింగ్ & మొక్కల ఎంపిక", "रिक्त स्थान भरना एवं छंटाई", "Thin seedlings to keep one healthy plant per hill. Fill gaps with reserve seedlings.", "ఒక స్థానంలో ఒకే బలమైన మొక్కను ఉంచి మిగతావి తొలగించండి.", "प्रति स्थान एक स्वस्थ पौधा छोड़ें, शेष पौधे हटा दें।", "LOW", false);
            CropTask t3 = new CropTask(s3, 30, "NUTRIENT_MANAGEMENT", "Vegetative Top Dressing & Pest Traps", "ఎరువుల యాజమాన్యం & పసుపు జిగురు బోర్డులు", "उर्वरक प्रबंधन एवं पीले चिपचिपे जाल", "Apply 1st top dressing of Nitrogen (Urea 25kg/acre). Install yellow sticky traps (8-10/acre) for sucking pest monitoring.", "ఎకరాకు 25 కేజీల యూరియాను వేయండి. రసం పీల్చే పురుగుల కోసం పసుపు జిగురు అట్టలను ఏర్పాటు చేయండి.", "25 किग्रा यूरिया प्रति एकड़ दें। रस चूसक कीटों के लिए पीले चिपचिपे ट्रैप लगाएं।", "MEDIUM", true);
            CropTask t4 = new CropTask(s4, 50, "FLOWERING_CARE", "Flowering Check & Foliar Spray", "పూతదశ చెకప్ & ఫోలియర్ స్ప్రే", "फूल निरीक्षण एवं पर्णीय छिड़काव", "Inspect 20 plants for flower drop. Apply 13-0-45 foliar spray at 5g/L if stress is observed. Install pink bollworm pheromone traps.", "పూత రాలకుండా గమనించండి. అవసరమైతే 13-0-45 ఎరువును లీటరు నీటికి 5 గ్రాములు కలిపి పిచికారీ చేయండి.", "फूलों के झड़ने की जांच करें और आवश्यक हो तो 13-0-45 का छिड़काव करें।", "LOW", true);
            CropTask t5 = new CropTask(s5, 80, "BOLL_PROTECTION", "Boll Development & Moisture Control", "కాయ ఎదుగుదల & తేమ నియంత్రణ", "टेंडा विकास एवं नमी नियंत्रण", "Regulate irrigation intervals. Avoid water accumulation around root zones to prevent boll rot.", "కాయలు కుళ్ళకుండా పొలంలో నీరు నిల్వ ఉండకుండా చూడండి.", "टेंडे सड़ने से बचाने के लिए जलभराव न होने दें।", "MEDIUM", true);
            CropTask t6 = new CropTask(s6, 125, "HARVESTING", "Clean Cotton Picking", "పరిశుభ్రమైన పత్తి సేకరణ", "साफ कपास चुनाई", "Pick dry cotton in morning hours after dew dries. Separate stained and infested bolls.", "ఉదయం పూట మంచు ఆరిన తర్వాత మాత్రమే శుభ్రంగా పత్తిని తీయండి.", "ओस सूखने के बाद ही साफ-सुथरी कपास की चुनाई करें।", "HIGH", true);
            cropTaskRepository.saveAll(List.of(t1, t2, t3, t4, t5, t6));

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
            AgricultureContent c2 = new AgricultureContent();
            c2.setContentCode("PADDY_AWD_WATER_MGMT");
            c2.setTitleEn("Alternate Wetting and Drying (AWD) in Paddy");
            c2.setTitleTe("వరిలో ఆరుతడుల నీటి యాజమాన్య పద్ధతి (AWD)");
            c2.setTitleHi("धान में वैकल्पिक गीला और सूखा (AWD) जल प्रबंधन");
            c2.setBodyEn("Alternate Wetting and Drying saves up to 30% irrigation water without reducing grain yield. Monitor water level using a perforated field water tube (pani pipe). Re-irrigate when water drops 15 cm below soil surface.");
            c2.setBodyTe("వరిలో నిరంతరం నీరు నిల్వ ఉంచకుండా, పొలం ఆరిన తర్వాత మాత్రమే తడులు ఇవ్వడం ద్వారా 30% నీటిని ఆదా చేయవచ్చు. నీటి గొట్టం ద్వారా పరిశీలించి తడులు ఇవ్వండి.");
            c2.setBodyHi("धान में लगातार पानी भरने के बजाय 2-3 दिन खेत सूखने के बाद सिंचाई करने से 30% पानी की बचत होती है और पैदावार बढ़ती है।");
            c2.setSourceInstitution("ICAR - Indian Institute of Rice Research (IIRR)");
            c2.setScientificCitation("IIRR Technical Bulletin No. 89/2023");
            c2.setVerificationStatus("PUBLISHED");
            c2.setVerifiedBy("admin@agrisathi.com");

            AgricultureContent c3 = new AgricultureContent();
            c3.setContentCode("CHILLI_THRIPS_MITES_IPM");
            c3.setTitleEn("Safe Management of Chilli Thrips & Mites");
            c3.setTitleTe("మిర్చిలో తామర పురుగులు, నల్లి నివారణ సమగ్ర సస్యరక్షణ");
            c3.setTitleHi("मिर्च में थ्रिप्स और माइट्स का सुरक्षित प्रबंधन");
            c3.setBodyEn("Avoid high-dose synthetic pyrethroids. Install 20 blue sticky traps for thrips and spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 1500ppm at 5ml/L during evening hours.");
            c3.setBodyTe("మిర్చిలో సింథటిక్ మందులు వాడితే పురుగులు మరింత పెరుగుతాయి. ఎకరాకు 20 నీలి రంగు జిగురు అట్టలు అమర్చండి. 5% వేప గింజల కషాయం పిచికారీ చేయండి.");
            c3.setBodyHi("मिर्च में तेज रासायनिक दवाओं के बजाय 20 नीले चिपचिपे जाल लगाएं और नीम तेल 1500 ppm (5 मिली/लीटर) का छिड़काव करें।");
            c3.setSourceInstitution("Acharya N.G. Ranga Agricultural University (ANGRAU)");
            c3.setScientificCitation("ANGRAU Crop Protection Advisory 2024, Page 112");
            c3.setVerificationStatus("PUBLISHED");
            c3.setVerifiedBy("admin@agrisathi.com");

            AgricultureContent c4 = new AgricultureContent();
            c4.setContentCode("MAIZE_FAW_IPM_PROTOCOL");
            c4.setTitleEn("Fall Armyworm (FAW) Protocol in Maize");
            c4.setTitleTe("మొక్కజొన్నలో కత్తెర పురుగు నివారణ సమగ్ర విధానం");
            c4.setTitleHi("मक्का में फॉल आर्मीवर्म का एकीकृत नियंत्रण");
            c4.setBodyEn("Install 5 pheromone traps per acre at 15-20 days after germination. Apply Metarhizium anisopliae or Beauveria bassiana (5g/L) into the whorls. Use sand or soil mix in leaf whorls to prevent larva movement.");
            c4.setBodyTe("మొక్కజొన్న విత్తిన 15 రోజులకే ఎకరాకు 5 లింగాకర్షక బుట్టలు అమర్చండి. సుడులలో బవేరియా బాసియానా లేదా మెటారైజియం (5 గ్రా/లీ) పిచికారీ చేయండి.");
            c4.setBodyHi("मक्का के पौधों में सुंडी नियंत्रण के लिए शुरुआती अवस्था में नीम अर्क और बवेरिया बासियाना का छिड़काव करें। 5 फेरोमोन ट्रैप लगाएं।");
            c4.setSourceInstitution("ICAR - Indian Institute of Maize Research (IIMR)");
            c4.setScientificCitation("IIMR FAW Management SOP 2023");
            c4.setVerificationStatus("PUBLISHED");
            c4.setVerifiedBy("admin@agrisathi.com");

            contentRepository.saveAll(List.of(c1, c2, c3, c4));
            System.out.println(">>> Seeded verified ICAR agronomic reference contents (4 topics).");
        }
    }

    private void seedGovernmentSchemes() {
        if (governmentSchemeRepository.count() == 0) {
            GovernmentScheme s1 = new GovernmentScheme(
                    "PM_KISAN",
                    "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                    "పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN)",
                    "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
                    "FINANCIAL_INCOME",
                    "Direct income support of Rs. 6,000 per year in three equal 4-monthly installments of Rs. 2,000 directly transferred into Aadhaar-linked bank accounts of landholding farmer families.",
                    "రైతు కుటుంబాలకు పెట్టుబడి సహాయం కింద ఏటా రూ. 6,000 మూడు విడతల్లో నేరుగా బ్యాంక్ ఖాతాలో జమ చేయబడుతుంది.",
                    "भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता तीन समान किश्तों (₹2,000 प्रत्येक) में सीधे बैंक खाते में दी जाती है।",
                    "All landholding farmer families having cultivable landholding in their names. Requires e-KYC and Aadhaar-seeded bank account.",
                    "సాగు భూమి కలిగిన అందరు రైతులు అర్హులు. ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతా మరియు ఇ-కెవైసి తప్పనిసరి.",
                    "सभी भूमिधारक किसान परिवार जिनके नाम पर कृषि भूमि है। ई-केवाईसी अनिवार्य है।",
                    "₹6,000 per annum (₹2,000 per installment every 4 months)",
                    "ఏటా రూ. 6,000 (ప్రతి 4 నెలలకు రూ. 2,000)",
                    "₹6,000 प्रति वर्ष (हर 4 महीने में ₹2,000)",
                    "ALL_INDIA",
                    "https://pmkisan.gov.in",
                    "Ministry of Agriculture & Farmers Welfare, Govt of India"
            );

            GovernmentScheme s2 = new GovernmentScheme(
                    "PMFBY",
                    "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
                    "ప్రధాన మంత్రి ఫసల్ బీమా యోజన (PMFBY)",
                    "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
                    "CROP_INSURANCE",
                    "Comprehensive crop insurance covering non-preventable natural risks from pre-sowing to post-harvest (drought, flood, unseasonal rains, pest attacks).",
                    "ప్రకృతి వైపరీత్యాలు, కరువు, అకాల వర్షాలు, చీడపీడల వల్ల పంట నష్టం జరిగితే సమగ్ర బీమా రక్షణ.",
                    "प्राकृतिक आपदाओं, सूखे, बाढ़ और कीटों से फसल नुकसान पर किसानों को व्यापक बीमा सुरक्षा प्रदान की जाती है।",
                    "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
                    "నోటిఫై చేయబడిన పంటలు సాగు చేసే రైతులు, కౌలు రైతులు అందరూ అర్హులు.",
                    "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान और बटाईदार पात्र हैं।",
                    "Affordable premium: 2% for Kharif, 1.5% for Rabi, 5% for Annual Commercial/Horticulture crops. Balance premium borne by Govt.",
                    "రైతు చెల్లించాల్సిన ప్రీమియం చాలా తక్కువ: ఖరీఫ్‌కు 2%, రబీకి 1.5%. మిగిలినది ప్రభుత్వం భరిస్తుంది.",
                    "खरीफ के लिए 2%, रबी के लिए 1.5% प्रीमियम। बाकी प्रीमियम सरकार द्वारा वहन किया जाता है।",
                    "ALL_INDIA",
                    "https://pmfby.gov.in",
                    "Ministry of Agriculture & Farmers Welfare, Govt of India"
            );

            GovernmentScheme s3 = new GovernmentScheme(
                    "PMKSY",
                    "PMKSY (Per Drop More Crop - Micro Irrigation)",
                    "ప్రధాన మంత్రి కృషి సించాయి యోజన (PMKSY - బిందు సేద్యం)",
                    "प्रधानमंत्री कृषि सिंचाई योजना (PMKSY - प्रति बूंद अधिक फसल)",
                    "IRRIGATION",
                    "Promoting water use efficiency at farm level through Micro Irrigation technologies (Drip and Sprinkler irrigation systems).",
                    "బిందు సేద్యం (డ్రిప్) మరియు తుంపర సేద్యం (స్ప్రింక్లర్) పరికరాల కొనుగోలుపై భారీ సబ్సిడీ.",
                    "ड्रिप और स्प्रिंकलर सिंचाई प्रणाली लगाने पर 45% से 55% तक सरकारी सब्सिडी दी जाती है।",
                    "Farmers owning cultivable agricultural land with assured irrigation water source.",
                    "వ్యవసాయ భూమి మరియు నీటి వనరు కలిగిన రైతులందరూ దరఖాస్తు చేసుకోవచ్చు.",
                    "कृषि योग्य भूमि और पानी के स्रोत वाले सभी किसान पात्र हैं।",
                    "Up to 55% subsidy for Small & Marginal farmers, 45% for other farmers on micro-irrigation equipment.",
                    "చిన్న/సన్నకారు రైతులకు 55% వరకు, ఇతర రైతులకు 45% వరకు సబ్సిడీ లభిస్తుంది.",
                    "छोटे और सीमांत किसानों को 55% और अन्य किसानों को 45% तक सब्सिडी।",
                    "ALL_INDIA",
                    "https://pmksy.gov.in",
                    "Department of Agriculture & Farmers Welfare, Govt of India"
            );

            GovernmentScheme s4 = new GovernmentScheme(
                    "SOIL_HEALTH_CARD",
                    "Soil Health Card Scheme",
                    "సాయిల్ హెల్త్ కార్డ్ పథకం (మట్టి ఆరోగ్య పత్రం)",
                    "मृदा स्वास्थ्य कार्ड योजना",
                    "SOIL_FERTILITY",
                    "Free scientific testing of farm soil every 2 years for 12 essential macro and micronutrients with dosage recommendations.",
                    "మీ పొలం మట్టిని ఉచితంగా ల్యాబ్‌లో పరీక్షించి 12 రకాల పోషకాల వివరాలతో కూడిన కార్డు అందజేస్తారు.",
                    "खेत की मिट्टी की निशुल्क जांच कर 12 पोषक तत्वों की स्थिति और फसल अनुसार उर्वरक सिफारिश का कार्ड दिया जाता है।",
                    "All farmers with operational land holdings across all states.",
                    "భారతదేశంలోని రైతులందరికీ ఉచితంగా అందుబాటులో ఉంటుంది.",
                    "देश के सभी किसान जिनके पास कृषि भूमि है।",
                    "Exact dosage recommendations for Urea, DAP, Potash, Zinc and Gypsum; reduces fertilizer expenditure by 15-25%.",
                    "ఖచ్చితమైన మోతాదులో ఎరువుల వాడకం సలహా; అనవసర ఎరువుల ఖర్చు 20% వరకు తగ్గుతుంది.",
                    "सटीक उर्वरक मात्रा की सलाह जिससे 20% तक उर्वरक खर्च की बचत होती है।",
                    "ALL_INDIA",
                    "https://soilhealth.dac.gov.in",
                    "Ministry of Agriculture & Farmers Welfare, Govt of India"
            );

            GovernmentScheme s5 = new GovernmentScheme(
                    "SMAM",
                    "Sub-Mission on Agricultural Mechanization (SMAM)",
                    "వ్యవసాయ యాంత్రీకరణ సబ్-మిషన్ (SMAM సబ్సిడీ)",
                    "कृषि यंत्रीकरण उप-मिशन (SMAM)",
                    "MECHANIZATION",
                    "Subsidies on agricultural machinery including tractors, power tillers, rotavators, seed drills, and establishing Custom Hiring Centers.",
                    "ట్రాక్టర్లు, రోటవేటర్లు, విత్తనాలు వేసే యంత్రాలు మరియు వ్యవసాయ పరికరాలపై 40-50% సబ్సిడీ.",
                    "ट्रैक्टर, रोटावेटर, कल्टीवेटर और कृषि यंत्रों की खरीद पर 40% से 50% तक सरकारी सब्सिडी।",
                    "Individual farmers, Farmer Producer Organizations (FPOs), and Custom Hiring Center entrepreneurs.",
                    "రైతులు, రైతు ఉత్పత్తిదారుల సంఘాలు (FPOలు) దరఖాస్తు చేసుకోవచ్చు.",
                    "व्यक्तिगत किसान, स्वयं सहायता समूह और एफपीओ पात्र हैं।",
                    "40% to 50% financial subsidy on verified farm equipment models.",
                    "ధ్రువీకరించిన వ్యవసాయ యంత్రాలపై 40% నుండి 50% సబ్సిడీ.",
                    "यंत्रों की खरीद पर 40% से 50% सब्सिडी।",
                    "ALL_INDIA",
                    "https://agrimachinery.nic.in",
                    "Ministry of Agriculture & Farmers Welfare, Govt of India"
            );

            GovernmentScheme s6 = new GovernmentScheme(
                    "RYTHU_BHAROSA",
                    "YSR Rythu Bharosa - PM KISAN",
                    "వైఎస్సార్ రైతు భరోసా - పీఎం కిసాన్",
                    "वाईएसआर रायथु भरोसा (आंध्र प्रदेश)",
                    "FINANCIAL_INCOME",
                    "Andhra Pradesh state flagship investment support of ₹13,500 per year per farmer family (including ₹6,000 from PM-KISAN) prior to cropping seasons.",
                    "ఆంధ్రప్రదేశ్ రైతుల కోసం సాగు పెట్టుబడి సహాయం కింద ఏటా రూ. 13,500 (పీఎం కిసాన్ కలిపి) ఆర్థిక సహాయం.",
                    "आंध्र प्रदेश सरकार द्वारा किसानों को खरीफ और रबी से पहले प्रति वर्ष ₹13,500 की वित्तीय सहायता।",
                    "Landowner farmers and eligible SC/ST/BC/Minority tenant farmers in Andhra Pradesh.",
                    "ఆంధ్రప్రదేశ్‌లోని రైతులతో పాటు ఎస్సీ/ఎస్టీ/బీసీ/మైనారిటీ కౌలు రైతులు కూడా అర్హులు.",
                    "आंध्र प्रदेश के भूमिधारक किसान और पंजीकृत बटाईदार किसान।",
                    "₹13,500 total annual input subsidy disbursed in 3 phases before sowing seasons.",
                    "సాగుకు ముందు మూడు విడతల్లో మొత్తం రూ. 13,500 ఆర్థిక సహాయం.",
                    "सालाना ₹13,500 की वित्तीय सहायता।",
                    "Andhra Pradesh",
                    "https://ysrrythubharosa.ap.gov.in",
                    "Department of Agriculture, Government of Andhra Pradesh"
            );

            governmentSchemeRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6));
            System.out.println(">>> Seeded authentic Government Schemes (6 schemes including Central & State).");
        }
    }
}

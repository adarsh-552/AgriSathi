package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(nullable = false)
    private LocalDate forecastDate;

    @Column(nullable = false)
    private double tempMax;

    @Column(nullable = false)
    private double tempMin;

    @Column(nullable = false)
    private int rainProbability; // 0 to 100 percent

    @Column(nullable = false)
    private int humidityPercent;

    private double windSpeedKmh;

    @Column(columnDefinition = "TEXT")
    private String operationalAdvisoryEn;

    @Column(columnDefinition = "TEXT")
    private String operationalAdvisoryTe;

    @Column(columnDefinition = "TEXT")
    private String operationalAdvisoryHi;

    @Column(nullable = false)
    private boolean safeToSpray;

    @Column(nullable = false, length = 100)
    private String source = "IMD Agromet Advisory Services";

    @Column(nullable = false)
    private LocalDateTime fetchedAt = LocalDateTime.now();

    public WeatherData() {}

    public WeatherData(String state, String district, LocalDate forecastDate, double tempMax, double tempMin, int rainProbability, int humidityPercent, double windSpeedKmh, String operationalAdvisoryEn, String operationalAdvisoryTe, String operationalAdvisoryHi, boolean safeToSpray) {
        this.state = state;
        this.district = district;
        this.forecastDate = forecastDate;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.rainProbability = rainProbability;
        this.humidityPercent = humidityPercent;
        this.windSpeedKmh = windSpeedKmh;
        this.operationalAdvisoryEn = operationalAdvisoryEn;
        this.operationalAdvisoryTe = operationalAdvisoryTe;
        this.operationalAdvisoryHi = operationalAdvisoryHi;
        this.safeToSpray = safeToSpray;
        this.source = "IMD Agromet Advisory Services";
        this.fetchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public LocalDate getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDate forecastDate) { this.forecastDate = forecastDate; }

    public double getTempMax() { return tempMax; }
    public void setTempMax(double tempMax) { this.tempMax = tempMax; }

    public double getTempMin() { return tempMin; }
    public void setTempMin(double tempMin) { this.tempMin = tempMin; }

    public int getRainProbability() { return rainProbability; }
    public void setRainProbability(int rainProbability) { this.rainProbability = rainProbability; }

    public int getHumidityPercent() { return humidityPercent; }
    public void setHumidityPercent(int humidityPercent) { this.humidityPercent = humidityPercent; }

    public double getWindSpeedKmh() { return windSpeedKmh; }
    public void setWindSpeedKmh(double windSpeedKmh) { this.windSpeedKmh = windSpeedKmh; }

    public String getOperationalAdvisoryEn() { return operationalAdvisoryEn; }
    public void setOperationalAdvisoryEn(String operationalAdvisoryEn) { this.operationalAdvisoryEn = operationalAdvisoryEn; }

    public String getOperationalAdvisoryTe() { return operationalAdvisoryTe; }
    public void setOperationalAdvisoryTe(String operationalAdvisoryTe) { this.operationalAdvisoryTe = operationalAdvisoryTe; }

    public String getOperationalAdvisoryHi() { return operationalAdvisoryHi; }
    public void setOperationalAdvisoryHi(String operationalAdvisoryHi) { this.operationalAdvisoryHi = operationalAdvisoryHi; }

    public boolean isSafeToSpray() { return safeToSpray; }
    public void setSafeToSpray(boolean safeToSpray) { this.safeToSpray = safeToSpray; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(LocalDateTime fetchedAt) { this.fetchedAt = fetchedAt; }
}

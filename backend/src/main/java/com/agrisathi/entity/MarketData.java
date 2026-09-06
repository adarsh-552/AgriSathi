package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_data")
public class MarketData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String marketName; // e.g. "Kurnool Market Yard"

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(nullable = false, length = 100)
    private String cropNameEn;

    @Column(nullable = false, length = 100)
    private String cropNameTe;

    @Column(nullable = false, length = 100)
    private String cropNameHi;

    @Column(nullable = false, length = 50)
    private String commodityCategory; // "GRAIN", "VEGETABLE", "OILSEED", "SPICE", "COMMERCIAL"

    @Column(nullable = false)
    private double modalPriceQuintal;

    @Column(nullable = false)
    private double priceChangePercent; // e.g. +3.57, -0.80

    @Column(nullable = false)
    private LocalDate priceDate;

    @Column(columnDefinition = "TEXT")
    private String trendJson7d; // e.g. "[5400, 5450, 5600, 5500, 5700, 5650, 5800]"

    @Column(nullable = false, length = 100)
    private String source = "Agmarknet / AP State Agricultural Marketing Board";

    @Column(nullable = false)
    private LocalDateTime fetchedAt = LocalDateTime.now();

    public MarketData() {}

    public MarketData(String marketName, String state, String district, String cropNameEn, String cropNameTe, String cropNameHi, String commodityCategory, double modalPriceQuintal, double priceChangePercent, LocalDate priceDate, String trendJson7d) {
        this.marketName = marketName;
        this.state = state;
        this.district = district;
        this.cropNameEn = cropNameEn;
        this.cropNameTe = cropNameTe;
        this.cropNameHi = cropNameHi;
        this.commodityCategory = commodityCategory;
        this.modalPriceQuintal = modalPriceQuintal;
        this.priceChangePercent = priceChangePercent;
        this.priceDate = priceDate;
        this.trendJson7d = trendJson7d;
        this.source = "Agmarknet / AP State Agricultural Marketing Board";
        this.fetchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMarketName() { return marketName; }
    public void setMarketName(String marketName) { this.marketName = marketName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCropNameEn() { return cropNameEn; }
    public void setCropNameEn(String cropNameEn) { this.cropNameEn = cropNameEn; }

    public String getCropNameTe() { return cropNameTe; }
    public void setCropNameTe(String cropNameTe) { this.cropNameTe = cropNameTe; }

    public String getCropNameHi() { return cropNameHi; }
    public void setCropNameHi(String cropNameHi) { this.cropNameHi = cropNameHi; }

    public String getCommodityCategory() { return commodityCategory; }
    public void setCommodityCategory(String commodityCategory) { this.commodityCategory = commodityCategory; }

    public double getModalPriceQuintal() { return modalPriceQuintal; }
    public void setModalPriceQuintal(double modalPriceQuintal) { this.modalPriceQuintal = modalPriceQuintal; }

    public double getPriceChangePercent() { return priceChangePercent; }
    public void setPriceChangePercent(double priceChangePercent) { this.priceChangePercent = priceChangePercent; }

    public LocalDate getPriceDate() { return priceDate; }
    public void setPriceDate(LocalDate priceDate) { this.priceDate = priceDate; }

    public String getTrendJson7d() { return trendJson7d; }
    public void setTrendJson7d(String trendJson7d) { this.trendJson7d = trendJson7d; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDateTime getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(LocalDateTime fetchedAt) { this.fetchedAt = fetchedAt; }
}

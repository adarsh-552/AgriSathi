package com.agrisathi.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String cropCode; // e.g. "COTTON", "PADDY", "CHILLI", "MAIZE"

    @Column(nullable = false, length = 50)
    private String commonNameEn;

    @Column(nullable = false, length = 50)
    private String commonNameTe;

    @Column(nullable = false, length = 50)
    private String commonNameHi;

    @Column(length = 50)
    private String category; // "CASH_CROP", "CEREAL", "SPICE", "PULSE"

    @Column(nullable = false)
    private double baseTempGdd; // 15.5 for Cotton, 10.0 for Maize, 5.0 for Wheat

    @Column(nullable = false)
    private int standardMaturityDays;

    @Column(length = 255)
    private String iconUrl;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "crop", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stageSequence ASC")
    private List<CropStage> stages = new ArrayList<>();

    public Crop() {}

    public Crop(String cropCode, String commonNameEn, String commonNameTe, String commonNameHi, String category, double baseTempGdd, int standardMaturityDays, String iconUrl) {
        this.cropCode = cropCode;
        this.commonNameEn = commonNameEn;
        this.commonNameTe = commonNameTe;
        this.commonNameHi = commonNameHi;
        this.category = category;
        this.baseTempGdd = baseTempGdd;
        this.standardMaturityDays = standardMaturityDays;
        this.iconUrl = iconUrl;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCropCode() { return cropCode; }
    public void setCropCode(String cropCode) { this.cropCode = cropCode; }

    public String getCommonNameEn() { return commonNameEn; }
    public void setCommonNameEn(String commonNameEn) { this.commonNameEn = commonNameEn; }

    public String getCommonNameTe() { return commonNameTe; }
    public void setCommonNameTe(String commonNameTe) { this.commonNameTe = commonNameTe; }

    public String getCommonNameHi() { return commonNameHi; }
    public void setCommonNameHi(String commonNameHi) { this.commonNameHi = commonNameHi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getBaseTempGdd() { return baseTempGdd; }
    public void setBaseTempGdd(double baseTempGdd) { this.baseTempGdd = baseTempGdd; }

    public int getStandardMaturityDays() { return standardMaturityDays; }
    public void setStandardMaturityDays(int standardMaturityDays) { this.standardMaturityDays = standardMaturityDays; }

    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<CropStage> getStages() { return stages; }
    public void setStages(List<CropStage> stages) { this.stages = stages; }
}

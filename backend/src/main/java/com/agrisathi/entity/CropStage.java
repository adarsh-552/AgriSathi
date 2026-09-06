package com.agrisathi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "crop_stages")
public class CropStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_id", nullable = false)
    @JsonIgnore
    private Crop crop;

    @Column(nullable = false)
    private int stageSequence; // 1, 2, 3...

    @Column(nullable = false, length = 30)
    private String stageCode; // "SOWING", "GERMINATION", "VEGETATIVE", "FLOWERING", "MATURITY", "HARVEST"

    @Column(nullable = false, length = 50)
    private String stageNameEn;

    @Column(nullable = false, length = 50)
    private String stageNameTe;

    @Column(nullable = false, length = 50)
    private String stageNameHi;

    @Column(nullable = false)
    private int standardStartDay;

    @Column(nullable = false)
    private int standardEndDay;

    private Double gddThreshold;

    @Column(columnDefinition = "TEXT")
    private String inspectionPromptEn;

    @Column(columnDefinition = "TEXT")
    private String inspectionPromptTe;

    @Column(columnDefinition = "TEXT")
    private String inspectionPromptHi;

    public CropStage() {}

    public CropStage(Crop crop, int stageSequence, String stageCode, String stageNameEn, String stageNameTe, String stageNameHi, int standardStartDay, int standardEndDay, Double gddThreshold, String inspectionPromptEn, String inspectionPromptTe, String inspectionPromptHi) {
        this.crop = crop;
        this.stageSequence = stageSequence;
        this.stageCode = stageCode;
        this.stageNameEn = stageNameEn;
        this.stageNameTe = stageNameTe;
        this.stageNameHi = stageNameHi;
        this.standardStartDay = standardStartDay;
        this.standardEndDay = standardEndDay;
        this.gddThreshold = gddThreshold;
        this.inspectionPromptEn = inspectionPromptEn;
        this.inspectionPromptTe = inspectionPromptTe;
        this.inspectionPromptHi = inspectionPromptHi;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public int getStageSequence() { return stageSequence; }
    public void setStageSequence(int stageSequence) { this.stageSequence = stageSequence; }

    public String getStageCode() { return stageCode; }
    public void setStageCode(String stageCode) { this.stageCode = stageCode; }

    public String getStageNameEn() { return stageNameEn; }
    public void setStageNameEn(String stageNameEn) { this.stageNameEn = stageNameEn; }

    public String getStageNameTe() { return stageNameTe; }
    public void setStageNameTe(String stageNameTe) { this.stageNameTe = stageNameTe; }

    public String getStageNameHi() { return stageNameHi; }
    public void setStageNameHi(String stageNameHi) { this.stageNameHi = stageNameHi; }

    public int getStandardStartDay() { return standardStartDay; }
    public void setStandardStartDay(int standardStartDay) { this.standardStartDay = standardStartDay; }

    public int getStandardEndDay() { return standardEndDay; }
    public void setStandardEndDay(int standardEndDay) { this.standardEndDay = standardEndDay; }

    public Double getGddThreshold() { return gddThreshold; }
    public void setGddThreshold(Double gddThreshold) { this.gddThreshold = gddThreshold; }

    public String getInspectionPromptEn() { return inspectionPromptEn; }
    public void setInspectionPromptEn(String inspectionPromptEn) { this.inspectionPromptEn = inspectionPromptEn; }

    public String getInspectionPromptTe() { return inspectionPromptTe; }
    public void setInspectionPromptTe(String inspectionPromptTe) { this.inspectionPromptTe = inspectionPromptTe; }

    public String getInspectionPromptHi() { return inspectionPromptHi; }
    public void setInspectionPromptHi(String inspectionPromptHi) { this.inspectionPromptHi = inspectionPromptHi; }
}

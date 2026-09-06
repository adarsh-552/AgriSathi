package com.agrisathi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crop_tasks")
public class CropTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_stage_id", nullable = false)
    private CropStage cropStage;

    @Column(nullable = false)
    private int dayOffset; // Day offset relative to stage start

    @Column(nullable = false, length = 30)
    private String taskCategory; // "NUTRITION", "IRRIGATION", "INSPECTION", "WEEDING", "HARVEST"

    @Column(nullable = false, length = 100)
    private String taskNameEn;

    @Column(nullable = false, length = 100)
    private String taskNameTe;

    @Column(nullable = false, length = 100)
    private String taskNameHi;

    @Column(columnDefinition = "TEXT")
    private String taskDescEn;

    @Column(columnDefinition = "TEXT")
    private String taskDescTe;

    @Column(columnDefinition = "TEXT")
    private String taskDescHi;

    @Column(nullable = false, length = 20)
    private String riskTier = "LOW"; // "LOW", "MEDIUM", "HIGH"

    @Column(nullable = false)
    private boolean mandatory = true;

    public CropTask() {}

    public CropTask(CropStage cropStage, int dayOffset, String taskCategory, String taskNameEn, String taskNameTe, String taskNameHi, String taskDescEn, String taskDescTe, String taskDescHi, String riskTier, boolean mandatory) {
        this.cropStage = cropStage;
        this.dayOffset = dayOffset;
        this.taskCategory = taskCategory;
        this.taskNameEn = taskNameEn;
        this.taskNameTe = taskNameTe;
        this.taskNameHi = taskNameHi;
        this.taskDescEn = taskDescEn;
        this.taskDescTe = taskDescTe;
        this.taskDescHi = taskDescHi;
        this.riskTier = riskTier;
        this.mandatory = mandatory;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CropStage getCropStage() { return cropStage; }
    public void setCropStage(CropStage cropStage) { this.cropStage = cropStage; }

    public int getDayOffset() { return dayOffset; }
    public void setDayOffset(int dayOffset) { this.dayOffset = dayOffset; }

    public String getTaskCategory() { return taskCategory; }
    public void setTaskCategory(String taskCategory) { this.taskCategory = taskCategory; }

    public String getTaskNameEn() { return taskNameEn; }
    public void setTaskNameEn(String taskNameEn) { this.taskNameEn = taskNameEn; }

    public String getTaskNameTe() { return taskNameTe; }
    public void setTaskNameTe(String taskNameTe) { this.taskNameTe = taskNameTe; }

    public String getTaskNameHi() { return taskNameHi; }
    public void setTaskNameHi(String taskNameHi) { this.taskNameHi = taskNameHi; }

    public String getTaskDescEn() { return taskDescEn; }
    public void setTaskDescEn(String taskDescEn) { this.taskDescEn = taskDescEn; }

    public String getTaskDescTe() { return taskDescTe; }
    public void setTaskDescTe(String taskDescTe) { this.taskDescTe = taskDescTe; }

    public String getTaskDescHi() { return taskDescHi; }
    public void setTaskDescHi(String taskDescHi) { this.taskDescHi = taskDescHi; }

    public String getRiskTier() { return riskTier; }
    public void setRiskTier(String riskTier) { this.riskTier = riskTier; }

    public boolean isMandatory() { return mandatory; }
    public void setMandatory(boolean mandatory) { this.mandatory = mandatory; }
}

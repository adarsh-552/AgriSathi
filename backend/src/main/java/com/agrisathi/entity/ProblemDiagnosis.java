package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem_diagnoses")
public class ProblemDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_problem_id", nullable = false, unique = true)
    private CropProblem cropProblem;

    @Column(nullable = false, length = 150)
    private String suspectedCauseEn;

    @Column(nullable = false, length = 150)
    private String suspectedCauseTe;

    @Column(nullable = false, length = 150)
    private String suspectedCauseHi;

    @Column(length = 20)
    private String confidenceLevel = "MODERATE"; // "HIGH", "MODERATE", "LOW"

    @Column(columnDefinition = "TEXT")
    private String differentialEvidence; // Evidence from Crop Memory + Questions

    @Column(columnDefinition = "TEXT", nullable = false)
    private String safeImmediateStepsEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String safeImmediateStepsTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String safeImmediateStepsHi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String whatNotToDoEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String whatNotToDoTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String whatNotToDoHi;

    @Column(nullable = false)
    private boolean chemicalRecommended = false;

    @Column(length = 150)
    private String chemicalActiveIngredient; // CIBRC compliant generic name

    private Integer preHarvestIntervalDays; // Mandatory waiting period in days

    @Column(length = 20)
    private String toxicityBand; // "GREEN", "BLUE", "YELLOW", "RED"

    @Column(nullable = false)
    private boolean safetyGatePassed = true;

    @Column(nullable = false)
    private boolean escalatedKvk = false;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProblemDiagnosis() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CropProblem getCropProblem() { return cropProblem; }
    public void setCropProblem(CropProblem cropProblem) { this.cropProblem = cropProblem; }

    public String getSuspectedCauseEn() { return suspectedCauseEn; }
    public void setSuspectedCauseEn(String suspectedCauseEn) { this.suspectedCauseEn = suspectedCauseEn; }

    public String getSuspectedCauseTe() { return suspectedCauseTe; }
    public void setSuspectedCauseTe(String suspectedCauseTe) { this.suspectedCauseTe = suspectedCauseTe; }

    public String getSuspectedCauseHi() { return suspectedCauseHi; }
    public void setSuspectedCauseHi(String suspectedCauseHi) { this.suspectedCauseHi = suspectedCauseHi; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getDifferentialEvidence() { return differentialEvidence; }
    public void setDifferentialEvidence(String differentialEvidence) { this.differentialEvidence = differentialEvidence; }

    public String getSafeImmediateStepsEn() { return safeImmediateStepsEn; }
    public void setSafeImmediateStepsEn(String safeImmediateStepsEn) { this.safeImmediateStepsEn = safeImmediateStepsEn; }

    public String getSafeImmediateStepsTe() { return safeImmediateStepsTe; }
    public void setSafeImmediateStepsTe(String safeImmediateStepsTe) { this.safeImmediateStepsTe = safeImmediateStepsTe; }

    public String getSafeImmediateStepsHi() { return safeImmediateStepsHi; }
    public void setSafeImmediateStepsHi(String safeImmediateStepsHi) { this.safeImmediateStepsHi = safeImmediateStepsHi; }

    public String getWhatNotToDoEn() { return whatNotToDoEn; }
    public void setWhatNotToDoEn(String whatNotToDoEn) { this.whatNotToDoEn = whatNotToDoEn; }

    public String getWhatNotToDoTe() { return whatNotToDoTe; }
    public void setWhatNotToDoTe(String whatNotToDoTe) { this.whatNotToDoTe = whatNotToDoTe; }

    public String getWhatNotToDoHi() { return whatNotToDoHi; }
    public void setWhatNotToDoHi(String whatNotToDoHi) { this.whatNotToDoHi = whatNotToDoHi; }

    public boolean isChemicalRecommended() { return chemicalRecommended; }
    public void setChemicalRecommended(boolean chemicalRecommended) { this.chemicalRecommended = chemicalRecommended; }

    public String getChemicalActiveIngredient() { return chemicalActiveIngredient; }
    public void setChemicalActiveIngredient(String chemicalActiveIngredient) { this.chemicalActiveIngredient = chemicalActiveIngredient; }

    public Integer getPreHarvestIntervalDays() { return preHarvestIntervalDays; }
    public void setPreHarvestIntervalDays(Integer preHarvestIntervalDays) { this.preHarvestIntervalDays = preHarvestIntervalDays; }

    public String getToxicityBand() { return toxicityBand; }
    public void setToxicityBand(String toxicityBand) { this.toxicityBand = toxicityBand; }

    public boolean isSafetyGatePassed() { return safetyGatePassed; }
    public void setSafetyGatePassed(boolean safetyGatePassed) { this.safetyGatePassed = safetyGatePassed; }

    public boolean isEscalatedKvk() { return escalatedKvk; }
    public void setEscalatedKvk(boolean escalatedKvk) { this.escalatedKvk = escalatedKvk; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

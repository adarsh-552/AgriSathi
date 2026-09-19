package com.agrisathi.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "government_schemes")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class GovernmentScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String schemeCode; // e.g. "PM_KISAN", "PMFBY", "PMKSY", "SOIL_HEALTH_CARD", "SMAM", "RYTHU_BHAROSA"

    @Column(nullable = false, length = 150)
    private String schemeNameEn;

    @Column(nullable = false, length = 150)
    private String schemeNameTe;

    @Column(nullable = false, length = 150)
    private String schemeNameHi;

    @Column(nullable = false, length = 40)
    private String category; // "FINANCIAL_INCOME", "CROP_INSURANCE", "IRRIGATION", "SOIL_FERTILITY", "MECHANIZATION"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String briefDescriptionEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String briefDescriptionTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String briefDescriptionHi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eligibilityEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eligibilityTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eligibilityHi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String benefitsEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String benefitsTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String benefitsHi;

    @Column(nullable = false, length = 100)
    private String stateApplicability; // "ALL_INDIA", "Andhra Pradesh", "Telangana", etc.

    @Column(length = 255)
    private String sourceUrl;

    @Column(nullable = false, length = 100)
    private String sourceDepartment; // "Ministry of Agriculture & Farmers Welfare", "Govt of AP - Dept of Agriculture"

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private LocalDateTime lastVerifiedDate = LocalDateTime.now();

    public GovernmentScheme() {}

    public GovernmentScheme(String schemeCode, String schemeNameEn, String schemeNameTe, String schemeNameHi, String category, String briefDescriptionEn, String briefDescriptionTe, String briefDescriptionHi, String eligibilityEn, String eligibilityTe, String eligibilityHi, String benefitsEn, String benefitsTe, String benefitsHi, String stateApplicability, String sourceUrl, String sourceDepartment) {
        this.schemeCode = schemeCode;
        this.schemeNameEn = schemeNameEn;
        this.schemeNameTe = schemeNameTe;
        this.schemeNameHi = schemeNameHi;
        this.category = category;
        this.briefDescriptionEn = briefDescriptionEn;
        this.briefDescriptionTe = briefDescriptionTe;
        this.briefDescriptionHi = briefDescriptionHi;
        this.eligibilityEn = eligibilityEn;
        this.eligibilityTe = eligibilityTe;
        this.eligibilityHi = eligibilityHi;
        this.benefitsEn = benefitsEn;
        this.benefitsTe = benefitsTe;
        this.benefitsHi = benefitsHi;
        this.stateApplicability = stateApplicability;
        this.sourceUrl = sourceUrl;
        this.sourceDepartment = sourceDepartment;
        this.active = true;
        this.lastVerifiedDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }

    public String getSchemeNameEn() { return schemeNameEn; }
    public void setSchemeNameEn(String schemeNameEn) { this.schemeNameEn = schemeNameEn; }

    public String getSchemeNameTe() { return schemeNameTe; }
    public void setSchemeNameTe(String schemeNameTe) { this.schemeNameTe = schemeNameTe; }

    public String getSchemeNameHi() { return schemeNameHi; }
    public void setSchemeNameHi(String schemeNameHi) { this.schemeNameHi = schemeNameHi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBriefDescriptionEn() { return briefDescriptionEn; }
    public void setBriefDescriptionEn(String briefDescriptionEn) { this.briefDescriptionEn = briefDescriptionEn; }

    public String getBriefDescriptionTe() { return briefDescriptionTe; }
    public void setBriefDescriptionTe(String briefDescriptionTe) { this.briefDescriptionTe = briefDescriptionTe; }

    public String getBriefDescriptionHi() { return briefDescriptionHi; }
    public void setBriefDescriptionHi(String briefDescriptionHi) { this.briefDescriptionHi = briefDescriptionHi; }

    public String getEligibilityEn() { return eligibilityEn; }
    public void setEligibilityEn(String eligibilityEn) { this.eligibilityEn = eligibilityEn; }

    public String getEligibilityTe() { return eligibilityTe; }
    public void setEligibilityTe(String eligibilityTe) { this.eligibilityTe = eligibilityTe; }

    public String getEligibilityHi() { return eligibilityHi; }
    public void setEligibilityHi(String eligibilityHi) { this.eligibilityHi = eligibilityHi; }

    public String getBenefitsEn() { return benefitsEn; }
    public void setBenefitsEn(String benefitsEn) { this.benefitsEn = benefitsEn; }

    public String getBenefitsTe() { return benefitsTe; }
    public void setBenefitsTe(String benefitsTe) { this.benefitsTe = benefitsTe; }

    public String getBenefitsHi() { return benefitsHi; }
    public void setBenefitsHi(String benefitsHi) { this.benefitsHi = benefitsHi; }

    public String getStateApplicability() { return stateApplicability; }
    public void setStateApplicability(String stateApplicability) { this.stateApplicability = stateApplicability; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getSourceDepartment() { return sourceDepartment; }
    public void setSourceDepartment(String sourceDepartment) { this.sourceDepartment = sourceDepartment; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(LocalDateTime lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }
}

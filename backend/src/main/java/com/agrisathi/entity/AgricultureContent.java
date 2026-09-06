package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agriculture_contents")
public class AgricultureContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String contentCode;

    @Column(nullable = false, length = 150)
    private String titleEn;

    @Column(nullable = false, length = 150)
    private String titleTe;

    @Column(nullable = false, length = 150)
    private String titleHi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyEn;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyTe;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String bodyHi;

    @Column(nullable = false, length = 100)
    private String sourceInstitution; // "ICAR - Central Institute for Cotton Research", "ANGRAU", "CIBRC"

    @Column(length = 255)
    private String scientificCitation; // e.g. "Package of Practices for Cotton 2024, Page 38"

    @Column(nullable = false, length = 20)
    private String verificationStatus = "VERIFIED"; // "DRAFT", "UNDER_REVIEW", "VERIFIED", "PUBLISHED"

    @Column(length = 100)
    private String verifiedBy;

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AgricultureContent() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContentCode() { return contentCode; }
    public void setContentCode(String contentCode) { this.contentCode = contentCode; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getTitleTe() { return titleTe; }
    public void setTitleTe(String titleTe) { this.titleTe = titleTe; }

    public String getTitleHi() { return titleHi; }
    public void setTitleHi(String titleHi) { this.titleHi = titleHi; }

    public String getBodyEn() { return bodyEn; }
    public void setBodyEn(String bodyEn) { this.bodyEn = bodyEn; }

    public String getBodyTe() { return bodyTe; }
    public void setBodyTe(String bodyTe) { this.bodyTe = bodyTe; }

    public String getBodyHi() { return bodyHi; }
    public void setBodyHi(String bodyHi) { this.bodyHi = bodyHi; }

    public String getSourceInstitution() { return sourceInstitution; }
    public void setSourceInstitution(String sourceInstitution) { this.sourceInstitution = sourceInstitution; }

    public String getScientificCitation() { return scientificCitation; }
    public void setScientificCitation(String scientificCitation) { this.scientificCitation = scientificCitation; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

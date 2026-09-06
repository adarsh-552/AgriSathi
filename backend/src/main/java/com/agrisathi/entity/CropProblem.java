package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_problems")
public class CropProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_crop_id", nullable = false)
    private FarmerCrop farmerCrop;

    @Column(nullable = false, length = 50)
    private String symptomCategory; // "YELLOW_LEAVES", "LEAF_CURL", "BOLL_DAMAGE", "WILTING"

    @Column(length = 30)
    private String affectedPart; // "LEAF", "STEM", "BOLL", "ROOT"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String referencePhotoUrl;

    @Column(nullable = false, length = 20)
    private String status = "OPEN"; // "OPEN", "RESOLVED", "ESCALATED_KVK"

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CropProblem() {}

    public CropProblem(FarmerCrop farmerCrop, String symptomCategory, String affectedPart, String description, String referencePhotoUrl) {
        this.farmerCrop = farmerCrop;
        this.symptomCategory = symptomCategory;
        this.affectedPart = affectedPart;
        this.description = description;
        this.referencePhotoUrl = referencePhotoUrl;
        this.status = "OPEN";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FarmerCrop getFarmerCrop() { return farmerCrop; }
    public void setFarmerCrop(FarmerCrop farmerCrop) { this.farmerCrop = farmerCrop; }

    public String getSymptomCategory() { return symptomCategory; }
    public void setSymptomCategory(String symptomCategory) { this.symptomCategory = symptomCategory; }

    public String getAffectedPart() { return affectedPart; }
    public void setAffectedPart(String affectedPart) { this.affectedPart = affectedPart; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReferencePhotoUrl() { return referencePhotoUrl; }
    public void setReferencePhotoUrl(String referencePhotoUrl) { this.referencePhotoUrl = referencePhotoUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

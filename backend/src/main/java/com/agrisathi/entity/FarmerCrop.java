package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_crops")
public class FarmerCrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_profile_id", nullable = false)
    private FarmerProfile farmerProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(length = 50)
    private String plotIdentifier = "Main Plot";

    @Column(nullable = false)
    private LocalDate sowingDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_stage_id")
    private CropStage currentStage;

    private Double landAreaAcres;

    @Column(length = 20)
    private String status = "ACTIVE"; // "ACTIVE", "HARVESTED", "ARCHIVED"

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FarmerCrop() {}

    public FarmerCrop(FarmerProfile farmerProfile, Crop crop, String plotIdentifier, LocalDate sowingDate, CropStage currentStage, Double landAreaAcres) {
        this.farmerProfile = farmerProfile;
        this.crop = crop;
        this.plotIdentifier = plotIdentifier != null ? plotIdentifier : "Main Plot";
        this.sowingDate = sowingDate;
        this.currentStage = currentStage;
        this.landAreaAcres = landAreaAcres;
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FarmerProfile getFarmerProfile() { return farmerProfile; }
    public void setFarmerProfile(FarmerProfile farmerProfile) { this.farmerProfile = farmerProfile; }

    public Crop getCrop() { return crop; }
    public void setCrop(Crop crop) { this.crop = crop; }

    public String getPlotIdentifier() { return plotIdentifier; }
    public void setPlotIdentifier(String plotIdentifier) { this.plotIdentifier = plotIdentifier; }

    public LocalDate getSowingDate() { return sowingDate; }
    public void setSowingDate(LocalDate sowingDate) { this.sowingDate = sowingDate; }

    public CropStage getCurrentStage() { return currentStage; }
    public void setCurrentStage(CropStage currentStage) { this.currentStage = currentStage; }

    public Double getLandAreaAcres() { return landAreaAcres; }
    public void setLandAreaAcres(Double landAreaAcres) { this.landAreaAcres = landAreaAcres; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

package com.agrisathi.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kvk_escalations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KvkEscalation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_profile_id", nullable = false)
    private FarmerProfile farmerProfile;

    @Column(nullable = false, length = 100)
    private String cropName;

    @Column(nullable = false, length = 100)
    private String issueCategory; // PEST_DISEASE, WEED_MANAGEMENT, SOIL_DEFICIENCY, WEATHER_DAMAGE, OTHER

    @Column(columnDefinition = "TEXT", nullable = false)
    private String symptomsDescription;

    @Column(nullable = false, length = 20)
    private String urgency = "MEDIUM"; // LOW, MEDIUM, HIGH, EMERGENCY

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, CONTACTED, RESOLVED

    @Column(columnDefinition = "TEXT")
    private String officerNotes;

    @Column(length = 20)
    private String contactNumber;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public KvkEscalation() {}

    public KvkEscalation(FarmerProfile farmerProfile, String cropName, String issueCategory, String symptomsDescription, String urgency, String contactNumber) {
        this.farmerProfile = farmerProfile;
        this.cropName = cropName;
        this.issueCategory = issueCategory;
        this.symptomsDescription = symptomsDescription;
        this.urgency = urgency;
        this.contactNumber = contactNumber;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FarmerProfile getFarmerProfile() { return farmerProfile; }
    public void setFarmerProfile(FarmerProfile farmerProfile) { this.farmerProfile = farmerProfile; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getIssueCategory() { return issueCategory; }
    public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }

    public String getSymptomsDescription() { return symptomsDescription; }
    public void setSymptomsDescription(String symptomsDescription) { this.symptomsDescription = symptomsDescription; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

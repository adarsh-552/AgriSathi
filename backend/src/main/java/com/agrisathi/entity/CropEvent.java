package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_events")
public class CropEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_crop_id", nullable = false)
    private FarmerCrop farmerCrop;

    @Column(nullable = false, length = 40)
    private String eventType; // "TASK_COMPLETED", "IRRIGATION", "FERTILIZER_APPLIED", "SPRAY_APPLIED", "WEATHER_ALERT", "SYMPTOM_REPORTED", "STAGE_TRANSITION"

    @Column(nullable = false)
    private LocalDateTime eventTimestamp = LocalDateTime.now();

    @Column(nullable = false)
    private int cropAgeDays;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String payloadJson; // e.g. {"waterHours": 4, "fertilizer": "Urea", "quantityKg": 45}

    @Column(nullable = false, length = 20)
    private String loggedBy = "FARMER"; // "FARMER", "SYSTEM", "ADMIN"

    public CropEvent() {}

    public CropEvent(FarmerCrop farmerCrop, String eventType, int cropAgeDays, String title, String notes, String payloadJson, String loggedBy) {
        this.farmerCrop = farmerCrop;
        this.eventType = eventType;
        this.cropAgeDays = cropAgeDays;
        this.title = title;
        this.notes = notes;
        this.payloadJson = payloadJson;
        this.loggedBy = loggedBy != null ? loggedBy : "FARMER";
        this.eventTimestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FarmerCrop getFarmerCrop() { return farmerCrop; }
    public void setFarmerCrop(FarmerCrop farmerCrop) { this.farmerCrop = farmerCrop; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDateTime getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(LocalDateTime eventTimestamp) { this.eventTimestamp = eventTimestamp; }

    public int getCropAgeDays() { return cropAgeDays; }
    public void setCropAgeDays(int cropAgeDays) { this.cropAgeDays = cropAgeDays; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPayloadJson() { return payloadJson; }
    public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }

    public String getLoggedBy() { return loggedBy; }
    public void setLoggedBy(String loggedBy) { this.loggedBy = loggedBy; }
}

package com.agrisathi.dto;

import java.time.LocalDate;
import java.util.List;

public class DTOs {

    public static class OtpRequest {
        private String mobileNumber;
        private String email;

        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class VerifyOtpRequest {
        private String identifier; // mobile or email
        private String otp;
        private String preferredLanguage = "te";

        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }

    public static class AdminLoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String role;
        private String preferredLanguage;
        private String fullName;
        private boolean newUser;

        public AuthResponse(String token, Long userId, String role, String preferredLanguage, String fullName, boolean newUser) {
            this.token = token;
            this.userId = userId;
            this.role = role;
            this.preferredLanguage = preferredLanguage;
            this.fullName = fullName;
            this.newUser = newUser;
        }

        public String getToken() { return token; }
        public Long getUserId() { return userId; }
        public String getRole() { return role; }
        public String getPreferredLanguage() { return preferredLanguage; }
        public String getFullName() { return fullName; }
        public boolean isNewUser() { return newUser; }
    }

    public static class CropCreateRequest {
        private Long cropId;
        private String plotIdentifier;
        private LocalDate sowingDate;
        private String state;
        private String district;
        private String mandal;
        private Double landAreaAcres;

        public Long getCropId() { return cropId; }
        public void setCropId(Long cropId) { this.cropId = cropId; }
        public String getPlotIdentifier() { return plotIdentifier; }
        public void setPlotIdentifier(String plotIdentifier) { this.plotIdentifier = plotIdentifier; }
        public LocalDate getSowingDate() { return sowingDate; }
        public void setSowingDate(LocalDate sowingDate) { this.sowingDate = sowingDate; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getMandal() { return mandal; }
        public void setMandal(String mandal) { this.mandal = mandal; }
        public Double getLandAreaAcres() { return landAreaAcres; }
        public void setLandAreaAcres(Double landAreaAcres) { this.landAreaAcres = landAreaAcres; }
    }

    public static class ProblemReportRequest {
        private Long farmerCropId;
        private String symptomCategory; // "YELLOW_LEAVES", "LEAF_CURL", "BOLL_DAMAGE", "WILTING"
        private String affectedPart;
        private String symptomLocation; // "LOWER_OLD_LEAVES", "UPPER_NEW_LEAVES", "MOSAIC_PATCHES"
        private Boolean soilWaterlogged;
        private String description;

        public Long getFarmerCropId() { return farmerCropId; }
        public void setFarmerCropId(Long farmerCropId) { this.farmerCropId = farmerCropId; }
        public String getSymptomCategory() { return symptomCategory; }
        public void setSymptomCategory(String symptomCategory) { this.symptomCategory = symptomCategory; }
        public String getAffectedPart() { return affectedPart; }
        public void setAffectedPart(String affectedPart) { this.affectedPart = affectedPart; }
        public String getSymptomLocation() { return symptomLocation; }
        public void setSymptomLocation(String symptomLocation) { this.symptomLocation = symptomLocation; }
        public Boolean getSoilWaterlogged() { return soilWaterlogged; }
        public void setSoilWaterlogged(Boolean soilWaterlogged) { this.soilWaterlogged = soilWaterlogged; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class EventLogRequest {
        private String eventType;
        private String title;
        private String notes;
        private String payloadJson;

        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public String getPayloadJson() { return payloadJson; }
        public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }
    }
}

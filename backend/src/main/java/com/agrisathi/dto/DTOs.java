package com.agrisathi.dto;

import java.time.LocalDate;
import java.util.List;

public class DTOs {

    public static class OtpRequest {
        private String mobileNumber;
        private String email;
        private String identifier;

        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
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

    public static class ProfileUpdateRequest {
        private String fullName;
        private String state;
        private String district;
        private String mandal;
        private String village;
        private String pincode;
        private Double landAreaAcres;
        private String soilType;
        private String irrigationSource;
        private String preferredLanguage;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getMandal() { return mandal; }
        public void setMandal(String mandal) { this.mandal = mandal; }
        public String getVillage() { return village; }
        public void setVillage(String village) { this.village = village; }
        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
        public Double getLandAreaAcres() { return landAreaAcres; }
        public void setLandAreaAcres(Double landAreaAcres) { this.landAreaAcres = landAreaAcres; }
        public String getSoilType() { return soilType; }
        public void setSoilType(String soilType) { this.soilType = soilType; }
        public String getIrrigationSource() { return irrigationSource; }
        public void setIrrigationSource(String irrigationSource) { this.irrigationSource = irrigationSource; }
        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    }

    public static class ProfileResponse {
        private Long id;
        private Long userId;
        private String identifier;
        private String fullName;
        private String state;
        private String district;
        private String mandal;
        private String village;
        private String pincode;
        private Double landAreaAcres;
        private String soilType;
        private String irrigationSource;
        private String preferredLanguage;

        public ProfileResponse() {}

        public ProfileResponse(Long id, Long userId, String identifier, String fullName, String state, String district, String mandal, String village, String pincode, Double landAreaAcres, String soilType, String irrigationSource, String preferredLanguage) {
            this.id = id;
            this.userId = userId;
            this.identifier = identifier;
            this.fullName = fullName;
            this.state = state;
            this.district = district;
            this.mandal = mandal;
            this.village = village;
            this.pincode = pincode;
            this.landAreaAcres = landAreaAcres;
            this.soilType = soilType;
            this.irrigationSource = irrigationSource;
            this.preferredLanguage = preferredLanguage;
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getIdentifier() { return identifier; }
        public String getFullName() { return fullName; }
        public String getState() { return state; }
        public String getDistrict() { return district; }
        public String getMandal() { return mandal; }
        public String getVillage() { return village; }
        public String getPincode() { return pincode; }
        public Double getLandAreaAcres() { return landAreaAcres; }
        public String getSoilType() { return soilType; }
        public String getIrrigationSource() { return irrigationSource; }
        public String getPreferredLanguage() { return preferredLanguage; }
    }

    public static class KvkEscalationRequest {
        private String cropName;
        private String issueCategory;
        private String symptomsDescription;
        private String urgency;
        private String contactNumber;

        public String getCropName() { return cropName; }
        public void setCropName(String cropName) { this.cropName = cropName; }
        public String getIssueCategory() { return issueCategory; }
        public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }
        public String getSymptomsDescription() { return symptomsDescription; }
        public void setSymptomsDescription(String symptomsDescription) { this.symptomsDescription = symptomsDescription; }
        public String getUrgency() { return urgency; }
        public void setUrgency(String urgency) { this.urgency = urgency; }
        public String getContactNumber() { return contactNumber; }
        public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    }

    public static class KvkEscalationResponse {
        private Long id;
        private String farmerName;
        private String farmerState;
        private String farmerDistrict;
        private String cropName;
        private String issueCategory;
        private String symptomsDescription;
        private String urgency;
        private String status;
        private String officerNotes;
        private String contactNumber;
        private String createdAt;

        public KvkEscalationResponse() {}

        public KvkEscalationResponse(Long id, String farmerName, String farmerState, String farmerDistrict, String cropName, String issueCategory, String symptomsDescription, String urgency, String status, String officerNotes, String contactNumber, String createdAt) {
            this.id = id;
            this.farmerName = farmerName;
            this.farmerState = farmerState;
            this.farmerDistrict = farmerDistrict;
            this.cropName = cropName;
            this.issueCategory = issueCategory;
            this.symptomsDescription = symptomsDescription;
            this.urgency = urgency;
            this.status = status;
            this.officerNotes = officerNotes;
            this.contactNumber = contactNumber;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public String getFarmerName() { return farmerName; }
        public String getFarmerState() { return farmerState; }
        public String getFarmerDistrict() { return farmerDistrict; }
        public String getCropName() { return cropName; }
        public String getIssueCategory() { return issueCategory; }
        public String getSymptomsDescription() { return symptomsDescription; }
        public String getUrgency() { return urgency; }
        public String getStatus() { return status; }
        public String getOfficerNotes() { return officerNotes; }
        public String getContactNumber() { return contactNumber; }
        public String getCreatedAt() { return createdAt; }
    }

    public static class AlertResponse {
        private String id;
        private String priority; // HIGH, MEDIUM, INFO
        private String type; // WEATHER, SPRAY, IRRIGATION, TASK, GENERAL
        private String titleEn;
        private String titleTe;
        private String titleHi;
        private String messageEn;
        private String messageTe;
        private String messageHi;
        private String actionLink; // e.g., "WEATHER", "JOURNEY", "SOLVER"
        private String timestamp;

        public AlertResponse() {}

        public AlertResponse(String id, String priority, String type, String titleEn, String titleTe, String titleHi, String messageEn, String messageTe, String messageHi, String actionLink, String timestamp) {
            this.id = id;
            this.priority = priority;
            this.type = type;
            this.titleEn = titleEn;
            this.titleTe = titleTe;
            this.titleHi = titleHi;
            this.messageEn = messageEn;
            this.messageTe = messageTe;
            this.messageHi = messageHi;
            this.actionLink = actionLink;
            this.timestamp = timestamp;
        }

        public String getId() { return id; }
        public String getPriority() { return priority; }
        public String getType() { return type; }
        public String getTitleEn() { return titleEn; }
        public String getTitleTe() { return titleTe; }
        public String getTitleHi() { return titleHi; }
        public String getMessageEn() { return messageEn; }
        public String getMessageTe() { return messageTe; }
        public String getMessageHi() { return messageHi; }
        public String getActionLink() { return actionLink; }
        public String getTimestamp() { return timestamp; }
    }
}


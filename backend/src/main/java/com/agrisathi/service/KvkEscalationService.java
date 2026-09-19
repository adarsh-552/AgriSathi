package com.agrisathi.service;

import com.agrisathi.dto.DTOs.KvkEscalationRequest;
import com.agrisathi.dto.DTOs.KvkEscalationResponse;
import com.agrisathi.entity.FarmerProfile;
import com.agrisathi.entity.KvkEscalation;
import com.agrisathi.entity.User;
import com.agrisathi.repository.FarmerProfileRepository;
import com.agrisathi.repository.KvkEscalationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KvkEscalationService {

    private final KvkEscalationRepository escalationRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public KvkEscalationService(KvkEscalationRepository escalationRepository, FarmerProfileRepository farmerProfileRepository) {
        this.escalationRepository = escalationRepository;
        this.farmerProfileRepository = farmerProfileRepository;
    }

    @Transactional
    public KvkEscalationResponse createEscalation(Long userId, KvkEscalationRequest request) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user: " + userId));

        String defaultPhone = profile.getUser() != null
                ? (profile.getUser().getMobileNumber() != null ? profile.getUser().getMobileNumber() : profile.getUser().getEmail())
                : "9999999999";

        KvkEscalation escalation = new KvkEscalation(
                profile,
                request.getCropName() != null ? request.getCropName() : "General",
                request.getIssueCategory() != null ? request.getIssueCategory() : "PEST_DISEASE",
                request.getSymptomsDescription(),
                request.getUrgency() != null ? request.getUrgency() : "MEDIUM",
                request.getContactNumber() != null ? request.getContactNumber() : defaultPhone
        );

        KvkEscalation saved = escalationRepository.save(escalation);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<KvkEscalationResponse> getMyEscalations(Long userId) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Farmer profile not found for user: " + userId));

        return escalationRepository.findByFarmerProfileOrderByCreatedAtDesc(profile)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<KvkEscalationResponse> getAllEscalations() {
        return escalationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public KvkEscalationResponse updateStatus(Long id, String status, String officerNotes) {
        KvkEscalation escalation = escalationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Escalation ticket not found with id: " + id));

        if (status != null && !status.isBlank()) {
            escalation.setStatus(status.toUpperCase());
        }
        if (officerNotes != null) {
            escalation.setOfficerNotes(officerNotes);
        }
        escalation.setUpdatedAt(LocalDateTime.now());
        KvkEscalation saved = escalationRepository.save(escalation);
        return mapToResponse(saved);
    }

    private KvkEscalationResponse mapToResponse(KvkEscalation e) {
        FarmerProfile p = e.getFarmerProfile();
        String farmerName = p != null ? p.getFullName() : "Unknown";
        String state = p != null ? p.getState() : "";
        String district = p != null ? p.getDistrict() : "";

        return new KvkEscalationResponse(
                e.getId(),
                farmerName,
                state,
                district,
                e.getCropName(),
                e.getIssueCategory(),
                e.getSymptomsDescription(),
                e.getUrgency(),
                e.getStatus(),
                e.getOfficerNotes(),
                e.getContactNumber(),
                e.getCreatedAt() != null ? e.getCreatedAt().format(formatter) : ""
        );
    }
}

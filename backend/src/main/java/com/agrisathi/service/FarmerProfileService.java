package com.agrisathi.service;

import com.agrisathi.dto.DTOs;
import com.agrisathi.entity.FarmerProfile;
import com.agrisathi.entity.User;
import com.agrisathi.repository.FarmerProfileRepository;
import com.agrisathi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final UserRepository userRepository;

    public FarmerProfileService(FarmerProfileRepository farmerProfileRepository, UserRepository userRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
        this.userRepository = userRepository;
    }

    public DTOs.ProfileResponse getProfile(Long userId) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user: " + userId));

        User user = profile.getUser();
        String identifier = user.getMobileNumber() != null ? user.getMobileNumber() : user.getEmail();

        return new DTOs.ProfileResponse(
                profile.getId(),
                user.getId(),
                identifier,
                profile.getFullName(),
                profile.getState(),
                profile.getDistrict(),
                profile.getMandal(),
                profile.getVillage(),
                profile.getPincode(),
                profile.getLandAreaAcres(),
                profile.getSoilType(),
                profile.getIrrigationSource(),
                profile.getPreferredLanguage()
        );
    }

    @Transactional
    public DTOs.ProfileResponse updateProfile(Long userId, DTOs.ProfileUpdateRequest request) {
        FarmerProfile profile = farmerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user: " + userId));

        if (request.getFullName() != null) profile.setFullName(request.getFullName().trim());
        if (request.getState() != null) profile.setState(request.getState().trim());
        if (request.getDistrict() != null) profile.setDistrict(request.getDistrict().trim());
        if (request.getMandal() != null) profile.setMandal(request.getMandal().trim());
        if (request.getVillage() != null) profile.setVillage(request.getVillage().trim());
        if (request.getPincode() != null) profile.setPincode(request.getPincode().trim());
        if (request.getLandAreaAcres() != null) profile.setLandAreaAcres(request.getLandAreaAcres());
        if (request.getSoilType() != null) profile.setSoilType(request.getSoilType().trim());
        if (request.getIrrigationSource() != null) profile.setIrrigationSource(request.getIrrigationSource().trim());
        if (request.getPreferredLanguage() != null) profile.setPreferredLanguage(request.getPreferredLanguage().trim());

        profile = farmerProfileRepository.save(profile);

        User user = profile.getUser();
        String identifier = user.getMobileNumber() != null ? user.getMobileNumber() : user.getEmail();

        return new DTOs.ProfileResponse(
                profile.getId(),
                user.getId(),
                identifier,
                profile.getFullName(),
                profile.getState(),
                profile.getDistrict(),
                profile.getMandal(),
                profile.getVillage(),
                profile.getPincode(),
                profile.getLandAreaAcres(),
                profile.getSoilType(),
                profile.getIrrigationSource(),
                profile.getPreferredLanguage()
        );
    }
}

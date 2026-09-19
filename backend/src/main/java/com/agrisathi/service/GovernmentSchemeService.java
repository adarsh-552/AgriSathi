package com.agrisathi.service;

import com.agrisathi.entity.GovernmentScheme;
import com.agrisathi.repository.GovernmentSchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GovernmentSchemeService {

    private final GovernmentSchemeRepository schemeRepository;

    public GovernmentSchemeService(GovernmentSchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<GovernmentScheme> getSchemes(String state) {
        if (state != null && !state.isBlank()) {
            return schemeRepository.findApplicableSchemes(state.trim());
        }
        return schemeRepository.findByActiveTrueOrderByLastVerifiedDateDesc();
    }

    public GovernmentScheme getSchemeById(Long id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Scheme not found: " + id));
    }
}

package com.agrisathi.controller;

import com.agrisathi.entity.GovernmentScheme;
import com.agrisathi.service.GovernmentSchemeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schemes")
public class GovernmentSchemeController {

    private final GovernmentSchemeService schemeService;

    public GovernmentSchemeController(GovernmentSchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<List<GovernmentScheme>> getSchemes(@RequestParam(required = false) String state) {
        List<GovernmentScheme> schemes = schemeService.getSchemes(state);
        return ResponseEntity.ok(schemes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GovernmentScheme> getSchemeById(@PathVariable Long id) {
        GovernmentScheme scheme = schemeService.getSchemeById(id);
        return ResponseEntity.ok(scheme);
    }
}

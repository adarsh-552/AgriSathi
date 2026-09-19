package com.agrisathi.controller;

import com.agrisathi.entity.AgricultureContent;
import com.agrisathi.repository.AgricultureContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/knowledge")
public class KnowledgeController {

    private final AgricultureContentRepository contentRepository;

    public KnowledgeController(AgricultureContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @GetMapping
    public ResponseEntity<List<AgricultureContent>> getVerifiedKnowledge(
            @RequestParam(required = false) String search) {
        List<AgricultureContent> items = contentRepository.findByVerificationStatusOrderByUpdatedAtDesc("VERIFIED");
        if (items.isEmpty()) {
            items = contentRepository.findByVerificationStatusOrderByUpdatedAtDesc("PUBLISHED");
        }
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            items = items.stream().filter(c ->
                    (c.getTitleEn() != null && c.getTitleEn().toLowerCase().contains(q)) ||
                    (c.getTitleTe() != null && c.getTitleTe().toLowerCase().contains(q)) ||
                    (c.getBodyEn() != null && c.getBodyEn().toLowerCase().contains(q)) ||
                    (c.getSourceInstitution() != null && c.getSourceInstitution().toLowerCase().contains(q))
            ).toList();
        }
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgricultureContent> getKnowledgeById(@PathVariable Long id) {
        AgricultureContent content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Knowledge content not found: " + id));
        return ResponseEntity.ok(content);
    }
}

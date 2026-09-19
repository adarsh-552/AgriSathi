package com.agrisathi.service;

import com.agrisathi.entity.AgricultureContent;
import com.agrisathi.entity.AuditLog;
import com.agrisathi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final AgricultureContentRepository contentRepository;
    private final MarketDataRepository marketDataRepository;
    private final AuditLogRepository auditLogRepository;
    private final KvkEscalationRepository kvkEscalationRepository;

    public AdminService(UserRepository userRepository, CropRepository cropRepository, AgricultureContentRepository contentRepository, MarketDataRepository marketDataRepository, AuditLogRepository auditLogRepository, KvkEscalationRepository kvkEscalationRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.contentRepository = contentRepository;
        this.marketDataRepository = marketDataRepository;
        this.auditLogRepository = auditLogRepository;
        this.kvkEscalationRepository = kvkEscalationRepository;
    }

    public Map<String, Object> getSystemOverview() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFarmers", userRepository.count());
        stats.put("activeCropsCount", cropRepository.count());
        stats.put("verifiedContentsCount", contentRepository.count());
        stats.put("mandiRecordsCount", marketDataRepository.count());
        stats.put("totalEscalationsCount", kvkEscalationRepository.count());
        stats.put("recentAuditLogs", auditLogRepository.findAllByOrderByCreatedAtDesc());
        return stats;
    }


    @Transactional
    public AgricultureContent publishContent(Long contentId, String adminEmail, String ipAddress) {
        AgricultureContent content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("Content not found: " + contentId));

        content.setVerificationStatus("PUBLISHED");
        content.setVerifiedBy(adminEmail);
        content.setUpdatedAt(LocalDateTime.now());
        content = contentRepository.save(content);

        AuditLog log = new AuditLog(
                adminEmail,
                "PUBLISH_AGRI_CONTENT",
                "AgricultureContent",
                content.getId(),
                ipAddress,
                "Published verified agronomic content: " + content.getTitleEn() + " with citation: " + content.getScientificCitation()
        );
        auditLogRepository.save(log);

        return content;
    }
}

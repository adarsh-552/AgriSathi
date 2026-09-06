package com.agrisathi.controller;

import com.agrisathi.entity.AgricultureContent;
import com.agrisathi.security.UserPrincipal;
import com.agrisathi.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        return ResponseEntity.ok(adminService.getSystemOverview());
    }

    @PostMapping("/contents/{id}/publish")
    public ResponseEntity<AgricultureContent> publishContent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletRequest request) {
        AgricultureContent content = adminService.publishContent(id, principal.getUsername(), request.getRemoteAddr());
        return ResponseEntity.ok(content);
    }
}

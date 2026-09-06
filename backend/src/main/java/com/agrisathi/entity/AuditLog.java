package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String actorEmail;

    @Column(nullable = false, length = 50)
    private String actionName; // e.g. "PUBLISH_AGRI_CONTENT", "UPDATE_MANDI_PRICE"

    @Column(nullable = false, length = 50)
    private String targetEntity;

    private Long targetEntityId;

    @Column(length = 45)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AuditLog() {}

    public AuditLog(String actorEmail, String actionName, String targetEntity, Long targetEntityId, String ipAddress, String details) {
        this.actorEmail = actorEmail;
        this.actionName = actionName;
        this.targetEntity = targetEntity;
        this.targetEntityId = targetEntityId;
        this.ipAddress = ipAddress;
        this.details = details;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActionName() { return actionName; }
    public void setActionName(String actionName) { this.actionName = actionName; }

    public String getTargetEntity() { return targetEntity; }
    public void setTargetEntity(String targetEntity) { this.targetEntity = targetEntity; }

    public Long getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(Long targetEntityId) { this.targetEntityId = targetEntityId; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

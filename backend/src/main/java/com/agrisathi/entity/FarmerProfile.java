package com.agrisathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_profiles")
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String fullName;

    @Column(nullable = false, length = 10)
    private String preferredLanguage = "te"; // "te", "hi", "en"

    @Column(length = 50)
    private String state;

    @Column(length = 50)
    private String district;

    @Column(length = 50)
    private String mandal;

    @Column(length = 100)
    private String village;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FarmerProfile() {}

    public FarmerProfile(User user, String fullName, String preferredLanguage, String state, String district, String mandal) {
        this.user = user;
        this.fullName = fullName;
        this.preferredLanguage = preferredLanguage != null ? preferredLanguage : "te";
        this.state = state;
        this.district = district;
        this.mandal = mandal;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getMandal() { return mandal; }
    public void setMandal(String mandal) { this.mandal = mandal; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

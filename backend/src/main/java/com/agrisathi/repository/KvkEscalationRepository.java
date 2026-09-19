package com.agrisathi.repository;

import com.agrisathi.entity.FarmerProfile;
import com.agrisathi.entity.KvkEscalation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KvkEscalationRepository extends JpaRepository<KvkEscalation, Long> {
    List<KvkEscalation> findByFarmerProfileOrderByCreatedAtDesc(FarmerProfile farmerProfile);
    List<KvkEscalation> findAllByOrderByCreatedAtDesc();
}

package com.agrisathi.repository;
import com.agrisathi.entity.AgricultureContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgricultureContentRepository extends JpaRepository<AgricultureContent, Long> {
    Optional<AgricultureContent> findByContentCode(String contentCode);
    List<AgricultureContent> findByVerificationStatus(String verificationStatus);
}

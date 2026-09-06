package com.agrisathi.repository;
import com.agrisathi.entity.ProblemDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProblemDiagnosisRepository extends JpaRepository<ProblemDiagnosis, Long> {
    Optional<ProblemDiagnosis> findByCropProblemId(Long cropProblemId);
}

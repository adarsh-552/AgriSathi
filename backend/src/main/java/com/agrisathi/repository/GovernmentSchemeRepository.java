package com.agrisathi.repository;

import com.agrisathi.entity.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, Long> {

    Optional<GovernmentScheme> findBySchemeCode(String schemeCode);

    List<GovernmentScheme> findByActiveTrueOrderByLastVerifiedDateDesc();

    @Query("SELECT s FROM GovernmentScheme s WHERE s.active = true AND (s.stateApplicability = 'ALL_INDIA' OR LOWER(s.stateApplicability) = LOWER(:state)) ORDER BY s.id ASC")
    List<GovernmentScheme> findApplicableSchemes(@Param("state") String state);
}

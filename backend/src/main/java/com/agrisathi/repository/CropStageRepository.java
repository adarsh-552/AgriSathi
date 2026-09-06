package com.agrisathi.repository;
import com.agrisathi.entity.CropStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CropStageRepository extends JpaRepository<CropStage, Long> {
    List<CropStage> findByCropIdOrderByStageSequenceAsc(Long cropId);
    Optional<CropStage> findByCropIdAndStageCode(Long cropId, String stageCode);
}

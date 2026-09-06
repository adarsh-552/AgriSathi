package com.agrisathi.repository;
import com.agrisathi.entity.CropTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CropTaskRepository extends JpaRepository<CropTask, Long> {
    List<CropTask> findByCropStageIdOrderByDayOffsetAsc(Long cropStageId);
}

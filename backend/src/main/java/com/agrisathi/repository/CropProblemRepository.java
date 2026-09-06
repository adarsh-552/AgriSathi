package com.agrisathi.repository;
import com.agrisathi.entity.CropProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CropProblemRepository extends JpaRepository<CropProblem, Long> {
    List<CropProblem> findByFarmerCropIdOrderByCreatedAtDesc(Long farmerCropId);
}

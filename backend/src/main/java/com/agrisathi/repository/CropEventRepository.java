package com.agrisathi.repository;
import com.agrisathi.entity.CropEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CropEventRepository extends JpaRepository<CropEvent, Long> {
    List<CropEvent> findByFarmerCropIdOrderByEventTimestampDesc(Long farmerCropId);
    List<CropEvent> findByFarmerCropId(Long farmerCropId);
}

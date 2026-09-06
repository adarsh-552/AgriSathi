package com.agrisathi.repository;
import com.agrisathi.entity.FarmerCrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FarmerCropRepository extends JpaRepository<FarmerCrop, Long> {
    List<FarmerCrop> findByFarmerProfileIdAndStatus(Long farmerProfileId, String status);
    List<FarmerCrop> findByFarmerProfileId(Long farmerProfileId);
}

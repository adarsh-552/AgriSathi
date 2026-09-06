package com.agrisathi.repository;
import com.agrisathi.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    Optional<Crop> findByCropCode(String cropCode);
    List<Crop> findByActiveTrue();
}

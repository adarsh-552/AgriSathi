package com.agrisathi.repository;
import com.agrisathi.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByDistrictOrderByForecastDateAsc(String district);
    Optional<WeatherData> findFirstByDistrictAndForecastDate(String district, LocalDate forecastDate);
}

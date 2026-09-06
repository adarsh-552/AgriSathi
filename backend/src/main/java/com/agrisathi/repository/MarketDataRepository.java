package com.agrisathi.repository;
import com.agrisathi.entity.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    List<MarketData> findByMarketNameOrderByPriceDateDesc(String marketName);
    List<MarketData> findByDistrictOrderByPriceDateDesc(String district);
}

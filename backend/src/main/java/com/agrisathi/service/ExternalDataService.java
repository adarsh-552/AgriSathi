package com.agrisathi.service;

import com.agrisathi.entity.MarketData;
import com.agrisathi.entity.WeatherData;
import com.agrisathi.repository.MarketDataRepository;
import com.agrisathi.repository.WeatherDataRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExternalDataService {

    private final WeatherDataRepository weatherDataRepository;
    private final MarketDataRepository marketDataRepository;

    public ExternalDataService(WeatherDataRepository weatherDataRepository, MarketDataRepository marketDataRepository) {
        this.weatherDataRepository = weatherDataRepository;
        this.marketDataRepository = marketDataRepository;
    }

    public List<WeatherData> getDistrictWeather(String district) {
        String searchDistrict = (district != null && !district.isBlank()) ? district : "Kurnool";
        List<WeatherData> list = weatherDataRepository.findByDistrictOrderByForecastDateAsc(searchDistrict);
        if (list.isEmpty()) {
            return weatherDataRepository.findByDistrictOrderByForecastDateAsc("Kurnool");
        }
        return list;
    }

    public List<MarketData> getMandiPrices(String district) {
        String searchDistrict = (district != null && !district.isBlank()) ? district : "Kurnool";
        List<MarketData> list = marketDataRepository.findByDistrictOrderByPriceDateDesc(searchDistrict);
        if (list.isEmpty()) {
            return marketDataRepository.findByDistrictOrderByPriceDateDesc("Kurnool");
        }
        return list;
    }
}

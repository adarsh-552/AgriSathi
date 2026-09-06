package com.agrisathi.controller;

import com.agrisathi.entity.MarketData;
import com.agrisathi.entity.WeatherData;
import com.agrisathi.service.ExternalDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/external")
public class ExternalDataController {

    private final ExternalDataService externalDataService;

    public ExternalDataController(ExternalDataService externalDataService) {
        this.externalDataService = externalDataService;
    }

    @GetMapping("/weather")
    public ResponseEntity<List<WeatherData>> getWeather(@RequestParam(required = false, defaultValue = "Kurnool") String district) {
        return ResponseEntity.ok(externalDataService.getDistrictWeather(district));
    }

    @GetMapping("/market-prices")
    public ResponseEntity<List<MarketData>> getMarketPrices(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String market) {
        String queryDistrict = district != null && !district.isBlank() ? district : market;
        return ResponseEntity.ok(externalDataService.getMandiPrices(queryDistrict));
    }
}

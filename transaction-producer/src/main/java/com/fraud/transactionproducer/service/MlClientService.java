package com.fraud.transactionproducer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MlClientService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public MlClientService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> predictFraud(Map<String, Object> transaction) {
        try {
            return restTemplate.postForObject(
                    mlServiceUrl + "/predict",
                    transaction,
                    Map.class
            );
        } catch (Exception ex) {
            ex.printStackTrace();
            return Map.of(
                    "fraud", "UNKNOWN",
                    "confidence", 0.0,
                    "source", "ML_FALLBACK"
            );
        }
    }
}


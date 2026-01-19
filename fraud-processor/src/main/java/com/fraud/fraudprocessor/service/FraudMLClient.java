package com.fraud.fraudprocessor.service;

import com.fraud.fraudprocessor.dto.FraudPredictionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FraudMLClient {

    private final RestTemplate restTemplate;
    private final String mlServiceUrl;

    public FraudMLClient(RestTemplate restTemplate, @Value("${ML_SERVICE_URL:http://ml-service:8000}") String mlServiceUrl) {
        this.restTemplate = restTemplate;
        this.mlServiceUrl = mlServiceUrl;
    }

    public FraudPredictionResponse predict(Map<String, Object> payload) {
        return restTemplate.postForObject(
                mlServiceUrl + "/predict",
                payload,
                FraudPredictionResponse.class
        );
    }
}

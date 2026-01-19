package com.fraud.fraudprocessor.controller;

import com.fraud.fraudprocessor.entity.FraudPrediction;
import com.fraud.fraudprocessor.repository.FraudPredictionRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fraud")
public class FraudPredictionController {

    private final FraudPredictionRepository repository;

    public FraudPredictionController(FraudPredictionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/predictions")
    public List<FraudPrediction> getAllPredictions() {
        return repository.findAll();
    }
}

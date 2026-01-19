package com.fraud.fraudprocessor.repository;

import com.fraud.fraudprocessor.entity.FraudPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudPredictionRepository
        extends JpaRepository<FraudPrediction, Long> {
}

package com.fraud.fraudprocessor.dto;

public class FraudPredictionResponse {
    private boolean fraud;
    private double confidence;

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}

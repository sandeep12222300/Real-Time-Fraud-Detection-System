package com.fraud.transactionproducer.dto;

public class FraudResponse {

    private String transactionId;
    private boolean fraud;
    private double confidence;

    public FraudResponse(String transactionId, boolean fraud, double confidence) {
        this.transactionId = transactionId;
        this.fraud = fraud;
        this.confidence = confidence;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public boolean isFraud() {
        return fraud;
    }

    public double getConfidence() {
        return confidence;
    }
}

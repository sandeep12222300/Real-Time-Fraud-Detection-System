package com.fraud.fraudprocessor.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "fraud_predictions",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "transaction_id")
        }
)
public class FraudPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, unique = true)
    private String transactionId;

    private Double amount;
    private Boolean fraud;
    private Double confidence;

    // getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Boolean getFraud() {
        return fraud;
    }

    public void setFraud(Boolean fraud) {
        this.fraud = fraud;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}

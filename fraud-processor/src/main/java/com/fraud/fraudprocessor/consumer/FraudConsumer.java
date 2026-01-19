package com.fraud.fraudprocessor.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fraud.fraudprocessor.dto.FraudPredictionResponse;
import com.fraud.fraudprocessor.entity.FraudPrediction;
import com.fraud.fraudprocessor.repository.FraudPredictionRepository;
import com.fraud.fraudprocessor.service.FraudMLClient;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.HashMap;
import java.util.Map;

@Component
public class FraudConsumer {

    private final FraudPredictionRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final FraudMLClient fraudMLClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String DLQ_TOPIC = "transactions.DLQ";
    private static final Logger logger = LoggerFactory.getLogger(FraudConsumer.class);

    public FraudConsumer(FraudPredictionRepository repository,
                         KafkaTemplate<String, String> kafkaTemplate,
                         FraudMLClient fraudMLClient) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
        this.fraudMLClient = fraudMLClient;
    }

    @KafkaListener(topics = "transactions", groupId = "fraud-processor-group")
    public void consume(String message) {

        logger.debug("⬇️ Received message from Kafka: {}", message);

        try {
            JsonNode json = objectMapper.readTree(message);

            // Safe reads using path(...) to avoid NPEs
            String transactionId = json.path("transactionId").asText(null);
            if (transactionId == null || transactionId.isEmpty()) {
                logger.error("Missing transactionId, moving message to DLQ: {}", message);
                kafkaTemplate.send(DLQ_TOPIC, message);
                return;
            }

            double amount = json.path("amount").asDouble(0.0);
            String merchant = json.path("merchant").asText("");
            String location = json.path("location").asText("");
            String timestamp = json.path("timestamp").asText("");

            Map<String, Object> payload = new HashMap<>();
            payload.put("transactionId", transactionId);
            payload.put("amount", amount);
            payload.put("merchant", merchant);
            payload.put("location", location);
            payload.put("timestamp", timestamp);

            // Call ML client (instance) and fallback to heuristic if needed
            FraudPredictionResponse mlResponse = null;
            try {
                if (fraudMLClient != null) {
                    mlResponse = fraudMLClient.predict(payload);
                } else {
                    logger.warn("FraudMLClient bean not available, using heuristic");
                }
            } catch (Exception mlEx) {
                logger.error("Error calling FraudMLClient for tx={}", transactionId, mlEx);
            }

            boolean fraudFlag;
            double confidence;
            if (mlResponse != null) {
                fraudFlag = mlResponse.isFraud();
                confidence = mlResponse.getConfidence();
            } else {
                // simple heuristic fallback
                fraudFlag = amount > 10000;
                confidence = 0.0;
            }

            FraudPrediction prediction = new FraudPrediction();
            prediction.setTransactionId(transactionId);
            prediction.setAmount(amount);
            prediction.setFraud(fraudFlag);
            prediction.setConfidence(confidence);

            repository.save(prediction);
            logger.info("✅ Saved to DB tx={}, fraud={}, confidence={}", transactionId, fraudFlag, confidence);

        } catch (DataIntegrityViolationException ex) {
            logger.warn("Duplicate transaction ignored: {}", ex.getMessage());
        } catch (Exception e) {
            logger.error("Processing error - moving message to DLQ", e);
            kafkaTemplate.send(DLQ_TOPIC, message);
        }
    }
}
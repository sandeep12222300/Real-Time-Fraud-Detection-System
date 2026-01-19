package com.fraud.transactionproducer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class TransactionProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${kafka.topic.transactions}")
    private String topic;

    public TransactionProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(Map<String, Object> transaction) {
        try {
            String key = transaction.get("transactionId").toString();
            String value = objectMapper.writeValueAsString(transaction);

            // send synchronously so callers (e.g., Postman) get immediate feedback on failures
            kafkaTemplate.send(topic, key, value).get();
            System.out.println("✅ Kafka ACK received for " + key);

        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Kafka publish interrupted", ie);
        } catch (ExecutionException ee) {
            throw new RuntimeException("Kafka publish failed", ee.getCause());
        } catch (Exception e) {
            throw new RuntimeException("Kafka publish failed", e);
        }
    }

}

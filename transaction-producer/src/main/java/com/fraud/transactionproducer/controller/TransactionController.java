package com.fraud.transactionproducer.controller;

import com.fraud.transactionproducer.service.MlClientService;
import com.fraud.transactionproducer.service.TransactionProducerService;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.Map;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionProducerService producerService;
    private final MlClientService mlClientService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TransactionController(TransactionProducerService producerService,
                                 MlClientService mlClientService) {
        this.producerService = producerService;
        this.mlClientService = mlClientService;
    }

    @PostMapping
    public Map<String, Object> publishTransaction(@RequestBody Map<String, Object> transaction) {

        System.out.println("➡️ Incoming transaction: " + transaction);

        try {
            producerService.send(transaction);
            System.out.println("✅ Sent to Kafka");
        } catch (Exception e) {
            System.err.println("❌ Kafka send failed");
            e.printStackTrace();
        }

        Map<String, Object> prediction;
        try {
            prediction = mlClientService.predictFraud(transaction);
            System.out.println("✅ ML prediction received: " + prediction);
        } catch (Exception e) {
            System.err.println("❌ ML call failed completely");
            e.printStackTrace();
            prediction = Map.of(
                    "fraud", "UNKNOWN",
                    "confidence", 0.0,
                    "source", "CONTROLLER_FALLBACK"
            );
        }

        return Map.of(
                "transaction", transaction,
                "fraudResult", prediction,
                "status", "PROCESSED"
        );
    }

}
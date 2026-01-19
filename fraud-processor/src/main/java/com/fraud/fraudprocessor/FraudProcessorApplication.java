package com.fraud.fraudprocessor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.fraud.fraudprocessor.entity")
@EnableJpaRepositories("com.fraud.fraudprocessor.repository")
public class FraudProcessorApplication {

	public static void main(String[] args) {
		SpringApplication.run(FraudProcessorApplication.class, args);
	}
}

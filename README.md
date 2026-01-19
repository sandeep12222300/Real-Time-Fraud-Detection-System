# 🛡️ Real-Time Fraud Detection System

<div align="center">

![CI Status](https://github.com/sandeep12222300/Real-Time-Fraud-Detection-System/workflows/CI%20-%20Build%20&%20Validate/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36?logo=apachemaven&logoColor=white)

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?logo=fastapi&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?logo=scikitlearn&logoColor=white)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

![Kafka](https://img.shields.io/badge/Apache%20Kafka-7.5.0-231F20?logo=apachekafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

**A production-ready microservices-based fraud detection system that processes transactions in real-time using machine learning**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Monitoring & Observability](#-monitoring--observability)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Real-Time Fraud Detection System** is a comprehensive, enterprise-grade solution designed to detect fraudulent transactions in real-time. Built using modern microservices architecture, it leverages Apache Kafka for event streaming, machine learning for fraud prediction, and provides an intuitive dashboard for monitoring and analysis.

### Key Highlights

- ⚡ **Real-time Processing**: Sub-second transaction analysis using Apache Kafka
- 🤖 **ML-Powered**: Intelligent fraud detection using machine learning models
- 📊 **Interactive Dashboard**: React-based dashboard with live metrics and visualizations
- 🔄 **Event-Driven**: Scalable event-driven architecture
- 🐳 **Docker-Ready**: Complete containerization with Docker Compose
- 🏗️ **Production-Ready**: Health checks, monitoring, and resource management

---

## ✨ Features

### Core Capabilities

- **Real-Time Transaction Processing**
  - Event-driven architecture using Apache Kafka
  - Asynchronous transaction validation
  - Low-latency fraud detection (< 100ms)

- **Machine Learning Integration**
  - FastAPI-based ML service
  - Logistic regression model for fraud prediction
  - Confidence scoring for each prediction
  - Scalable model training pipeline

- **Comprehensive Dashboard**
  - Real-time KPI metrics (total transactions, fraud rate, etc.)
  - Interactive data visualizations using Recharts
  - Transaction history with filtering capabilities
  - Auto-refresh functionality
  - Responsive design

- **Robust Data Management**
  - PostgreSQL for persistent storage
  - Transaction history tracking
  - Fraud prediction logging
  - ACID compliance

- **Production Features**
  - Health check endpoints for all services
  - Docker container orchestration
  - Resource limits and monitoring
  - Horizontal scalability

---

## 🏗️ Architecture

The system follows a microservices architecture with the following components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Real-Time Fraud Detection System             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│  Fraud Dashboard │◄────────│ Fraud Processor  │
│   (React App)    │         │  (Spring Boot)   │
│    Port: 3000    │         │    Port: 8082    │
└──────────────────┘         └────────┬─────────┘
                                      │
                                      │ Consumes
                                      │
                    ┌─────────────────▼─────────────────┐
                    │      Apache Kafka Cluster         │
                    │         Port: 9092                 │
                    └─────────────────▲─────────────────┘
                                      │
                                      │ Produces
                                      │
                    ┌─────────────────┴─────────────────┐
                    │   Transaction Producer            │
                    │      (Spring Boot)                │
                    │        Port: 8081                 │
                    └─────────────────┬─────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
             ┌──────▼────────┐              ┌─────────▼────────┐
             │   ML Service   │              │   PostgreSQL    │
             │   (FastAPI)    │              │    Database     │
             │   Port: 8000   │              │   Port: 5432    │
             └────────────────┘              └─────────────────┘
```

### Component Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Transaction Producer** | Spring Boot | Generates and publishes transactions to Kafka |
| **Fraud Processor** | Spring Boot + Kafka Streams | Consumes transactions, calls ML service, stores results |
| **ML Service** | Python FastAPI | Provides fraud prediction API using ML models |
| **Fraud Dashboard** | React + Recharts | Web UI for monitoring and visualization |
| **Apache Kafka** | Confluent Platform | Message broker for event streaming |
| **PostgreSQL** | PostgreSQL 15 | Persistent data storage |
| **Zookeeper** | Apache Zookeeper | Kafka cluster coordination |

---

## 🛠️ Technology Stack

### Backend Services

- **Java 17** - Spring Boot microservices
- **Spring Boot 3.x** - Framework for fraud-processor and transaction-producer
- **Spring Kafka** - Kafka integration
- **Spring Data JPA** - Data persistence layer
- **Maven** - Build and dependency management

### Machine Learning Service

- **Python 3.11** - Runtime environment
- **FastAPI** - High-performance API framework
- **Scikit-learn** - Machine learning library
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **XGBoost** - Gradient boosting library

### Frontend

- **React 19** - UI framework
- **Recharts 3.x** - Data visualization
- **Create React App** - Toolchain

### Infrastructure

- **Apache Kafka 7.5.0** - Message streaming
- **PostgreSQL 15** - Relational database
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (v20.10+)
  - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+)
  - Included with Docker Desktop
- **Git** (v2.0+)
  - [Install Git](https://git-scm.com/downloads)

### Optional (for local development)

- **Java 17** - [Install JDK](https://adoptium.net/)
- **Maven 3.8+** - [Install Maven](https://maven.apache.org/install.html)
- **Python 3.11** - [Install Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Install Node.js](https://nodejs.org/)

---

## 🚀 Quick Start

Get the system up and running in under 5 minutes:

### 1. Clone the Repository

```bash
git clone https://github.com/sandeep12222300/Real-Time-Fraud-Detection-System.git
cd Real-Time-Fraud-Detection-System
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_DB=frauddb
POSTGRES_USER=frauduser
POSTGRES_PASSWORD=fraudpass123

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

### 3. Start All Services

```bash
docker compose up -d
```

This command will:
- Pull all required Docker images
- Start Zookeeper, Kafka, PostgreSQL
- Deploy all microservices
- Launch the fraud dashboard

### 4. Access the Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Fraud Detection Dashboard with real-time metrics and transaction data.

### 5. Verify Services

Check that all services are healthy:

```bash
# Check container status
docker compose ps

# Check logs
docker compose logs -f
```

Expected output: All containers should show "healthy" status.

---

## 📚 Detailed Setup

### Building from Source

If you want to build the services locally before deploying:

#### Build Java Services

```bash
# Build Fraud Processor
cd fraud-processor
mvn clean package -DskipTests
cd ..

# Build Transaction Producer
cd transaction-producer
mvn clean package -DskipTests
cd ..
```

#### Build ML Service

```bash
cd fraud-ml-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model (optional)
python train_model.py

# Run the service locally
uvicorn app:app --reload --port 8000
```

#### Build Dashboard

```bash
cd fraud-dashboard

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Docker Build

Build Docker images locally:

```bash
# Build all images
docker build -t fraud-processor:local ./fraud-processor
docker build -t transaction-producer:local ./transaction-producer
docker build -t fraud-ml-service:local ./fraud-ml-service
docker build -t fraud-dashboard:local ./fraud-dashboard
```

### Using Kafka Only

If you want to run only Kafka infrastructure:

```bash
docker compose -f docker-compose-kafka.yml up -d
```

---

## 📡 API Documentation

### Transaction Producer API

**Base URL:** `http://localhost:8081`

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "UP"
}
```

### Fraud Processor API

**Base URL:** `http://localhost:8082`

#### Health Check
```http
GET /health
```

#### Get All Fraud Predictions
```http
GET /api/predictions
```

**Response:**
```json
[
  {
    "id": 1,
    "transactionId": "txn-123",
    "amount": 15000.00,
    "merchant": "Electronics Store",
    "location": "New York",
    "timestamp": "2024-01-19T10:30:00",
    "fraud": true,
    "confidence": 0.87
  }
]
```

#### Get Prediction by Transaction ID
```http
GET /api/predictions/{transactionId}
```

### ML Service API

**Base URL:** `http://localhost:8000`

#### Health Check
```http
GET /health
```

#### Predict Fraud
```http
POST /predict
Content-Type: application/json

{
  "transactionId": "txn-123",
  "amount": 15000.00,
  "merchant": "Electronics Store",
  "location": "New York",
  "timestamp": "2024-01-19T10:30:00"
}
```

**Response:**
```json
{
  "fraud": true,
  "confidence": 0.87
}
```

#### API Documentation (Swagger)
```
http://localhost:8000/docs
```

---

## 📁 Project Structure

```
Real-Time-Fraud-Detection-System/
│
├── fraud-processor/                 # Kafka consumer & fraud processing service
│   ├── src/main/java/
│   │   └── com/fraud/fraudprocessor/
│   │       ├── consumer/            # Kafka consumer logic
│   │       ├── controller/          # REST controllers
│   │       ├── entity/              # JPA entities
│   │       ├── repository/          # Data repositories
│   │       └── service/             # Business logic
│   ├── src/main/resources/
│   │   └── application.yml          # Configuration
│   ├── Dockerfile
│   └── pom.xml
│
├── transaction-producer/            # Transaction generation service
│   ├── src/main/java/
│   │   └── com/fraud/transactionproducer/
│   │       ├── controller/          # REST controllers
│   │       ├── model/               # Domain models
│   │       └── service/             # Business logic
│   ├── src/main/resources/
│   │   └── application.yml          # Configuration
│   ├── Dockerfile
│   └── pom.xml
│
├── fraud-ml-service/                # Machine learning service
│   ├── app.py                       # FastAPI application
│   ├── train_model.py               # Model training script
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile
│
├── fraud-dashboard/                 # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── DataTable.js         # Transaction table
│   │   │   ├── KpiCard.jsx          # KPI cards
│   │   │   └── Badge.jsx            # Status badges
│   │   ├── api/                     # API clients
│   │   ├── hooks/                   # Custom React hooks
│   │   └── App.js                   # Root component
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline
│
├── docker-compose.yml               # Full stack orchestration
├── docker-compose-kafka.yml         # Kafka only
├── .gitignore
└── README.md
```

---

## 🧪 Testing

### Running Tests

#### Java Services Tests

```bash
# Test Fraud Processor
cd fraud-processor
mvn test

# Test Transaction Producer
cd transaction-producer
mvn test
```

#### ML Service Tests

```bash
cd fraud-ml-service
pytest
```

#### Dashboard Tests

```bash
cd fraud-dashboard
npm test
```

### Integration Testing

```bash
# Start all services
docker compose up -d

# Wait for services to be healthy
docker compose ps

# Test transaction flow
curl -X POST http://localhost:8081/api/transactions

# Check fraud predictions
curl http://localhost:8082/api/predictions

# Test ML service
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "test-123",
    "amount": 25000,
    "merchant": "Test Store",
    "location": "Test City",
    "timestamp": "2024-01-19T10:00:00"
  }'
```

### Load Testing

```bash
# Use Apache Bench for load testing
ab -n 1000 -c 10 http://localhost:8000/health
```

---

## 📊 Monitoring & Observability

### Health Checks

All services expose health check endpoints:

```bash
# ML Service
curl http://localhost:8000/health

# Transaction Producer
curl http://localhost:8081/health

# Fraud Processor
curl http://localhost:8082/health
```

### Docker Health Status

```bash
# Check all container health
docker compose ps

# View logs for a specific service
docker compose logs -f fraud-processor

# View resource usage
docker stats
```

### Kafka Monitoring

```bash
# List Kafka topics
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list

# Check consumer groups
docker exec -it kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list

# View topic details
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic transactions
```

### Database Monitoring

```bash
# Connect to PostgreSQL
docker exec -it postgres psql -U frauduser -d frauddb

# View tables
\dt

# Query fraud predictions
SELECT * FROM fraud_predictions LIMIT 10;
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Services fail to start

**Solution:**
```bash
# Clean up and restart
docker compose down -v
docker compose up -d

# Check logs
docker compose logs -f
```

#### Issue: Kafka connection errors

**Solution:**
```bash
# Ensure Kafka is healthy
docker compose ps kafka

# Restart Kafka
docker compose restart kafka
```

#### Issue: Database connection failures

**Solution:**
```bash
# Check database status
docker compose ps postgres

# Verify environment variables
cat .env

# Restart PostgreSQL
docker compose restart postgres
```

#### Issue: Port conflicts

**Solution:**
```bash
# Check if ports are in use
lsof -i :3000  # Dashboard
lsof -i :8081  # Transaction Producer
lsof -i :8082  # Fraud Processor
lsof -i :8000  # ML Service
lsof -i :9092  # Kafka

# Stop conflicting services or modify port mappings in docker-compose.yml
```

#### Issue: Out of memory errors

**Solution:**
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or reduce resource limits in docker-compose.yml
```

### Debug Mode

Enable debug logging for Spring Boot services:

```yaml
# application.yml
logging:
  level:
    com.fraud: DEBUG
    org.springframework.kafka: DEBUG
```

### Logs

View logs for troubleshooting:

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f fraud-processor

# Last 100 lines
docker compose logs --tail=100 fraud-processor
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/sandeep12222300/Real-Time-Fraud-Detection-System.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Ensure CI passes

### Code Style Guidelines

- **Java**: Follow Spring Boot conventions
- **Python**: Follow PEP 8 style guide
- **JavaScript**: Follow Airbnb style guide
- **Commits**: Use conventional commits format

### Development Setup

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Run linters
mvn checkstyle:check  # Java
flake8 .              # Python
npm run lint          # JavaScript
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Apache Kafka community for excellent streaming platform
- Spring Boot team for the robust framework
- FastAPI for the high-performance Python framework
- React team for the amazing frontend library

---

## 📞 Support

For questions or issues:

- **Issues**: [GitHub Issues](https://github.com/sandeep12222300/Real-Time-Fraud-Detection-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandeep12222300/Real-Time-Fraud-Detection-System/discussions)

---

<div align="center">

**Made with ❤️ by the Fraud Detection Team**

⭐ Star this repository if you find it helpful!

</div>

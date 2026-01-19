from fastapi import FastAPI
from pydantic import BaseModel
import math

app = FastAPI()

class Transaction(BaseModel):
    transactionId: str
    amount: float
    merchant: str
    location: str
    timestamp: str

class PredictionResponse(BaseModel):
    fraud: bool
    confidence: float

@app.get("/health")
def health():
    return {"status": "UP"}


@app.post("/predict", response_model=PredictionResponse)
def predict(tx: Transaction):
    # Simple logistic regression–style probability
    score = 0.00005 * tx.amount - 0.4
    probability = 1 / (1 + math.exp(-score))

    return {
        "fraud": probability > 0.5,
        "confidence": round(probability, 2)
    }

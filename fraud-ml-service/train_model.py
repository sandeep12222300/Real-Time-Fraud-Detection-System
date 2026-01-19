import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import pickle

data = {
    "amount": [500, 2000, 8000, 12000, 25000, 40000, 1000, 30000],
    "fraud":  [0,    0,    0,     1,     1,     1,     0,     1]
}

df = pd.DataFrame(data)

X = df[["amount"]]
y = df["fraud"]

# ✅ Pipeline = scaler + model
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X, y)

with open("fraud_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("✅ Scaled model trained and saved")

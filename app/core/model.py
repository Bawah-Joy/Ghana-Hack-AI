import joblib
from app.schemas.predict import InputData, PredictionResponse

model = joblib.load("model/classifier.pkl")

def get_prediction(data: InputData) -> PredictionResponse:
    pred = model.predict([data.text])[0]
    prob = max(model.predict_proba([data.text])[0])
    return PredictionResponse(label=pred, confidence=round(prob, 3))

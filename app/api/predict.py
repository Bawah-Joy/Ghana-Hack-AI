from fastapi import APIRouter
from app.schemas.predict import InputData, PredictionResponse
from app.core.model import get_prediction

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(data: InputData):
    return get_prediction(data)

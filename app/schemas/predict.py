from pydantic import BaseModel

class InputData(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float

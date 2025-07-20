from pydantic import BaseModel
from typing import List, Optional


class Recommendation(BaseModel):
    description: str
    symptoms: List[str]
    treatment: str
    prevention: str
    message: str

class PredictRequest(BaseModel):
    model_name: str
    # text: str = None        # for text pipelines
class PredictResponse(BaseModel):
    model: str
    label: str
    confidence: float
    recommendation: Recommendation


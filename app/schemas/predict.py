from pydantic import BaseModel

class PredictRequest(BaseModel):
    model_name: str
    # text: str = None        # for text pipelines
class PredictResponse(BaseModel):
    model: str
    label: str
    confidence: float

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from app.schemas.predict import PredictRequest, PredictResponse
from app.core.model import predict as kpredict

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict(
    model_name: str = Form(...),
    # text: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    try:
        req = PredictRequest(model_name=model_name)
        return await kpredict(req, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

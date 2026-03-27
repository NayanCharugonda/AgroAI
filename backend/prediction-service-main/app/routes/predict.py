from fastapi import APIRouter, UploadFile, File, Header, Form, HTTPException
from app.services.model_service import infer
from app.services.auth_service import verify_token
from app.services.db_service import fetch_disease_by_model_label
from app.models.schemas import PredictionResponse, PredictionResult
import uuid

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_route(
    file: UploadFile = File(...),
    Authorization: str | None = Header(None),
    lat: float | None = Form(None),
    lon: float | None = Form(None),
    consent_location: bool | None = Form(False)
):
    
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    model_label, confidence = infer(contents)
    disease_doc = await fetch_disease_by_model_label(model_label)
    if disease_doc:
        disease_id = disease_doc.get("diseaseID") or model_label
        disease_name = disease_doc.get("disease_name") or model_label
    else:
        disease_id = model_label
        disease_name = model_label
        disease_doc = {
            "diseaseID": disease_id,
            "disease_name": disease_name,
            "description": "",
            "care_advices": "",
            "symptoms": "",
            "causes": "",
            "spread_mechanisms": ""
        }

    user = await verify_token(Authorization)
    user_id = user.get("id") if user else None
    save_needed = bool(user_id) and (confidence >= 0.5)

    request_id = str(uuid.uuid4())

    prediction = PredictionResult(
        disease_id=str(disease_id),
        disease_name=str(disease_name),
        confidence=round(confidence, 4)
    )

    resp = {
        "prediction": prediction.dict(),
        "confidence": round(confidence, 4),
        "disease_data": disease_doc,
        "request_id": request_id,
        "save_needed": save_needed
    }
    return resp

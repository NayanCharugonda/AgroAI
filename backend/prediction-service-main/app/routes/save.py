from fastapi import APIRouter, Depends, Header, HTTPException
from app.models.schemas import SavePredictionRequest
from app.core.config import INTERNAL_API_KEY
from app.services.db_service import save_prediction_record

router = APIRouter()

def require_internal_key(x_internal_api_key: str | None = Header(None)):
    if not INTERNAL_API_KEY or x_internal_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid internal API key")

@router.post("/save", dependencies=[Depends(require_internal_key)])
async def save_prediction(payload: SavePredictionRequest):
    doc = payload.dict()
    saved = await save_prediction_record(doc)
    return {"ok": True, "saved": True, "record": saved}

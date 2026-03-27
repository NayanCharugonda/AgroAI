from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URI, DB_NAME, MODEL_CLASS_TO_DISEASE_ID
import datetime
from typing import Dict, Any, Tuple, List, Optional
import re

_client = None
db = None

def init_db():
    global _client, db
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI)
        db = _client[DB_NAME]
    return db

async def fetch_disease_by_model_label(model_label: str):
    db = init_db()
    disease_id = MODEL_CLASS_TO_DISEASE_ID.get(model_label)
    if disease_id:
        doc = await db.disease.find_one({"disease_id": disease_id})
        if doc:
            doc["_id"] = str(doc["_id"])
            return doc

    return None

def _to_jsonable(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    doc = dict(doc) 
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def fetch_diseases(
    limit: int = 100,
    skip: int = 0,
    plant: Optional[str] = None,
    disease_id: Optional[str] = None,
    q: Optional[str] = None,
) -> Tuple[List[Dict[str, Any]], int]:
    db = init_db()
    coll = db.disease

    query: Dict[str, Any] = {}

    if disease_id:
        query["disease_id"] = disease_id

    if plant:
        query["plant_name"] = {"$regex": re.escape(plant), "$options": "i"}

    if q:
        q_regex = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [
            {"disease_name": q_regex},
            {"description": q_regex}
        ]

    total = await coll.count_documents(query)

    cursor = coll.find(query).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    docs = [_to_jsonable(d) for d in docs]

    return docs, total

async def fetch_disease_by_id(disease_id: str) -> Optional[Dict[str, Any]]:
    db = init_db()
    doc = await db.disease.find_one({"disease_id": disease_id})
    return _to_jsonable(doc) if doc else None

async def save_prediction_record(payload: dict):
    db = init_db()
    request_id = payload.get("request_id")
    if request_id:
        existing = await db.predictions.find_one({"request_id": request_id})
        if existing:
            return existing 
    payload.setdefault("created_at", datetime.datetime.utcnow())
    res = await db.predictions.insert_one(payload)
    return await db.predictions.find_one({"_id": res.inserted_id})

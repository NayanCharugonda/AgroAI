from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.services.db_service import fetch_diseases, fetch_disease_by_id

router = APIRouter()

@router.get("/diseases")
async def get_diseases(
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0),
    plant: Optional[str] = Query(None, description="Filter by plant name (partial)"),
    disease_id: Optional[str] = Query(None, description="Exact diseaseID (e.g. D001)"),
    q: Optional[str] = Query(None, description="Search in disease_name & description"),
    include_count: bool = Query(False, description="If true, include total count in response")
):
    try:
        docs, total = await fetch_diseases(limit=limit, skip=skip, plant=plant, disease_id=disease_id, q=q)
        response = {"items": docs}
        if include_count:
            response["total"] = total
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/diseases/{disease_id}")
async def get_disease(disease_id: str):
    doc = await fetch_disease_by_id(disease_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Disease not found")
    return doc

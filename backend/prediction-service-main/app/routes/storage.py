from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class LocationRequest(BaseModel):
    lat: float
    lng: float

class StorageResponse(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity: str
    available: bool
    distance: str
    type: str

@router.post("/nearby-storages", response_model=List[StorageResponse])
async def get_nearby_storages(req: LocationRequest):
    # Mock data with some coordinates close to the provided lat/lng
    # In a real app, this would be a database query using distance formula
    mock_storages = [
        {
            "id": "1",
            "name": "Grain Storage Complex",
            "latitude": req.lat + 0.005,
            "longitude": req.lng + 0.005,
            "capacity": "5000 tonnes",
            "available": True,
            "distance": "0.5 km",
            "type": "Cold Storage"
        },
        {
            "id": "2",
            "name": "AgriWare Facility",
            "latitude": req.lat - 0.008,
            "longitude": req.lng + 0.012,
            "capacity": "3000 tonnes",
            "available": True,
            "distance": "1.2 km",
            "type": "Warehouse"
        },
        {
            "id": "3",
            "name": "Green Valley Storage",
            "latitude": req.lat + 0.015,
            "longitude": req.lng - 0.005,
            "capacity": "8000 tonnes",
            "available": False,
            "distance": "2.1 km",
            "type": "Silo"
        },
        {
            "id": "4",
            "name": "FarmFresh Cold Hub",
            "latitude": req.lat - 0.002,
            "longitude": req.lng - 0.01,
            "capacity": "2000 tonnes",
            "available": True,
            "distance": "0.8 km",
            "type": "Cold Storage"
        }
    ]
    
    return mock_storages

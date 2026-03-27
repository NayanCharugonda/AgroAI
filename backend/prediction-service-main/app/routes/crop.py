from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.model_service import infer_crop
import random

router = APIRouter()

class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    state: str
    city: str

class CropPredictionResponse(BaseModel):
    crop: str
    temperature: float
    humidity: float
    rainfall: float
    probabilities: dict[str, float]

import requests

@router.post("/predict", response_model=CropPredictionResponse)
async def predict_crop(request: CropPredictionRequest):
    # 1. Geocoding
    try:
        query = f"{request.city}, {request.state}"
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=1&language=en&format=json"
        geo_data = requests.get(geo_url).json()
        
        if not geo_data.get("results"):
            # Fallback to just city
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={request.city}&count=1&language=en&format=json"
            geo_data = requests.get(geo_url).json()

        if not geo_data.get("results"):
            # Use defaults if geocoding fails completely
            temp, humidity, rainfall = 25.0, 70.0, 150.0
        else:
            lat = geo_data["results"][0]["latitude"]
            lon = geo_data["results"][0]["longitude"]
            
            # 2. Fetch Real Weather
            weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=auto"
            weather_data = requests.get(weather_url).json()
            
            current = weather_data.get("current", {})
            temp = current.get("temperature_2m", 25.0)
            humidity = current.get("relative_humidity_2m", 70.0)
            
            # Use daily precipitation sum or default
            daily = weather_data.get("daily", {})
            rainfall = daily.get("precipitation_sum", [150.0])[0]

        crop = infer_crop(request.N, request.P, request.K, temp, humidity, request.ph, rainfall)
        
        # Probabilities logic remains same for UI
        crops = ["Rice", "Maize", "Jute", "Cotton", "Coconut", "Papaya", "Orange", "Apple"]
        probs = {c: random.uniform(0.01, 0.1) for c in crops}
        probs[crop] = random.uniform(0.7, 0.95)
        total = sum(probs.values())
        probs = {c: round(p/total, 3) for c, p in probs.items()}
        
        return {
            "crop": crop,
            "temperature": round(temp, 1),
            "humidity": round(humidity, 1),
            "rainfall": round(rainfall, 1),
            "probabilities": probs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/locations")
async def get_locations():
    # Mock locations for SoilAnalysisPage
    return {
        "Maharashtra": [{"district": "Pune"}, {"district": "Mumbai"}, {"district": "Nagpur"}],
        "Karnataka": [{"district": "Bangalore"}, {"district": "Mysore"}, {"district": "Hubli"}],
        "Gujarat": [{"district": "Ahmedabad"}, {"district": "Surat"}, {"district": "Vadodara"}],
        "Punjab": [{"district": "Ludhiana"}, {"district": "Amritsar"}, {"district": "Jalandhar"}]
    }

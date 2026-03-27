from pydantic import BaseModel
from typing import Optional, Dict, Any

class PredictionResult(BaseModel):
    disease_id: str
    disease_name: str
    confidence: float

class PredictionResponse(BaseModel):
    prediction: PredictionResult
    confidence: float
    disease_data: Dict[str, Any]
    request_id: str
    save_needed: bool

class SavePredictionRequest(BaseModel):
    request_id: str
    user_id: str
    cloudinary_url: str
    prediction: Dict[str, Any]
    disease_data: Dict[str, Any]
    weather: Optional[Dict[str, Any]] = None
    tailored_advice: Optional[str] = None

class LoginRequest(BaseModel):
    identifier: str
    password: Optional[str] = "password"

class SignupRequest(BaseModel):
    username: str
    password: str
    location: Optional[str] = "Delhi, India"

class AuthResponse(BaseModel):
    username: str
    access_token: str

class VerifyResponse(BaseModel):
    user: Optional[Dict[str, Any]] = None

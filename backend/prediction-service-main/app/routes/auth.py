from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import LoginRequest, SignupRequest, AuthResponse, VerifyResponse
import jwt
import datetime

router = APIRouter()

# Simple secret for demo purposes
SECRET_KEY = "vasundhara-secret-key"

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    # In a real app, verify against DB. For demo, we allow any login.
    token = jwt.encode({
        "sub": request.identifier,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")
    
    return AuthResponse(
        username=request.identifier,
        access_token=token
    )

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    # In a real app, create user in DB.
    token = jwt.encode({
        "sub": request.username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, SECRET_KEY, algorithm="HS256")
    
    return AuthResponse(
        username=request.username,
        access_token=token
    )

@router.get("/verify", response_model=VerifyResponse)
async def verify(Authorization: str | None = Header(None)):
    if not Authorization:
        return VerifyResponse(user=None)
    
    try:
        # Expected format: "Bearer <token>" or just "<token>"
        token = Authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        
        return VerifyResponse(user={
            "id": username,
            "name": username,
            "location": "Delhi, India"
        })
    except Exception:
        return VerifyResponse(user=None)

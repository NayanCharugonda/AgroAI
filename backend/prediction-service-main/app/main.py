from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, save, disease, crop, prices, auth, storage
from app.services.db_service import init_db
from app.services.model_service import load_model

app = FastAPI(title="Prediction Service")

origins = [
    "https://0hffhpwh-5173.inc1.devtunnels.ms",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.10.13.192:5173",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8001",
    "http://127.0.0.1:8002",
    "http://127.0.0.1:8003",
    "http://127.0.0.1:8004",
    "http://127.0.0.1:8005",
    "http://127.0.0.1:8006",
    "http://127.0.0.1:8007",
    "http://127.0.0.1:8400",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "Prediction service is up and running"}

app.include_router(predict.router, prefix="/api/v1", tags=["predict"])
app.include_router(save.router, prefix="/api/v1", tags=["save"])
app.include_router(disease.router, prefix="/api/v1", tags=["diseases"])
app.include_router(crop.router, prefix="/api/v1/crop", tags=["crop"])
app.include_router(prices.router, prefix="/api/v1/prices", tags=["prices"])
app.include_router(storage.router, prefix="/api/v1", tags=["storage"])
app.include_router(auth.router, prefix="", tags=["auth"])

@app.on_event("startup")
async def startup_event():
    init_db()
    load_model()

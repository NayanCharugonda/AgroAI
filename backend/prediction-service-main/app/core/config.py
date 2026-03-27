import os

MONGO_URI = os.getenv("MONGODB_URL", "mongodb+srv://pulinduv:Orientpax12345@cluster0.uqf1b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB_NAME = os.getenv("DB_NAME", "test")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "d02adb458a6abc8d1f1df3e63c7d8fbeb1294bc3f03b516c61ea675c6578d560")
MODEL_PATH = os.getenv("MODEL_PATH", "./models/plant_disease_cnn_v3.h5")
CROP_MODEL_PATH = os.getenv("CROP_MODEL_PATH", "./models/crop_model.pkl")
CROP_SCALER_PATH = os.getenv("CROP_SCALER_PATH", "./models/standscaler.pkl")
CROP_MINMAX_PATH = os.getenv("CROP_MINMAX_PATH", "./models/minmaxscaler.pkl")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "8"))
CLASSNAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___healthy",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",  
    "Grape___healthy",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___healthy",
    "Potato___Late_blight",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___healthy",
    "Strawberry___Leaf_scorch",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___healthy",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus"
]

MODEL_CLASS_TO_DISEASE_ID = {
     'Apple___Black_rot': "D001",
     'Bean_rust': "D002",
     'Grape___Black_rot' : "D006",
     'Peach___Bacterial_spot' : "D007",
     'Pepper,_bell___Bacterial_spot' : "D008",
     'Potato___Early_blight' : "D009",
     'Strawberry___Leaf_scorch' : "D010",
     'Tea_brown_blight' : "D011",
     'Tomato___Early_blight' : "D012",
     'Tomato___Target_Spot' : "D013",
     'Apple___Apple_scab': "D014",
     'Apple___Cedar_apple_rust': "D015",
     'Cherry_(including_sour)___Powdery_mildew': "D003",
     'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': "D005",
     'Corn_(maize)___Common_rust_': "D016",
     'Corn_(maize)___Northern_Leaf_Blight': "D017",
     'Grape___Esca_(Black_Measles)': "D018",
     'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': "D019",
     'Orange___Haunglongbing_(Citrus_greening)': "D020",
     'Potato___Late_blight': "D021",
     'Squash___Powdery_mildew': "D022",
     'Tomato___Bacterial_spot': "D023",
     'Tomato___Late_blight': "D024",
     'Tomato___Leaf_Mold': "D025",
     'Tomato___Septoria_leaf_spot': "D026",
     'Tomato___Spider_mites Two-spotted_spider_mite': "D027",
     'Tomato___Tomato_mosaic_virus': "D028",
     'Tomato___Tomato_Yellow_Leaf_Curl_Virus': "D029",
}


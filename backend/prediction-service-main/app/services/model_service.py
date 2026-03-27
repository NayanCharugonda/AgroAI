import io
from PIL import Image
import numpy as np
import tensorflow as tf
import pickle
import pandas as pd
from app.core.config import MODEL_PATH, CROP_MODEL_PATH, CROP_SCALER_PATH, CROP_MINMAX_PATH

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


_model = None

def load_model():
    global _model
    if _model is None:
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model

def preprocess_image_bytes(image_bytes: bytes, size=(128,128)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(size)
    arr = np.array(img).astype(np.float32) 
    arr = np.expand_dims(arr, axis=0)
    return arr

def infer(image_bytes: bytes):
    model = load_model()
    x = preprocess_image_bytes(image_bytes)
    preds = model.predict(x)
    preds = np.asarray(preds).squeeze()
    idx = int(np.argmax(preds))
    label = CLASSNAMES[idx] if idx < len(CLASSNAMES) else str(idx)
    confidence = float(np.max(preds))
    return label, confidence
_crop_model = None
_crop_sc = None
_crop_mx = None

def load_crop_models():
    global _crop_model, _crop_sc, _crop_mx
    if _crop_model is None:
        _crop_model = pickle.load(open(CROP_MODEL_PATH, 'rb'))
        _crop_sc = pickle.load(open(CROP_SCALER_PATH, 'rb'))
        _crop_mx = pickle.load(open(CROP_MINMAX_PATH, 'rb'))
    return _crop_model, _crop_sc, _crop_mx

def infer_crop(N, P, K, temp, humidity, ph, rainfall):
    model, sc, mx = load_crop_models()
    feature_list = [N, P, K, temp, humidity, ph, rainfall]
    single_pred = np.array(feature_list).reshape(1, -1)
    
    mx_features = mx.transform(single_pred)
    sc_mx_features = sc.transform(mx_features)
    prediction = model.predict(sc_mx_features)
    
    crop_dict = {1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
                 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
                 14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
                 19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"}
    
    if prediction[0] in crop_dict:
        return crop_dict[prediction[0]]
    return "Unknown"

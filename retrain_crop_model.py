import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.ensemble import RandomForestClassifier

# Load data
df = pd.read_csv('backend/Crop_Recommendation-main/Crop_Recommendation-main/Crop_recommendation.csv')

# Mapping dictionary from notebook
crop_dict = {
    'rice': 1, 'maize': 2, 'jute': 3, 'cotton': 4, 'coconut': 5, 'papaya': 6, 'orange': 7, 'apple': 8,
    'muskmelon': 9, 'watermelon': 10, 'grapes': 11, 'mango': 12, 'banana': 13, 'pomegranate': 14,
    'lentil': 15, 'blackgram': 16, 'mungbean': 17, 'mothbeans': 18, 'pigeonpeas': 19,
    'kidneybeans': 20, 'chickpea': 21, 'coffee': 22
}
df['label'] = df['label'].map(crop_dict)

X = df.drop('label', axis=1)
y = df['label']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale
mx = MinMaxScaler()
X_train_mx = mx.fit_transform(X_train)

sc = StandardScaler()
X_train_sc = sc.fit_transform(X_train_mx)

# Train
model = RandomForestClassifier()
model.fit(X_train_sc, y_train)

# Save
pickle.dump(model, open('backend/prediction-service-main/models/crop_model.pkl', 'wb'))
pickle.dump(sc, open('backend/prediction-service-main/models/standscaler.pkl', 'wb'))
pickle.dump(mx, open('backend/prediction-service-main/models/minmaxscaler.pkl', 'wb'))

print("Models retrained and saved successfully to backend/prediction-service-main/models/")

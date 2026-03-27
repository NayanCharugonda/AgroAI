import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    print("Testing Health Check...")
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_crop_locations():
    print("\nTesting Crop Locations...")
    try:
        response = requests.get(f"{BASE_URL}/crop/locations")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

def test_crop_predict():
    print("\nTesting Crop Prediction...")
    payload = {
        "N": 90,
        "P": 42,
        "K": 43,
        "ph": 6.5,
        "state": "Maharashtra",
        "city": "Pune"
    }
    try:
        response = requests.post(f"{BASE_URL}/crop/predict", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Ensure the backend is running at http://localhost:8000")
    test_health()
    test_crop_locations()
    test_crop_predict()

import requests

def test_ai_endpoint():
    url = "http://127.0.0.1:5000/api/ai"
    payload = {"message": "Tell me about rice", "lang": "en"}
    try:
        response = requests.post(url, json=payload, timeout=60)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ai_endpoint()

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def test_ollama():
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": "phi",
            "prompt": "Say hello",
            "stream": False
        }, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ollama()

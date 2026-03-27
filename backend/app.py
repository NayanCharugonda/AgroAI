from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

def ask_ollama(prompt):
    try:
        start_time = time.time()
        print(f"--- Sending request to Ollama: {prompt[:50]}... ---")
        
        response = requests.post(OLLAMA_URL, json={
            "model": "phi:latest",
            "prompt": f"You are an agricultural expert. Answer simply for farmers.\n{prompt}",
            "stream": False
        }, timeout=30)
        
        duration = time.time() - start_time
        print(f"--- Ollama responded in {duration:.2f}s ---")
        
        if response.status_code != 200:
            print(f"Ollama error: {response.status_code} - {response.text}")
            return "Sorry, I'm having trouble connecting to my brain right now."
            
        return response.json()["response"]
    except requests.exceptions.Timeout:
        print("Ollama request timed out.")
        return "I'm thinking a bit too slow today. Please try again in a moment."
    except Exception as e:
        print(f"Ollama error: {e}")
        return "Sorry, I'm feeling a bit disconnected."

@app.route("/")
def home():
    return "Backend is running ✅"

@app.route("/ai", methods=["POST"])
def ai():
    try:
        data = request.get_json()
        message = data.get("message", "")
        lang = data.get("lang", "en")
        
        print(f"\n[AI Request] Lang: {lang} | Message: {message}")
        
        reply = ask_ollama(message)
        
        print(f"[AI Reply] {reply[:100]}...")
        return jsonify({"reply": reply})
            
    except Exception as e:
        print(f"Internal Error: {e}")
        return jsonify({"reply": "Server error. Please try again."})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
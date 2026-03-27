FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel

RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY models/disease_detection.keras models/disease_detection.keras
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
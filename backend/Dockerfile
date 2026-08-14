FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Migrations should be run via an entrypoint script at runtime, not build time
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

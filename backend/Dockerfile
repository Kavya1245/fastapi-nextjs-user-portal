FROM python:3.11-slim
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and shared directories
COPY backend/ .
COPY shared/ /shared/

# Create non-root user
RUN useradd -m appuser
USER appuser

# Run migrations at runtime via entrypoint
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

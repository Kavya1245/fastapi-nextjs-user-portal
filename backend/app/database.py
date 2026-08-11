from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# The engine connects to PostgreSQL. pool_pre_ping ensures connections are alive before use.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# SessionLocal is used to create database sessions for each API request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the foundational class for all our SQLAlchemy models.
Base = declarative_base()

def get_db():
    """FastAPI dependency that yields a database session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.config import settings
from app.main import app
from fastapi.testclient import TestClient

# Use the dedicated PostgreSQL test database
TEST_DATABASE_URL = settings.TEST_DATABASE_URL
test_engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def client():
    # Create tables in the test DB before each test
    Base.metadata.create_all(bind=test_engine)
    
    def override_get_db():
        db = TestingSessionLocal()
        try: yield db
        finally: db.close()
            
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    
    # Drop tables and clear overrides after each test
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)

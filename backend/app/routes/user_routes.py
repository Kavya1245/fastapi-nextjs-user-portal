from fastapi import APIRouter
from app.controllers.user_controller import router as user_router

api_router = APIRouter()
api_router.include_router(user_router, prefix="/api", tags=["users"])

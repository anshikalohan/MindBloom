from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, moods, journal
from database import connect_to_mongo, close_mongo_connection
import os

app = FastAPI(
    title="MindBloom API",
    description="Mental Health & Mood Tracker Backend",
    version="1.0.0"
)

# CORS - allow frontend dev server
cors_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]
if os.getenv("CORS_ORIGINS"):
    cors_origins.extend(os.getenv("CORS_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup / shutdown DB connection
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(moods.router, prefix="/api/moods", tags=["Moods"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])

@app.get("/")
async def root():
    return {"message": "MindBloom API is running 🌸"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "MindBloom API"}
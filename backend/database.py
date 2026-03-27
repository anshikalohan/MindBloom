import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mindbloom")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Create database connection on startup."""
    db_instance.client = AsyncIOMotorClient(MONGO_URL)
    db_instance.db = db_instance.client[DB_NAME]
    print(f"✅ Connected to MongoDB: {DB_NAME}")

async def close_mongo_connection():
    """Close database connection on shutdown."""
    if db_instance.client:
        db_instance.client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    """Return the database instance."""
    return db_instance.db
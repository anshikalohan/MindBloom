from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId
from database import get_database
from models.schemas import UserCreate, UserLogin, Token, UserResponse
from middleware.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


def serialize_user(user: dict) -> dict:
    """Convert MongoDB user document to serializable dict."""
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db=Depends(get_database)):
    """Register a new user."""
    # Check if email already exists
    existing = await db["users"].find_one({"email": user_data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user document
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow(),
    }

    result = await db["users"].insert_one(new_user)
    new_user["_id"] = result.inserted_id

    # Generate JWT token
    token = create_access_token({"sub": str(result.inserted_id)})
    return Token(
        access_token=token,
        user=UserResponse(**serialize_user(new_user))
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db=Depends(get_database)):
    """Authenticate user and return JWT token."""
    user = await db["users"].find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": str(user["_id"])})
    return Token(
        access_token=token,
        user=UserResponse(**serialize_user(user))
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Get current authenticated user's profile."""
    return UserResponse(**serialize_user(current_user))
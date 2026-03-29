from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ─── Enums ────────────────────────────────────────────────────────────────────

class MoodType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    NEUTRAL = "neutral"
    TIRED = "tired"
    ANXIOUS = "anxious"
    EXCITED = "excited"
    GRATEFUL = "grateful"

# ─── Auth Schemas ──────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ─── Mood Schemas ──────────────────────────────────────────────────────────────

class MoodCreate(BaseModel):
    mood: MoodType
    intensity: int = Field(default=5, ge=1, le=10)  # 1-10 scale
    note: Optional[str] = Field(None, max_length=500)

class MoodResponse(BaseModel):
    id: str
    user_id: str
    mood: str
    intensity: int
    note: Optional[str]
    created_at: datetime

class MoodUpdate(BaseModel):
    mood: Optional[MoodType] = None
    intensity: Optional[int] = Field(None, ge=1, le=10)
    note: Optional[str] = Field(None, max_length=500)

# ─── Journal Schemas ───────────────────────────────────────────────────────────

class JournalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    tags: Optional[List[str]] = Field(default_factory=list)
    mood: Optional[MoodType] = None

class JournalResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    tags: List[str]
    mood: Optional[str]
    created_at: datetime
    updated_at: datetime

class JournalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None
    mood: Optional[MoodType] = None

# ─── Analytics Schemas ─────────────────────────────────────────────────────────

class MoodStats(BaseModel):
    mood: str
    count: int
    percentage: float

class WeeklyData(BaseModel):
    date: str
    mood: Optional[str]
    intensity: Optional[int]

class AnalyticsResponse(BaseModel):
    streak: int
    total_entries: int
    mood_distribution: List[MoodStats]
    weekly_data: List[WeeklyData]
    most_common_mood: Optional[str]
from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
from database import get_database
from models.schemas import MoodCreate, MoodResponse, MoodUpdate, AnalyticsResponse
from middleware.auth import get_current_user

router = APIRouter()


def serialize_mood(mood: dict) -> dict:
    return {
        "id": str(mood["_id"]),
        "user_id": str(mood["user_id"]),
        "mood": mood["mood"],
        "intensity": mood.get("intensity", 5),
        "note": mood.get("note"),
        "created_at": mood["created_at"],
    }


@router.post("/", response_model=MoodResponse, status_code=status.HTTP_201_CREATED)
async def log_mood(
    mood_data: MoodCreate,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Log a new mood entry."""
    entry = {
        "user_id": current_user["_id"],
        "mood": mood_data.mood.value,
        "intensity": mood_data.intensity,
        "note": mood_data.note,
        "created_at": datetime.utcnow(),
    }
    result = await db["moods"].insert_one(entry)
    entry["_id"] = result.inserted_id
    return MoodResponse(**serialize_mood(entry))


@router.get("/", response_model=List[MoodResponse])
async def get_moods(
    limit: int = 30,
    skip: int = 0,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Get user's mood entries (paginated, newest first)."""
    cursor = db["moods"].find(
        {"user_id": current_user["_id"]}
    ).sort("created_at", -1).skip(skip).limit(limit)

    moods = []
    async for mood in cursor:
        moods.append(MoodResponse(**serialize_mood(mood)))
    return moods


@router.get("/today")
async def get_today_mood(
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Get today's mood entry (most recent of today)."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    mood = await db["moods"].find_one(
        {"user_id": current_user["_id"], "created_at": {"$gte": today_start}},
        sort=[("created_at", -1)]
    )
    if not mood:
        return {"mood": None}
    return {"mood": MoodResponse(**serialize_mood(mood))}


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Get mood analytics: streak, distribution, weekly data."""
    user_id = current_user["_id"]

    # Fetch last 30 days of entries
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    cursor = db["moods"].find(
        {"user_id": user_id, "created_at": {"$gte": thirty_days_ago}}
    ).sort("created_at", -1)

    entries = []
    async for entry in cursor:
        entries.append(entry)

    total_entries = len(entries)

    # Calculate streak (consecutive days with at least one entry)
    streak = 0
    if entries:
        dates = set()
        for e in entries:
            dates.add(e["created_at"].date())

        current_date = datetime.utcnow().date()
        while current_date in dates:
            streak += 1
            current_date -= timedelta(days=1)

    # Mood distribution
    mood_counts = {}
    for e in entries:
        mood_counts[e["mood"]] = mood_counts.get(e["mood"], 0) + 1

    mood_distribution = []
    for mood, count in mood_counts.items():
        mood_distribution.append({
            "mood": mood,
            "count": count,
            "percentage": round((count / total_entries * 100) if total_entries else 0, 1)
        })

    # Weekly data (last 7 days)
    weekly_data = []
    for i in range(6, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)

        day_entry = next(
            (e for e in entries if day_start <= e["created_at"] <= day_end),
            None
        )

        weekly_data.append({
            "date": day.strftime("%a"),
            "mood": day_entry["mood"] if day_entry else None,
            "intensity": day_entry.get("intensity") if day_entry else None,
        })

    most_common = max(mood_counts, key=mood_counts.get) if mood_counts else None

    return AnalyticsResponse(
        streak=streak,
        total_entries=total_entries,
        mood_distribution=mood_distribution,
        weekly_data=weekly_data,
        most_common_mood=most_common,
    )


@router.put("/{mood_id}", response_model=MoodResponse)
async def update_mood(
    mood_id: str,
    mood_data: MoodUpdate,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Update a mood entry."""
    try:
        oid = ObjectId(mood_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid mood ID")

    mood = await db["moods"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not mood:
        raise HTTPException(status_code=404, detail="Mood entry not found")

    update_data = {k: v for k, v in mood_data.dict().items() if v is not None}
    if "mood" in update_data:
        update_data["mood"] = update_data["mood"].value

    await db["moods"].update_one({"_id": oid}, {"$set": update_data})
    updated = await db["moods"].find_one({"_id": oid})
    return MoodResponse(**serialize_mood(updated))


@router.delete("/{mood_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mood(
    mood_id: str,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Delete a mood entry."""
    try:
        oid = ObjectId(mood_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid mood ID")

    result = await db["moods"].delete_one({"_id": oid, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mood entry not found")
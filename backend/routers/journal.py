from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from database import get_database
from models.schemas import JournalCreate, JournalResponse, JournalUpdate
from middleware.auth import get_current_user

router = APIRouter()


def serialize_journal(entry: dict) -> dict:
    return {
        "id": str(entry["_id"]),
        "user_id": str(entry["user_id"]),
        "title": entry["title"],
        "content": entry["content"],
        "tags": entry.get("tags", []),
        "mood": entry.get("mood"),
        "created_at": entry["created_at"],
        "updated_at": entry.get("updated_at", entry["created_at"]),
    }


@router.post("/", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry_data: JournalCreate,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Create a new journal entry."""
    now = datetime.utcnow()
    entry = {
        "user_id": current_user["_id"],
        "title": entry_data.title,
        "content": entry_data.content,
        "tags": entry_data.tags or [],
        "mood": entry_data.mood.value if entry_data.mood else None,
        "created_at": now,
        "updated_at": now,
    }
    result = await db["journal"].insert_one(entry)
    entry["_id"] = result.inserted_id
    return JournalResponse(**serialize_journal(entry))


@router.get("/", response_model=List[JournalResponse])
async def get_entries(
    limit: int = 20,
    skip: int = 0,
    tag: Optional[str] = None,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Get journal entries, optionally filtered by tag."""
    query = {"user_id": current_user["_id"]}
    if tag:
        query["tags"] = {"$in": [tag]}

    cursor = db["journal"].find(query).sort("created_at", -1).skip(skip).limit(limit)

    entries = []
    async for entry in cursor:
        entries.append(JournalResponse(**serialize_journal(entry)))
    return entries


@router.get("/{entry_id}", response_model=JournalResponse)
async def get_entry(
    entry_id: str,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Get a single journal entry by ID."""
    try:
        oid = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid entry ID")

    entry = await db["journal"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return JournalResponse(**serialize_journal(entry))


@router.put("/{entry_id}", response_model=JournalResponse)
async def update_entry(
    entry_id: str,
    entry_data: JournalUpdate,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Update a journal entry."""
    try:
        oid = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid entry ID")

    entry = await db["journal"].find_one({"_id": oid, "user_id": current_user["_id"]})
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    update_data = {k: v for k, v in entry_data.dict().items() if v is not None}
    if "mood" in update_data and update_data["mood"]:
        update_data["mood"] = update_data["mood"].value
    update_data["updated_at"] = datetime.utcnow()

    await db["journal"].update_one({"_id": oid}, {"$set": update_data})
    updated = await db["journal"].find_one({"_id": oid})
    return JournalResponse(**serialize_journal(updated))


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: str,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """Delete a journal entry."""
    try:
        oid = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid entry ID")

    result = await db["journal"].delete_one({"_id": oid, "user_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journal entry not found")
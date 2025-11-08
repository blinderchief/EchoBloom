from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.activity import (
    BreathingSession, JournalEntry, GratitudeEntry, 
    GroundingSession, ActivityStreak
)
from app.models.user_profile import UserProfile

router = APIRouter(prefix="/api/activities", tags=["activities"])


# ==================== REQUEST MODELS ====================

class BreathingSessionCreate(BaseModel):
    user_id: str
    cycles_completed: int
    duration_seconds: int
    technique: str = "box_breathing"
    mood_before: Optional[float] = None
    mood_after: Optional[float] = None
    notes: Optional[str] = None


class JournalEntryCreate(BaseModel):
    user_id: str
    category: str
    prompts: List[str]
    responses: dict
    emotion_tags: Optional[List[str]] = None


class GratitudeEntryCreate(BaseModel):
    user_id: str
    gratitudes: List[dict]  # [{text, reason}, ...]
    proud_moment: Optional[str] = None


class GroundingSessionCreate(BaseModel):
    user_id: str
    see_items: List[str]
    touch_items: List[str]
    hear_items: List[str]
    smell_items: List[str]
    taste_items: List[str]
    duration_seconds: int
    anxiety_before: Optional[float] = None
    anxiety_after: Optional[float] = None
    effectiveness_rating: Optional[int] = None


# ==================== BREATHING ENDPOINTS ====================

@router.post("/breathing")
async def create_breathing_session(
    session_data: BreathingSessionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save a completed breathing session"""
    try:
        breathing_session = BreathingSession(
            user_id=session_data.user_id,
            cycles_completed=session_data.cycles_completed,
            duration_seconds=session_data.duration_seconds,
            technique=session_data.technique,
            mood_before=session_data.mood_before,
            mood_after=session_data.mood_after,
            notes=session_data.notes
        )
        db.add(breathing_session)
        await db.flush()
        await db.refresh(breathing_session)
        await db.commit()
        
        return {
            "success": True,
            "session": breathing_session.to_dict(),
            "message": "Breathing session saved successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/breathing/{user_id}")
async def get_breathing_sessions(
    user_id: str,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get user's breathing session history"""
    result = await db.execute(
        select(BreathingSession)
        .where(BreathingSession.user_id == user_id)
        .order_by(desc(BreathingSession.completed_at))
        .limit(limit)
    )
    sessions = result.scalars().all()
    
    count_result = await db.execute(
        select(func.count())
        .select_from(BreathingSession)
        .where(BreathingSession.user_id == user_id)
    )
    total = count_result.scalar()
    
    return {
        "sessions": [s.to_dict() for s in sessions],
        "total_sessions": total or 0
    }


# ==================== JOURNAL ENDPOINTS ====================

@router.post("/journal")
async def create_journal_entry(
    entry_data: JournalEntryCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save a completed journal entry"""
    try:
        word_count = sum(len(str(response).split()) for response in entry_data.responses.values())
        
        journal_entry = JournalEntry(
            user_id=entry_data.user_id,
            category=entry_data.category,
            prompts=entry_data.prompts,
            responses=entry_data.responses,
            word_count=word_count,
            emotion_tags=entry_data.emotion_tags or []
        )
        db.add(journal_entry)
        await db.flush()
        await db.refresh(journal_entry)
        await db.commit()
        
        return {
            "success": True,
            "entry": journal_entry.to_dict(),
            "message": "Journal entry saved successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/journal/{user_id}")
async def get_journal_entries(
    user_id: str,
    category: Optional[str] = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get user's journal entries"""
    query = select(JournalEntry).where(JournalEntry.user_id == user_id)
    
    if category:
        query = query.where(JournalEntry.category == category)
    
    query = query.order_by(desc(JournalEntry.completed_at)).limit(limit)
    result = await db.execute(query)
    entries = result.scalars().all()
    
    count_query = select(func.count()).select_from(JournalEntry).where(JournalEntry.user_id == user_id)
    if category:
        count_query = count_query.where(JournalEntry.category == category)
    count_result = await db.execute(count_query)
    total = count_result.scalar()
    
    return {
        "entries": [e.to_dict() for e in entries],
        "total_entries": total or 0
    }


# ==================== GRATITUDE ENDPOINTS ====================

@router.post("/gratitude")
async def create_gratitude_entry(
    entry_data: GratitudeEntryCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save a completed gratitude practice"""
    try:
        gratitude_entry = GratitudeEntry(
            user_id=entry_data.user_id,
            gratitudes=entry_data.gratitudes,
            proud_moment=entry_data.proud_moment
        )
        db.add(gratitude_entry)
        await db.flush()
        await db.refresh(gratitude_entry)
        
        # Update gratitude count in profile
        profile_result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == entry_data.user_id)
        )
        profile = profile_result.scalars().first()
        if profile:
            # Increment gratitude count (type: ignore needed for SQLAlchemy Column type hint)
            current_count = profile.gratitude_count if profile.gratitude_count else 0  # type: ignore
            profile.gratitude_count = current_count + len(entry_data.gratitudes)  # type: ignore
        
        await db.commit()
        
        return {
            "success": True,
            "entry": gratitude_entry.to_dict(),
            "message": "Gratitude entry saved successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/gratitude/{user_id}")
async def get_gratitude_entries(
    user_id: str,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get user's gratitude entries"""
    result = await db.execute(
        select(GratitudeEntry)
        .where(GratitudeEntry.user_id == user_id)
        .order_by(desc(GratitudeEntry.completed_at))
        .limit(limit)
    )
    entries = result.scalars().all()
    
    count_result = await db.execute(
        select(func.count())
        .select_from(GratitudeEntry)
        .where(GratitudeEntry.user_id == user_id)
    )
    total = count_result.scalar()
    
    return {
        "entries": [e.to_dict() for e in entries],
        "total_entries": total or 0
    }


# ==================== GROUNDING ENDPOINTS ====================

@router.post("/grounding")
async def create_grounding_session(
    session_data: GroundingSessionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Save a completed grounding session"""
    try:
        grounding_session = GroundingSession(
            user_id=session_data.user_id,
            see_items=session_data.see_items,
            touch_items=session_data.touch_items,
            hear_items=session_data.hear_items,
            smell_items=session_data.smell_items,
            taste_items=session_data.taste_items,
            duration_seconds=session_data.duration_seconds,
            anxiety_before=session_data.anxiety_before,
            anxiety_after=session_data.anxiety_after,
            effectiveness_rating=session_data.effectiveness_rating
        )
        db.add(grounding_session)
        await db.flush()
        await db.refresh(grounding_session)
        await db.commit()
        
        return {
            "success": True,
            "session": grounding_session.to_dict(),
            "message": "Grounding session saved successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/grounding/{user_id}")
async def get_grounding_sessions(
    user_id: str,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get user's grounding sessions"""
    result = await db.execute(
        select(GroundingSession)
        .where(GroundingSession.user_id == user_id)
        .order_by(desc(GroundingSession.completed_at))
        .limit(limit)
    )
    sessions = result.scalars().all()
    
    count_result = await db.execute(
        select(func.count())
        .select_from(GroundingSession)
        .where(GroundingSession.user_id == user_id)
    )
    total = count_result.scalar()
    
    return {
        "sessions": [s.to_dict() for s in sessions],
        "total_sessions": total or 0
    }


# ==================== STATS ENDPOINTS ====================

@router.get("/stats/{user_id}")
async def get_activity_stats(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get comprehensive activity statistics"""
    
    # Get counts for each activity type
    breathing_result = await db.execute(
        select(func.count()).select_from(BreathingSession).where(BreathingSession.user_id == user_id)
    )
    breathing_count = breathing_result.scalar() or 0
    
    journal_result = await db.execute(
        select(func.count()).select_from(JournalEntry).where(JournalEntry.user_id == user_id)
    )
    journal_count = journal_result.scalar() or 0
    
    gratitude_result = await db.execute(
        select(func.count()).select_from(GratitudeEntry).where(GratitudeEntry.user_id == user_id)
    )
    gratitude_count = gratitude_result.scalar() or 0
    
    grounding_result = await db.execute(
        select(func.count()).select_from(GroundingSession).where(GroundingSession.user_id == user_id)
    )
    grounding_count = grounding_result.scalar() or 0
    
    # Get this week's activity
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    week_breathing = await db.execute(
        select(func.count()).select_from(BreathingSession).where(
            BreathingSession.user_id == user_id,
            BreathingSession.completed_at >= week_ago
        )
    )
    week_journal = await db.execute(
        select(func.count()).select_from(JournalEntry).where(
            JournalEntry.user_id == user_id,
            JournalEntry.completed_at >= week_ago
        )
    )
    week_gratitude = await db.execute(
        select(func.count()).select_from(GratitudeEntry).where(
            GratitudeEntry.user_id == user_id,
            GratitudeEntry.completed_at >= week_ago
        )
    )
    week_grounding = await db.execute(
        select(func.count()).select_from(GroundingSession).where(
            GroundingSession.user_id == user_id,
            GroundingSession.completed_at >= week_ago
        )
    )
    
    this_week_count = (
        (week_breathing.scalar() or 0) +
        (week_journal.scalar() or 0) +
        (week_gratitude.scalar() or 0) +
        (week_grounding.scalar() or 0)
    )
    
    return {
        "total_activities": breathing_count + journal_count + gratitude_count + grounding_count,
        "breathing_sessions": breathing_count,
        "journal_entries": journal_count,
        "gratitude_entries": gratitude_count,
        "grounding_sessions": grounding_count,
        "this_week_count": this_week_count
    }

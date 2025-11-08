from sqlalchemy import Column, Integer, String, DateTime, Float, JSON, Text
from sqlalchemy.sql import func
from app.models import Base

class BreathingSession(Base):
    __tablename__ = "breathing_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk ID
    
    # Session data
    cycles_completed = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)  # Total time spent
    technique = Column(String, default="box_breathing")  # box_breathing, 4-7-8, etc.
    
    # Metrics
    mood_before = Column(Float, nullable=True)  # -1 to 1
    mood_after = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cycles_completed": self.cycles_completed,
            "duration_seconds": self.duration_seconds,
            "technique": self.technique,
            "mood_before": self.mood_before,
            "mood_after": self.mood_after,
            "notes": self.notes,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }


class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk ID
    
    # Journal data
    category = Column(String, nullable=False)  # anxiety, emotions, self-discovery, etc.
    prompts = Column(JSON)  # List of prompts used
    responses = Column(JSON)  # Dict of prompt: response pairs
    
    # Metrics
    word_count = Column(Integer, default=0)
    sentiment_score = Column(Float, nullable=True)  # -1 to 1
    emotion_tags = Column(JSON, default=list)  # ["reflective", "hopeful", etc.]
    
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category": self.category,
            "prompts": self.prompts or [],
            "responses": self.responses or {},
            "word_count": self.word_count,
            "sentiment_score": self.sentiment_score,
            "emotion_tags": self.emotion_tags or [],
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }


class GratitudeEntry(Base):
    __tablename__ = "gratitude_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk ID
    
    # Gratitude data
    gratitudes = Column(JSON)  # List of {text, reason} objects
    proud_moment = Column(Text, nullable=True)
    
    # Metrics
    mood_score = Column(Float, nullable=True)  # -1 to 1
    themes = Column(JSON, default=list)  # ["family", "health", "achievement", etc.]
    
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "gratitudes": self.gratitudes or [],
            "proud_moment": self.proud_moment,
            "mood_score": self.mood_score,
            "themes": self.themes or [],
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }


class GroundingSession(Base):
    __tablename__ = "grounding_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk ID
    
    # Grounding data (5-4-3-2-1 technique)
    see_items = Column(JSON)  # 5 things seen
    touch_items = Column(JSON)  # 4 things touched
    hear_items = Column(JSON)  # 3 things heard
    smell_items = Column(JSON)  # 2 things smelled
    taste_items = Column(JSON)  # 1 thing tasted
    
    # Metrics
    duration_seconds = Column(Integer, default=0)
    anxiety_before = Column(Float, nullable=True)  # 0-10 scale
    anxiety_after = Column(Float, nullable=True)
    effectiveness_rating = Column(Integer, nullable=True)  # 1-5 stars
    
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "see_items": self.see_items or [],
            "touch_items": self.touch_items or [],
            "hear_items": self.hear_items or [],
            "smell_items": self.smell_items or [],
            "taste_items": self.taste_items or [],
            "duration_seconds": self.duration_seconds,
            "anxiety_before": self.anxiety_before,
            "anxiety_after": self.anxiety_after,
            "effectiveness_rating": self.effectiveness_rating,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }


class ActivityStreak(Base):
    __tablename__ = "activity_streaks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk ID
    activity_type = Column(String, nullable=False)  # breathing, journal, gratitude, grounding
    
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_completions = Column(Integer, default=0)
    last_completion_date = Column(DateTime(timezone=True), nullable=True)
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "activity_type": self.activity_type,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "total_completions": self.total_completions,
            "last_completion_date": self.last_completion_date.isoformat() if self.last_completion_date else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

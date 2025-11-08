from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.models import Base

class Echo(Base):
    __tablename__ = "echoes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)  # Clerk user ID
    content = Column(Text, nullable=False)  # User's input
    ai_response = Column(Text, nullable=False)  # AI empathy response
    mood_score = Column(Float)  # -1 to 1 (negative to positive)
    emotion_tags = Column(JSON)  # ["anxiety", "hope", "calm"]
    seed_type = Column(String)  # "reflection", "gratitude", "concern", "joy"
    growth_stage = Column(Integer, default=1)  # 1=seed, 2=sprout, 3=bloom, 4=flower
    is_shared = Column(Integer, default=0)  # Community sharing flag
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "ai_response": self.ai_response,
            "mood_score": self.mood_score,
            "emotion_tags": self.emotion_tags,
            "seed_type": self.seed_type,
            "growth_stage": self.growth_stage,
            "is_shared": self.is_shared,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

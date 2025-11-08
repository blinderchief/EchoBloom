from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from . import Base
from datetime import datetime

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    input_type = Column(String)  # text, voice, gesture
    input_content = Column(Text)  # encrypted
    ai_response = Column(Text)  # encrypted
    embedding = Column(String)  # JSON string for vector
    created_at = Column(DateTime, default=datetime.utcnow)
    mood_score = Column(Integer, nullable=True)  # 1-10
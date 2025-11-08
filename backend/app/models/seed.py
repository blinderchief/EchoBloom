from sqlalchemy import Column, Integer, String, Text, DateTime
from . import Base
from datetime import datetime

class Seed(Base):
    __tablename__ = "seeds"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)  # advice snippet
    embedding = Column(String)  # JSON vector
    created_at = Column(DateTime, default=datetime.utcnow)
    impact_count = Column(Integer, default=0)
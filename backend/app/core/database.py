from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with async_session() as session:
        yield session

async def create_tables():
    from app.models import Base
    from app.models.echo import Echo
    from app.models.user_profile import UserProfile
    from app.models.activity import (
        BreathingSession, JournalEntry, GratitudeEntry, 
        GroundingSession, ActivityStreak
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
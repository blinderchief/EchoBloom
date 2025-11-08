from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.session_model import Session
from pydantic import BaseModel

router = APIRouter()

class SessionCreate(BaseModel):
    user_id: int
    input_type: str
    input_content: str

@router.post("/sessions")
async def create_session(session: SessionCreate, db: AsyncSession = Depends(get_db)):
    new_session = Session(**session.dict())
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.get("/sessions/{user_id}")
async def get_sessions(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Session.__table__.select().where(Session.user_id == user_id))
    return result.fetchall()
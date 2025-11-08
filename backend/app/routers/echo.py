from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.core.config import settings
from app.models.echo import Echo
from app.models.user_profile import UserProfile
import google.generativeai as genai
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import random
import json
import re

router = APIRouter()

genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

class EchoRequest(BaseModel):
    input: str
    userId: Optional[str] = None

class EchoResponse(BaseModel):
    id: int
    response: str
    mood_score: float
    emotion_tags: List[str]
    seed_type: str
    growth_stage: int
    wellness_insights: dict

# Psychological emotion detection using keywords
EMOTION_KEYWORDS = {
    "anxiety": ["anxious", "worried", "nervous", "panic", "fear", "scared", "stress"],
    "depression": ["sad", "depressed", "hopeless", "empty", "numb", "worthless"],
    "joy": ["happy", "joyful", "excited", "grateful", "blessed", "amazing"],
    "anger": ["angry", "frustrated", "irritated", "furious", "mad"],
    "calm": ["peaceful", "relaxed", "calm", "serene", "content"],
    "hope": ["hope", "optimistic", "better", "improve", "growing"],
    "gratitude": ["thank", "grateful", "appreciate", "blessing", "fortunate"],
    "loneliness": ["lonely", "alone", "isolated", "disconnected"],
    "overwhelm": ["overwhelmed", "too much", "exhausted", "burnout", "drained"]
}

SEED_TYPES = {
    "reflection": ["think", "realize", "understand", "learn", "notice"],
    "gratitude": ["grateful", "thank", "appreciate", "blessing"],
    "concern": ["worried", "anxious", "fear", "concern"],
    "joy": ["happy", "excited", "love", "amazing"],
    "growth": ["trying", "learning", "working", "practicing"]
}

def analyze_mood(text: str) -> tuple[float, List[str], str]:
    """Psychological mood analysis using NLP techniques"""
    text_lower = text.lower()
    detected_emotions = []
    mood_score = 0.0
    
    # Detect emotions
    for emotion, keywords in EMOTION_KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            detected_emotions.append(emotion)
            # Positive emotions increase score
            if emotion in ["joy", "calm", "hope", "gratitude"]:
                mood_score += 0.3
            # Negative emotions decrease score
            elif emotion in ["anxiety", "depression", "anger", "loneliness"]:
                mood_score -= 0.25
    
    # Detect seed type
    seed_type = "reflection"  # default
    for stype, keywords in SEED_TYPES.items():
        if any(keyword in text_lower for keyword in keywords):
            seed_type = stype
            break
    
    # Normalize mood score to -1 to 1
    mood_score = max(-1.0, min(1.0, mood_score))
    
    # Default to neutral if no emotions detected
    if not detected_emotions:
        detected_emotions = ["neutral"]
        mood_score = 0.0
    
    return mood_score, detected_emotions[:3], seed_type  # Limit to 3 emotions

@router.post("/echo", response_model=EchoResponse)
async def create_echo(request: EchoRequest, db: AsyncSession = Depends(get_db)):
    """Create new echo with AI response, mood analysis, and database persistence"""
    
    if not request.userId:
        raise HTTPException(status_code=400, detail="User ID required")
    
    # Analyze mood using psychological framework
    mood_score, emotion_tags, seed_type = analyze_mood(request.input)
    
    # Generate AI empathy response with psychological framing
    prompt = f"""As an empathetic mental wellness guide trained in Cognitive Behavioral Therapy and positive psychology, 
respond to this reflection with deep empathy and validation. 

User's reflection: "{request.input}"
Detected emotions: {', '.join(emotion_tags)}
Mood context: {'positive' if mood_score > 0 else 'challenging' if mood_score < 0 else 'neutral'}

Provide a nurturing, validating response that:
1. Acknowledges their feelings without judgment
2. Offers a gentle psychological insight or reframe
3. Ends with an empowering affirmation
4. Keep it concise (2-3 sentences) and warm

Response:"""
    
    try:
        ai_response_obj = model.generate_content(prompt)
        ai_response = ai_response_obj.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Psychologically-informed fallback responses
        fallback_map = {
            "anxiety": "I hear the worry in your words. Remember: anxiety is your mind trying to protect you, even if it feels overwhelming. You're safe in this moment. 🌱",
            "joy": "Your joy is contagious and beautiful! Savor this moment—positive emotions are seeds for resilience. You deserve this happiness. ✨",
            "depression": "I see you in your pain, and your feelings are completely valid. Even in darkness, you're showing courage by reaching out. One small step at a time. 💙",
            "gratitude": "Gratitude is a powerful practice for the mind. By noticing the good, you're rewiring your brain for wellbeing. Beautiful work. 🌸",
            "default": "Thank you for trusting me with these words. Your experience matters, and you're not alone in this garden. 🌿"
        }
        primary_emotion = emotion_tags[0] if emotion_tags else "default"
        ai_response = fallback_map.get(primary_emotion, fallback_map["default"])
    
    # Determine growth stage based on mood and user activity
    growth_stage = 1  # seed
    if mood_score > 0.3:
        growth_stage = 3  # bloom (positive mood)
    elif mood_score > 0:
        growth_stage = 2  # sprout (neutral-positive)
    
    # Save to database
    echo = Echo(
        user_id=request.userId,
        content=request.input,
        ai_response=ai_response,
        mood_score=mood_score,
        emotion_tags=emotion_tags,
        seed_type=seed_type,
        growth_stage=growth_stage
    )
    db.add(echo)
    
    # Update user profile stats
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == request.userId)
    )
    profile = profile_result.scalar_one_or_none()
    
    if not profile:
        # Create new profile
        profile = UserProfile(
            user_id=request.userId,
            total_echoes=1,
            current_streak=1,
            longest_streak=1,
            mood_average=mood_score,
            wellness_score=50 + int(mood_score * 20)
        )
        db.add(profile)
    else:
        # Update existing profile
        profile.total_echoes += 1
        profile.monthly_reflections += 1
        if seed_type == "gratitude":
            profile.gratitude_count += 1
        
        # Update mood average (running average)
        profile.mood_average = (profile.mood_average * (profile.total_echoes - 1) + mood_score) / profile.total_echoes
        
        # Update wellness score (0-100 scale)
        profile.wellness_score = max(0, min(100, 50 + int(profile.mood_average * 30) + profile.current_streak * 2))
        
        # Check for achievements
        new_achievements = []
        if profile.total_echoes == 1 and "first_bloom" not in (profile.achievements or []):
            new_achievements.append("first_bloom")
        if profile.total_echoes == 7 and "week_warrior" not in (profile.achievements or []):
            new_achievements.append("week_warrior")
        if profile.gratitude_count >= 5 and "gratitude_guru" not in (profile.achievements or []):
            new_achievements.append("gratitude_guru")
        
        if new_achievements:
            profile.achievements = (profile.achievements or []) + new_achievements
    
    await db.commit()
    await db.refresh(echo)
    await db.refresh(profile)
    
    # Generate wellness insights
    wellness_insights = {
        "mood_trend": "improving" if mood_score > 0 else "needs_attention" if mood_score < -0.3 else "stable",
        "dominant_emotion": emotion_tags[0] if emotion_tags else "neutral",
        "wellness_score": profile.wellness_score,
        "streak": profile.current_streak,
        "total_reflections": profile.total_echoes,
        "suggestion": generate_wellness_suggestion(emotion_tags, mood_score)
    }
    
    return EchoResponse(
        id=echo.id,
        response=ai_response,
        mood_score=mood_score,
        emotion_tags=emotion_tags,
        seed_type=seed_type,
        growth_stage=growth_stage,
        wellness_insights=wellness_insights
    )

def generate_wellness_suggestion(emotions: List[str], mood_score: float) -> str:
    """Generate personalized wellness activity suggestions as a compassionate companion"""
    
    # Anxiety & Stress
    if "anxiety" in emotions or "overwhelmed" in emotions:
        suggestions = [
            "Let's calm your mind together: Try box breathing (inhale-4, hold-4, exhale-4, hold-4) 🫁",
            "I'm here with you. Ground yourself: Name 5 things you see, 4 you can touch, 3 you hear 🌿",
            "Your worries are valid. Try progressive muscle relaxation—tense and release each muscle group 💆"
        ]
        return suggestions[hash(str(emotions)) % len(suggestions)]
    
    # Depression & Sadness
    elif "depression" in emotions or "sad" in emotions or mood_score < -0.5:
        suggestions = [
            "I see you're hurting. Even small steps matter—try a 5-minute walk outside 🚶",
            "You're not alone in this. Journal 3 things you did today, no matter how small ✍️",
            "Gentle reminder: Reach out to one person. Connection heals, even through text 💙",
            "Your feelings are real. Try listening to uplifting music and moving gently 🎵"
        ]
        return suggestions[hash(str(emotions)) % len(suggestions)]
    
    # Loneliness
    elif "lonely" in emotions or "isolated" in emotions:
        return "Loneliness is hard. Reach out to someone you trust—even a small hello can create warmth 🤝💛"
    
    # Anger & Frustration  
    elif "anger" in emotions or "frustrated" in emotions:
        suggestions = [
            "Your anger is telling you something. Try journaling: 'I feel angry because...' 🔥→📝",
            "Let's channel this energy: Do 10 jumping jacks or punch a pillow. Physical release helps 🥊",
            "Pause with me. Take 5 deep breaths. Then write what you need to feel heard 🫂"
        ]
        return suggestions[hash(str(emotions)) % len(suggestions)]
    
    # Joy & Gratitude (amplify positivity)
    elif "joy" in emotions or "happy" in emotions:
        suggestions = [
            "Your joy is contagious! 🌟 Capture this: Write about what made you smile today",
            "Brilliant! Share this happiness—text someone about your good news 🎉",
            "This is beautiful! Take a photo or save a memento of this joyful moment 📸"
        ]
        return suggestions[hash(str(emotions)) % len(suggestions)]
    
    elif "gratitude" in emotions:
        return "Gratitude is powerful! 🙏 Write 3 specific things you're thankful for and why"
    
    # Hope & Growth
    elif "hope" in emotions or "inspired" in emotions:
        return "Love your energy! 🌱 Set one small intention for tomorrow and visualize it happening"
    
    elif "proud" in emotions or mood_score > 0.5:
        return "You should be proud! 🏆 Celebrate this win—treat yourself to something you enjoy"
    
    # Calm & Peaceful (maintain)
    elif "calm" in emotions or "peaceful" in emotions:
        return "What beautiful balance ☮️ Keep this peace: Try a 5-minute meditation or nature sounds"
    
    # Default Growth Mindset
    else:
        suggestions = [
            "Keep growing your garden 🌻 Consistency builds resilience—I'm here with you",
            "Every echo matters 🌸 You're building self-awareness one reflection at a time",
            "Proud of you for showing up 🌿 Try a gratitude practice tonight before sleep",
            "You're doing the work 💪 Tomorrow, notice one small moment of beauty"
        ]
        return suggestions[hash(str(emotions)) % len(suggestions)]

@router.get("/echoes/{user_id}")
async def get_user_echoes(user_id: str, db: AsyncSession = Depends(get_db), limit: int = 20):
    """Get user's echo history with psychological insights"""
    result = await db.execute(
        select(Echo)
        .where(Echo.user_id == user_id)
        .order_by(desc(Echo.created_at))
        .limit(limit)
    )
    echoes = result.scalars().all()
    return {"echoes": [echo.to_dict() for echo in echoes]}

@router.get("/profile/{user_id}")
async def get_user_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get comprehensive user wellness profile"""
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Return default profile
        return {
            "total_echoes": 0,
            "wellness_score": 50,
            "mood_average": 0.0,
            "current_streak": 0,
            "achievements": [],
            "message": "Start planting your first echo to begin your wellness journey!"
        }
    
    # Get mood trend (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_echoes_result = await db.execute(
        select(Echo)
        .where(Echo.user_id == user_id, Echo.created_at >= seven_days_ago)
        .order_by(Echo.created_at)
    )
    recent_echoes = recent_echoes_result.scalars().all()
    
    mood_trend = [echo.mood_score for echo in recent_echoes]
    
    return {
        **profile.to_dict(),
        "mood_trend_week": mood_trend,
        "mood_trend_direction": "improving" if len(mood_trend) > 1 and mood_trend[-1] > mood_trend[0] else "stable"
    }
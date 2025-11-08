from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta
from typing import Dict, List
from collections import Counter
from app.core.database import get_db
from app.models.echo import Echo
from app.models.user_profile import UserProfile
from app.models.activity import (
    BreathingSession, JournalEntry, GratitudeEntry, GroundingSession
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/{user_id}")
async def get_user_analytics(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get comprehensive analytics for a user including:
    - Mood trends (7-day and 30-day)
    - Emotion distribution
    - Activity statistics
    - Wellness trajectory
    - AI-generated insights
    """
    
    # Get user profile
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    profile = profile_result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    # Calculate date ranges
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)
    
    # ==================== MOOD TRENDS ====================
    
    # Get echoes for 30 days (for charts)
    echoes_result = await db.execute(
        select(Echo)
        .where(Echo.user_id == user_id, Echo.created_at >= thirty_days_ago)
        .order_by(Echo.created_at)
    )
    echoes = echoes_result.scalars().all()
    
    # Build daily mood data for charts
    mood_by_day = {}
    for echo in echoes:
        day_key = echo.created_at.strftime('%Y-%m-%d')
        if day_key not in mood_by_day:
            mood_by_day[day_key] = []
        mood_by_day[day_key].append(echo.mood_score)
    
    # Calculate average mood per day
    mood_trend_30_days = [
        {
            "date": day,
            "mood_score": sum(scores) / len(scores),
            "echo_count": len(scores)
        }
        for day, scores in sorted(mood_by_day.items())
    ]
    
    # Get 7-day trend
    mood_trend_7_days = [
        entry for entry in mood_trend_30_days
        if datetime.strptime(entry["date"], '%Y-%m-%d') >= seven_days_ago
    ]
    
    # ==================== EMOTION DISTRIBUTION ====================
    
    # Collect all emotion tags from echoes
    all_emotions = []
    for echo in echoes:
        if echo.emotion_tags is not None:  # type: ignore
            all_emotions.extend(echo.emotion_tags)  # type: ignore
    
    emotion_counts = Counter(all_emotions)
    total_emotions = sum(emotion_counts.values())
    
    emotion_distribution = [
        {
            "emotion": emotion,
            "count": count,
            "percentage": round((count / total_emotions) * 100, 1) if total_emotions > 0 else 0
        }
        for emotion, count in emotion_counts.most_common(10)
    ]
    
    # ==================== ACTIVITY STATISTICS ====================
    
    # Get activity counts
    breathing_result = await db.execute(
        select(func.count())
        .select_from(BreathingSession)
        .where(BreathingSession.user_id == user_id, BreathingSession.completed_at >= thirty_days_ago)
    )
    breathing_count = breathing_result.scalar() or 0
    
    journal_result = await db.execute(
        select(func.count())
        .select_from(JournalEntry)
        .where(JournalEntry.user_id == user_id, JournalEntry.completed_at >= thirty_days_ago)
    )
    journal_count = journal_result.scalar() or 0
    
    gratitude_result = await db.execute(
        select(func.count())
        .select_from(GratitudeEntry)
        .where(GratitudeEntry.user_id == user_id, GratitudeEntry.completed_at >= thirty_days_ago)
    )
    gratitude_count = gratitude_result.scalar() or 0
    
    grounding_result = await db.execute(
        select(func.count())
        .select_from(GroundingSession)
        .where(GroundingSession.user_id == user_id, GroundingSession.completed_at >= thirty_days_ago)
    )
    grounding_count = grounding_result.scalar() or 0
    
    activity_stats = {
        "breathing": breathing_count,
        "journal": journal_count,
        "gratitude": gratitude_count,
        "grounding": grounding_count,
        "total": breathing_count + journal_count + gratitude_count + grounding_count
    }
    
    # ==================== WELLNESS TRAJECTORY ====================
    
    # Calculate weekly wellness scores
    wellness_by_week = {}
    for echo in echoes:
        week_key = echo.created_at.strftime('%Y-W%W')
        if week_key not in wellness_by_week:
            wellness_by_week[week_key] = []
        # Simple wellness calculation: (mood_score + 1) * 50 to get 0-100 scale
        wellness_by_week[week_key].append((echo.mood_score + 1) * 50)
    
    wellness_trajectory = [
        {
            "week": week,
            "wellness_score": round(sum(scores) / len(scores), 1)
        }
        for week, scores in sorted(wellness_by_week.items())
    ]
    
    # ==================== AI-GENERATED INSIGHTS ====================
    
    insights = []
    
    # Insight 1: Most frequent emotion
    if emotion_distribution:
        top_emotion = emotion_distribution[0]["emotion"]
        insights.append(f"Your most frequent emotion this month is '{top_emotion}' ({emotion_distribution[0]['percentage']}% of the time)")
    
    # Insight 2: Activity engagement
    if activity_stats["total"] > 0:
        most_used = max(activity_stats.items(), key=lambda x: x[1] if x[0] != "total" else 0)
        if most_used[0] != "total" and most_used[1] > 0:
            insights.append(f"You've been most engaged with {most_used[0]} exercises ({most_used[1]} sessions)")
    
    # Insight 3: Mood trend
    if len(mood_trend_7_days) >= 2:
        recent_avg = sum(d["mood_score"] for d in mood_trend_7_days[-3:]) / 3
        earlier_avg = sum(d["mood_score"] for d in mood_trend_7_days[:3]) / min(3, len(mood_trend_7_days))
        if recent_avg > earlier_avg + 0.2:
            insights.append("Your mood has been improving over the past week - keep up the great work! 🌟")
        elif recent_avg < earlier_avg - 0.2:
            insights.append("Your mood has dipped recently. Consider trying a breathing or grounding exercise.")
    
    # Insight 4: Streak recognition
    current_streak = int(profile.current_streak) if profile.current_streak else 0  # type: ignore
    if current_streak >= 7:
        insights.append(f"Amazing! You're on a {current_streak}-day streak! 🔥")
    elif current_streak >= 3:
        insights.append(f"You're building momentum with a {current_streak}-day streak! Keep going!")
    
    # Insight 5: Echo count
    echo_count = len(echoes)
    if echo_count >= 30:
        insights.append(f"You've created {echo_count} echoes this month - your garden is flourishing! 🌸")
    elif echo_count == 0:
        insights.append("Start your wellness journey by creating your first echo today!")
    
    # ==================== RETURN ANALYTICS ====================
    
    return {
        "user_id": user_id,
        "profile": {
            "wellness_score": profile.wellness_score,
            "current_streak": profile.current_streak,
            "longest_streak": profile.longest_streak,
            "total_echoes": profile.total_echoes,
            "gratitude_count": profile.gratitude_count,
            "achievements": profile.achievements
        },
        "mood_trends": {
            "seven_days": mood_trend_7_days,
            "thirty_days": mood_trend_30_days,
            "current_average": round(sum(d["mood_score"] for d in mood_trend_7_days) / len(mood_trend_7_days), 2) if mood_trend_7_days else 0
        },
        "emotion_distribution": emotion_distribution,
        "activity_stats": activity_stats,
        "wellness_trajectory": wellness_trajectory,
        "insights": insights,
        "generated_at": now.isoformat()
    }

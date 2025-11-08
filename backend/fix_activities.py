import sys

# Read the file
with open('e:/replit-hac/backend/app/routers/activities.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all instances of Session with AsyncSession in function parameters
content = content.replace('db: Session = Depends(get_db)', 'db: AsyncSession = Depends(get_db)')
content = content.replace('async def update_activity_streak(db: Session', 'async def update_activity_streak(db: AsyncSession')
content = content.replace('async def update_user_profile_activities(db: Session', 'async def update_user_profile_activities(db: AsyncSession')
content = content.replace('async def check_breathing_achievements(db: Session', 'async def check_breathing_achievements(db: AsyncSession')
content = content.replace('async def check_journal_achievements(db: Session', 'async def check_journal_achievements(db: AsyncSession')
content = content.replace('async def check_gratitude_achievements(db: Session', 'async def check_gratitude_achievements(db: AsyncSession')
content = content.replace('async def check_grounding_achievements(db: Session', 'async def check_grounding_achievements(db: AsyncSession')

# Replace sync query methods with async equivalents
content = content.replace('db.query(', 'await db.execute(select(')
content = content.replace(').filter(', ').where(')
content = content.replace(').order_by(', ').order_by(')
content = content.replace(').limit(', ').limit(')
content = content.replace(').first()', ')).scalars().first()')
content = content.replace(').all()', ')).scalars().all()')
content = content.replace(').count()', ')).scalar()')
content = content.replace('db.add(', 'db.add(')
content = content.replace('db.commit()', 'await db.commit()')
content = content.replace('db.refresh(', 'await db.refresh(')
content = content.replace('db.rollback()', 'await db.rollback()')

# Write back
with open('e:/replit-hac/backend/app/routers/activities.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully!")

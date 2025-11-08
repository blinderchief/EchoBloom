'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { TrendingUp, Heart, Activity, Sparkles, ArrowLeft, Brain, Target } from 'lucide-react'
import Link from 'next/link'

interface MoodTrendPoint {
  date: string
  mood_score: number
  echo_count: number
}

interface EmotionData {
  emotion: string
  count: number
  percentage: number
}

interface ActivityStats {
  breathing: number
  journal: number
  gratitude: number
  grounding: number
  total: number
}

interface AnalyticsData {
  profile: {
    wellness_score: number
    current_streak: number
    longest_streak: number
    total_echoes: number
    gratitude_count: number
    achievements: string[]
  }
  mood_trends: {
    seven_days: MoodTrendPoint[]
    thirty_days: MoodTrendPoint[]
    current_average: number
  }
  emotion_distribution: EmotionData[]
  activity_stats: ActivityStats
  insights: string[]
}

export default function InsightsPage() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days')

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    } else if (user) {
      fetchAnalytics()
    }
  }, [isSignedIn, user, router])

  const fetchAnalytics = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/analytics/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodEmoji = (score: number) => {
    if (score >= 0.5) return '🌟'
    if (score >= 0) return '🌼'
    if (score >= -0.5) return '🌿'
    return '🍂'
  }

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'from-moss to-sky'
    if (score >= 60) return 'from-sky to-moss'
    if (score >= 40) return 'from-sunset to-petal'
    return 'from-earth to-sunset'
  }

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-400',
      grateful: 'bg-green-400',
      peaceful: 'bg-blue-300',
      hopeful: 'bg-sky-400',
      anxious: 'bg-purple-400',
      sad: 'bg-indigo-400',
      stressed: 'bg-red-400',
      angry: 'bg-red-600',
      confused: 'bg-gray-400',
      reflective: 'bg-teal-400'
    }
    return colors[emotion.toLowerCase()] || 'bg-moss'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-moss border-t-sky rounded-full"
        />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl font-quicksand">No data available yet.</p>
          <p className="text-sky/80 mt-2">Start creating echoes to see your insights!</p>
        </div>
      </div>
    )
  }

  const currentTrend = timeRange === '7days' ? analytics.mood_trends.seven_days : analytics.mood_trends.thirty_days

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-moss/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/garden">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-moss/20 hover:bg-moss/30 text-white transition-colors font-quicksand">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Garden</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-sky" />
              <h1 className="text-2xl font-quicksand font-bold text-white">
                Your Wellness Insights
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Wellness Score Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-moss/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Ring */}
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(analytics.profile.wellness_score / 100) * 553} 553`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7EC8E3" />
                      <stop offset="100%" stopColor="#A8D5A8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-white">{analytics.profile.wellness_score}</div>
                  <div className="text-sm text-sky/80">Wellness Score</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-sunset">{analytics.profile.current_streak}</div>
                  <div className="text-sm text-white/80 font-quicksand">Day Streak 🔥</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-moss">{analytics.profile.total_echoes}</div>
                  <div className="text-sm text-white/80 font-quicksand">Total Echoes</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-petal">{analytics.profile.gratitude_count}</div>
                  <div className="text-sm text-white/80 font-quicksand">Gratitudes</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-sky">{analytics.activity_stats.total}</div>
                  <div className="text-sm text-white/80 font-quicksand">Activities</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        {analytics.insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-moss/20 to-sky/20 backdrop-blur-sm rounded-2xl p-6 border border-moss/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-sky" />
                <h2 className="text-xl font-quicksand font-bold text-white">AI-Generated Insights</h2>
              </div>
              <div className="space-y-3">
                {analytics.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 text-white/90"
                  >
                    <div className="w-2 h-2 rounded-full bg-sky mt-2" />
                    <p className="font-quicksand">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-moss/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-moss" />
                <h2 className="text-xl font-quicksand font-bold text-white">Mood Trend</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('7days')}
                  className={`px-3 py-1 rounded-lg text-sm font-quicksand transition-colors ${
                    timeRange === '7days'
                      ? 'bg-moss text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30days')}
                  className={`px-3 py-1 rounded-lg text-sm font-quicksand transition-colors ${
                    timeRange === '30days'
                      ? 'bg-moss text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Simple line visualization */}
            <div className="h-48 relative">
              {currentTrend.length > 0 ? (
                <div className="flex items-end justify-between h-full gap-1">
                  {currentTrend.map((point, index) => {
                    const heightPercent = ((point.mood_score + 1) / 2) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ delay: index * 0.05 }}
                          className={`w-full rounded-t-lg bg-gradient-to-t ${getWellnessColor(heightPercent)} relative group`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                            {getMoodEmoji(point.mood_score)} {point.mood_score.toFixed(2)}
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  No mood data for this period
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-sm text-white/60 font-quicksand">
                Average: <span className="text-white font-bold">{getMoodEmoji(analytics.mood_trends.current_average)} {analytics.mood_trends.current_average.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Emotion Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-moss/30"
          >
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-petal" />
              <h2 className="text-xl font-quicksand font-bold text-white">Emotion Distribution</h2>
            </div>

            {analytics.emotion_distribution.length > 0 ? (
              <div className="space-y-3">
                {analytics.emotion_distribution.map((emotion, index) => (
                  <motion.div
                    key={emotion.emotion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-quicksand capitalize">{emotion.emotion}</span>
                      <span className="text-sky/80 text-sm">{emotion.percentage}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${emotion.percentage}%` }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        className={`h-full ${getEmotionColor(emotion.emotion)}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-white/60">
                No emotion data yet
              </div>
            )}
          </motion.div>

          {/* Activity Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-moss/30"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-sunset" />
              <h2 className="text-xl font-quicksand font-bold text-white">Activity Breakdown</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Breathing', count: analytics.activity_stats.breathing, icon: '🌬️', color: 'from-sky to-moss' },
                { name: 'Journaling', count: analytics.activity_stats.journal, icon: '📝', color: 'from-petal to-sunset' },
                { name: 'Gratitude', count: analytics.activity_stats.gratitude, icon: '🙏', color: 'from-sunset to-earth' },
                { name: 'Grounding', count: analytics.activity_stats.grounding, icon: '🧘', color: 'from-moss to-moss-dark' }
              ].map((activity, index) => (
                <motion.div
                  key={activity.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-gradient-to-br ${activity.color} rounded-xl p-4 text-center`}
                >
                  <div className="text-3xl mb-2">{activity.icon}</div>
                  <div className="text-2xl font-bold text-white">{activity.count}</div>
                  <div className="text-sm text-white/90 font-quicksand">{activity.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-moss/30"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-sky" />
              <h2 className="text-xl font-quicksand font-bold text-white">Achievements</h2>
            </div>

            {analytics.profile.achievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {analytics.profile.achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="bg-white/5 rounded-lg p-3 text-center border border-moss/20"
                  >
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs text-white/90 font-quicksand capitalize">
                      {achievement.replace(/_/g, ' ')}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-white/60">
                Complete activities to unlock achievements!
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

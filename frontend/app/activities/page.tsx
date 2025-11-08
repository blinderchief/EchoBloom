'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { Wind, BookOpen, Heart, Compass, ArrowLeft, Activity } from 'lucide-react'
import Link from 'next/link'

interface ActivityCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  route: string
}

export default function ActivitiesHub() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [completedToday, setCompletedToday] = useState<string[]>([])

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  const activities: ActivityCard[] = [
    {
      id: 'breathing',
      title: 'Box Breathing',
      description: '4-4-4-4 breathing technique to calm your mind and reduce anxiety',
      icon: <Wind className="w-8 h-8" />,
      color: 'from-sky to-moss',
      route: '/activities/breathing'
    },
    {
      id: 'journal',
      title: 'Guided Journal',
      description: 'CBT-based journaling prompts to explore your thoughts and emotions',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-petal to-sunset',
      route: '/activities/journal'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Daily gratitude ritual to cultivate appreciation and joy',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-sunset to-petal',
      route: '/activities/gratitude'
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Sensory exercise to anchor yourself in the present moment',
      icon: <Compass className="w-8 h-8" />,
      color: 'from-moss to-moss-dark',
      route: '/activities/grounding'
    }
  ]

  const isCompleted = (activityId: string) => completedToday.includes(activityId)

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
              <Activity className="w-6 h-6 text-sunset" />
              <h1 className="text-2xl font-quicksand font-bold text-white">
                Wellness Activities
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-quicksand font-bold text-white mb-4">
            Your Wellness Toolkit
          </h2>
          <p className="text-lg text-sky/90 max-w-2xl mx-auto">
            Evidence-based practices to support your mental wellness journey.
            Complete activities to earn achievements and boost your wellness score.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={activity.route}>
                <div className="relative group cursor-pointer">
                  {/* Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-moss/30 hover:border-sunset/50 transition-all duration-300 hover:shadow-2xl">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${activity.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {activity.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-quicksand font-bold text-white mb-3 group-hover:text-sunset transition-colors">
                      {activity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sky/80 mb-4">
                      {activity.description}
                    </p>

                    {/* Status Badge */}
                    {isCompleted(activity.id) && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss/30 text-moss text-sm font-quicksand font-medium">
                        <span className="w-2 h-2 rounded-full bg-moss"></span>
                        Completed Today
                      </div>
                    )}

                    {/* Hover Arrow */}
                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-sunset flex items-center justify-center text-white">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-moss/10 backdrop-blur-sm rounded-2xl p-8 border border-moss/30"
        >
          <h3 className="text-xl font-quicksand font-bold text-white mb-4">💡 Pro Tips</h3>
          <ul className="space-y-3 text-sky/90">
            <li className="flex items-start gap-3">
              <span className="text-sunset font-bold">•</span>
              <span>Practice consistently - even 5 minutes daily creates lasting change</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sunset font-bold">•</span>
              <span>Find what works for you - different activities resonate with different people</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sunset font-bold">•</span>
              <span>Combine activities with your daily reflections for deeper insights</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sunset font-bold">•</span>
              <span>Track your progress in your garden to see your growth over time</span>
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  )
}

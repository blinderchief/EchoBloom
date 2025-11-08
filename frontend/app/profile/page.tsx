'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/molecules/GlassCard'
import { User, Mail, Calendar, Shield, TrendingUp, Heart, Download } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

export default function Profile() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalEchoes: 12,
    weeklyActive: 5,
    moodImprovement: 28,
    seedsShared: 3,
    impactScore: 89
  })

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/onboard')
    }
  }, [isSignedIn, router])

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss">
      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-quicksand font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Your Profile
          </motion.h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-moss to-sunset rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white">
                    {user?.firstName?.[0] || user?.emailAddresses[0].emailAddress[0].toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-quicksand font-bold text-white mb-2">
                    {user?.firstName || 'Garden Keeper'}
                  </h2>
                  <p className="text-white/60 font-quicksand mb-4">
                    {user?.emailAddresses[0].emailAddress}
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-2">
                      <Calendar size={16} />
                      <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-moss text-sm">
                      <Shield size={16} />
                      <span>GDPR Protected</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <GlassCard>
                <h3 className="text-white font-quicksand font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/garden')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-moss to-sunset text-white rounded-xl font-quicksand hover:shadow-lg transition-all text-left"
                  >
                    🌱 Go to Garden
                  </button>
                  <button
                    onClick={() => router.push('/seeds')}
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-xl font-quicksand hover:bg-white/20 transition-all text-left"
                  >
                    🌸 Browse Seeds
                  </button>
                  <button
                    className="w-full px-4 py-3 bg-white/10 text-white rounded-xl font-quicksand hover:bg-white/20 transition-all text-left flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export My Data
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard>
                <h3 className="text-white font-quicksand font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-moss" />
                  Your Wellness Journey
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-moss mb-1">{stats.totalEchoes}</div>
                    <div className="text-white/70 text-sm font-quicksand">Echoes Planted</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-sunset mb-1">{stats.weeklyActive}</div>
                    <div className="text-white/70 text-sm font-quicksand">Days Active</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-petal mb-1">{stats.moodImprovement}%</div>
                    <div className="text-white/70 text-sm font-quicksand">Mood Uplift</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-sky mb-1">{stats.seedsShared}</div>
                    <div className="text-white/70 text-sm font-quicksand">Seeds Shared</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-moss mb-1">{stats.impactScore}</div>
                    <div className="text-white/70 text-sm font-quicksand">Impact Score</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-3xl font-bold text-sunset mb-1">A+</div>
                    <div className="text-white/70 text-sm font-quicksand">Wellness Grade</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <h3 className="text-white font-quicksand font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-petal" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '🌱', text: 'Planted your first echo', date: '2 days ago' },
                    { icon: '🌸', text: 'Shared a seed that helped 5 blooms', date: '1 week ago' },
                    { icon: '🌟', text: 'Reached 10 total echoes', date: '1 week ago' },
                    { icon: '💚', text: 'Achieved 25% mood improvement', date: '2 weeks ago' }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="text-white font-quicksand">{achievement.text}</p>
                        <p className="text-white/50 text-sm">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Privacy & Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <h3 className="text-white font-quicksand font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-moss" />
                  Privacy & Data Control
                </h3>
                <p className="text-white/70 font-quicksand mb-4">
                  Your data is encrypted and protected. You have full control over your information.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white font-quicksand">End-to-end encryption</span>
                    <span className="text-moss text-sm">✓ Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white font-quicksand">Anonymous sharing</span>
                    <span className="text-moss text-sm">✓ Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-white font-quicksand">Data retention</span>
                    <span className="text-white/70 text-sm">30 days</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
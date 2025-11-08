'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/molecules/GlassCard'
import { Search, Heart, TrendingUp, Users } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

interface Seed {
  id: string
  content: string
  impact: number
  tags: string[]
  timestamp: Date
}

export default function Seeds() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [seeds, setSeeds] = useState<Seed[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [plantingId, setPlantingId] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/onboard')
    }
  }, [isSignedIn, router])

  useEffect(() => {
    // Generate sample seeds
    const sampleSeeds: Seed[] = [
      {
        id: '1',
        content: 'When anxiety strikes, try the 5-4-3-2-1 grounding technique. Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.',
        impact: 147,
        tags: ['anxiety', 'grounding', 'mindfulness'],
        timestamp: new Date()
      },
      {
        id: '2',
        content: 'Remember: It\'s okay to rest. Your worth isn\'t measured by your productivity. Sometimes the most productive thing you can do is recharge.',
        impact: 203,
        tags: ['burnout', 'self-care', 'rest'],
        timestamp: new Date()
      },
      {
        id: '3',
        content: 'Try journaling before bed. Write three things you\'re grateful for and one thing you\'re proud of today. Small wins count.',
        impact: 89,
        tags: ['gratitude', 'journaling', 'sleep'],
        timestamp: new Date()
      },
      {
        id: '4',
        content: 'When overwhelmed, try box breathing: Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 4 times.',
        impact: 156,
        tags: ['stress', 'breathing', 'meditation'],
        timestamp: new Date()
      },
      {
        id: '5',
        content: 'Reach out to someone today. A simple "thinking of you" message can brighten both your day and theirs.',
        impact: 91,
        tags: ['connection', 'community', 'kindness'],
        timestamp: new Date()
      },
      {
        id: '6',
        content: 'Move your body, even for 5 minutes. Dance, stretch, walk. Movement is medicine for the mind.',
        impact: 112,
        tags: ['movement', 'exercise', 'wellness'],
        timestamp: new Date()
      }
    ]
    setSeeds(sampleSeeds)
  }, [])

  const allTags = Array.from(new Set(seeds.flatMap(seed => seed.tags)))

  const filteredSeeds = seeds.filter(seed => {
    const matchesSearch = seed.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || seed.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handlePlantSeed = async (seed: Seed) => {
    setPlantingId(seed.id)
    
    try {
      // Call AI API to plant the seed as an echo
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: seed.content,
          userId: user?.id 
        })
      })

      const data = await response.json()
      
      // Update seed impact count
      setSeeds(prev => prev.map(s => 
        s.id === seed.id 
          ? { ...s, impact: s.impact + 1 }
          : s
      ))

      // Show success notification
      setNotification('🌱 Seed planted in your garden!')
      setTimeout(() => setNotification(''), 3000)

      // Optional: redirect to garden after a moment
      setTimeout(() => {
        router.push('/garden')
      }, 1500)
    } catch (error) {
      console.error('Error planting seed:', error)
      setNotification('❌ Failed to plant seed. Please try again.')
      setTimeout(() => setNotification(''), 3000)
    } finally {
      setPlantingId(null)
    }
  }

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
            Seed Marketplace 🌸
          </motion.h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <GlassCard className="px-6 py-3">
            <p className="text-white font-quicksand">{notification}</p>
          </GlassCard>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="Search seeds of wisdom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-moss font-quicksand"
                />
              </div>
              <button
                onClick={() => router.push('/garden')}
                className="px-6 py-3 bg-gradient-to-r from-moss to-sunset text-white rounded-xl font-quicksand hover:shadow-lg transition-all"
              >
                Back to Garden
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full font-quicksand transition-all ${
                  !selectedTag
                    ? 'bg-moss text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                All Seeds
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full font-quicksand transition-all ${
                    selectedTag === tag
                      ? 'bg-sunset text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Seeds Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeeds.map((seed, index) => (
            <motion.div
              key={seed.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col">
                <p className="text-white font-quicksand mb-4 flex-1">
                  {seed.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {seed.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 font-quicksand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-petal">
                    <Heart size={16} />
                    <span className="text-sm font-quicksand">
                      {seed.impact} blooms nurtured
                    </span>
                  </div>
                  <button 
                    onClick={() => handlePlantSeed(seed)}
                    disabled={plantingId === seed.id}
                    className="px-4 py-2 bg-moss/20 hover:bg-moss/40 text-moss rounded-lg font-quicksand transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {plantingId === seed.id ? 'Planting...' : 'Plant This'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {filteredSeeds.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <GlassCard className="max-w-md mx-auto">
              <p className="text-white/70 font-quicksand text-lg">
                No seeds found. Try adjusting your search or filters. 🌱
              </p>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
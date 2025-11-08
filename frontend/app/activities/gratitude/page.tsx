'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { Heart, ArrowLeft, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface GratitudeEntry {
  id: string
  text: string
  reason: string
}

export default function GratitudePractice() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [gratitudes, setGratitudes] = useState<GratitudeEntry[]>([])
  const [proudMoment, setProudMoment] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  const addGratitude = () => {
    if (gratitudes.length < 3) {
      setGratitudes([...gratitudes, { id: Date.now().toString(), text: '', reason: '' }])
    }
  }

  const updateGratitude = (id: string, field: 'text' | 'reason', value: string) => {
    setGratitudes(gratitudes.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const removeGratitude = (id: string) => {
    setGratitudes(gratitudes.filter(g => g.id !== id))
  }

  const handleComplete = async () => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const response = await fetch('http://localhost:8000/api/activities/gratitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          gratitudes: gratitudes.map(g => ({ text: g.text, reason: g.reason })),
          proud_moment: proudMoment
        }),
      })

      if (response.ok) {
        setIsComplete(true)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          // Reset for next session
          setGratitudes([])
          setProudMoment('')
          setIsComplete(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to save gratitude entry:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const canComplete = gratitudes.length === 3 && 
    gratitudes.every(g => g.text.trim() && g.reason.trim()) && 
    proudMoment.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-moss/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/activities">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-moss/20 hover:bg-moss/30 text-white transition-colors font-quicksand">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Activities</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-sunset" />
              <h1 className="text-2xl font-bold font-quicksand text-white">
                Gratitude Practice
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sunset to-petal text-white text-3xl mb-4">
            🙏
          </div>
          <h2 className="text-3xl font-bold font-quicksand text-white mb-3">
            Daily Gratitude Ritual
          </h2>
          <p className="text-sky/90 font-quicksand max-w-xl mx-auto">
            Research shows that practicing gratitude increases happiness, reduces depression, 
            and improves overall well-being. Let's cultivate appreciation together.
          </p>
        </motion.div>

        {/* Three Gratitudes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-quicksand text-white">
              Three Things I'm Grateful For
            </h3>
            {gratitudes.length < 3 && (
              <button
                onClick={addGratitude}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sunset/20 text-sunset hover:bg-sunset/30 transition-colors font-medium font-quicksand"
              >
                <Plus className="w-4 h-4" />
                Add Gratitude
              </button>
            )}
          </div>

          <div className="space-y-4">
            {gratitudes.map((gratitude, index) => (
              <motion.div
                key={gratitude.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-sunset to-petal flex items-center justify-center text-white font-bold font-quicksand">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={gratitude.text}
                      onChange={(e) => updateGratitude(gratitude.id, 'text', e.target.value)}
                      placeholder="What are you grateful for?"
                      className="w-full px-4 py-2 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset text-white placeholder:text-sky/60 font-quicksand"
                    />
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-sunset flex-shrink-0 mt-1" />
                      <input
                        type="text"
                        value={gratitude.reason}
                        onChange={(e) => updateGratitude(gratitude.id, 'reason', e.target.value)}
                        placeholder="Why does this matter to you? Be specific..."
                        className="flex-1 px-4 py-2 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset text-white placeholder:text-sky/60 text-sm font-quicksand"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeGratitude(gratitude.id)}
                    className="flex-shrink-0 p-2 text-sky/60 hover:text-sunset transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Empty State */}
            {gratitudes.length === 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-dashed border-sunset/50 text-center">
                <Heart className="w-12 h-12 text-sunset mx-auto mb-3" />
                <p className="text-sky/80 font-quicksand mb-4">
                  Start by adding your first gratitude
                </p>
                <button
                  onClick={addGratitude}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sunset to-petal text-white font-medium font-quicksand hover:from-petal hover:to-sunset transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Gratitude
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Proud Moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold font-quicksand text-white mb-4">
            One Thing I'm Proud Of Today
          </h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30">
            <textarea
              value={proudMoment}
              onChange={(e) => setProudMoment(e.target.value)}
              placeholder="What did you accomplish, no matter how small? It could be getting out of bed, making a phone call, or finishing a project. Celebrate yourself! 🎉"
              className="w-full min-h-[120px] p-4 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset resize-none text-white placeholder:text-sky/60 font-quicksand"
            />
          </div>
        </motion.div>

        {/* Complete Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleComplete}
            disabled={!canComplete || isComplete}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-sunset to-moss text-white font-bold font-quicksand hover:from-moss hover:to-sunset transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Practice Completed!
              </>
            ) : (
              <>Complete Gratitude Practice</>
            )}
          </button>
        </motion.div>

        {/* Benefits Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-moss/10 rounded-xl p-6 border border-moss/30"
        >
          <h4 className="font-bold font-quicksand text-white mb-3">💡 Why Gratitude Works</h4>
          <ul className="space-y-2 text-sm text-sky/90 font-quicksand">
            <li className="flex items-start gap-2">
              <span className="text-sunset">•</span>
              <span>Shifts focus from what's missing to what's present</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sunset">•</span>
              <span>Increases positive emotions and life satisfaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sunset">•</span>
              <span>Strengthens relationships and social connections</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sunset">•</span>
              <span>Being specific about "why" deepens the emotional impact</span>
            </li>
          </ul>
        </motion.div>
      </main>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-sunset to-petal text-white px-12 py-8 rounded-2xl shadow-2xl text-center font-quicksand">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold mb-2">Beautiful Work!</div>
              <div className="text-lg">Your gratitude has been saved</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

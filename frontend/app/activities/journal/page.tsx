'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { BookOpen, ArrowLeft, ChevronRight, ChevronLeft, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface JournalPrompt {
  category: string
  prompts: string[]
  description: string
  color: string
}

export default function GuidedJournal() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  const journalPrompts: JournalPrompt[] = [
    {
      category: 'Anxiety & Worry',
      color: 'from-sky to-moss',
      description: 'Explore and reframe anxious thoughts using CBT techniques',
      prompts: [
        'What specific situation or thought is making me anxious right now?',
        'What evidence do I have that supports this worry? What evidence contradicts it?',
        'What would I tell a friend who had this worry?',
        'What\'s the worst that could realistically happen? How would I cope?',
        'What\'s a more balanced way to think about this situation?'
      ]
    },
    {
      category: 'Difficult Emotions',
      color: 'from-petal to-sunset',
      description: 'Process and understand challenging feelings with compassion',
      prompts: [
        'What emotion am I experiencing right now? Where do I feel it in my body?',
        'What triggered this emotion? What happened just before I started feeling this way?',
        'What is this emotion trying to tell me or protect me from?',
        'How can I care for myself while experiencing this feeling?',
        'What do I need right now to feel supported or safe?'
      ]
    },
    {
      category: 'Self-Discovery',
      color: 'from-moss to-sky',
      description: 'Deepen self-awareness and understand your patterns',
      prompts: [
        'What values are most important to me? Am I living in alignment with them?',
        'What patterns do I notice in my thoughts, behaviors, or relationships?',
        'What parts of myself am I proud of? What am I working to develop?',
        'When do I feel most authentic and alive?',
        'What limiting beliefs might be holding me back?'
      ]
    },
    {
      category: 'Growth & Goals',
      color: 'from-moss to-moss-dark',
      description: 'Clarify intentions and build momentum toward your aspirations',
      prompts: [
        'What does growth look like for me right now?',
        'What small step could I take this week toward something I care about?',
        'What obstacles might come up, and how can I prepare for them?',
        'Who or what supports my growth? How can I engage with that more?',
        'How will I celebrate progress, even if it\'s small?'
      ]
    },
    {
      category: 'Relationship Reflection',
      color: 'from-sunset to-earth',
      description: 'Explore connection patterns and communication needs',
      prompts: [
        'What relationship is on my mind? What am I feeling about it?',
        'What do I appreciate about this person or connection?',
        'What needs of mine might not be getting met in this relationship?',
        'How could I communicate my feelings or needs more clearly?',
        'What boundaries would help me feel more respected or safe?'
      ]
    }
  ]

  const handleSave = async () => {
    if (!user || !currentCategory) return
    
    setIsSaving(true)
    try {
      const response = await fetch('http://localhost:8000/api/activities/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          category: currentCategory.category,
          prompts: currentCategory.prompts,
          responses: responses,
          emotion_tags: Object.keys(responses).length > 0 ? ['reflective', 'mindful'] : []
        }),
      })

      if (response.ok) {
        setIsSaved(true)
        setTimeout(() => {
          setIsSaved(false)
          // Reset for next session
          setSelectedCategory(null)
          setCurrentPromptIndex(0)
          setResponses({})
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const currentCategory = journalPrompts.find(j => j.category === selectedCategory)
  const currentPrompt = currentCategory?.prompts[currentPromptIndex]

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
              <BookOpen className="w-6 h-6 text-petal" />
              <h1 className="text-2xl font-quicksand font-bold text-white">
                Guided Journal
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            // Category Selection
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-quicksand text-white mb-3">
                  Choose Your Focus
                </h2>
                <p className="text-sky/90 font-quicksand">
                  Select a journaling theme that resonates with you today
                </p>
              </div>

              <div className="space-y-4">
                {journalPrompts.map((journal, index) => (
                  <motion.button
                    key={journal.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCategory(journal.category)}
                    className="w-full text-left"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30 hover:border-sunset/50 transition-all hover:shadow-lg group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${journal.color} flex-shrink-0 group-hover:scale-110 transition-transform`}></div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold font-quicksand text-white mb-2 group-hover:text-sunset transition-colors">
                            {journal.category}
                          </h3>
                          <p className="text-sky/80 text-sm font-quicksand">
                            {journal.description}
                          </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-sky/60 group-hover:text-sunset transition-colors" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            // Journal Writing
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setCurrentPromptIndex(0)
                    setResponses({})
                  }}
                  className="text-sunset hover:text-petal font-medium font-quicksand mb-4 inline-flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Change Category
                </button>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold font-quicksand text-white">{currentCategory?.category}</h2>
                  <span className="text-sm text-sky/80 font-quicksand">
                    Prompt {currentPromptIndex + 1} of {currentCategory?.prompts.length}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${currentCategory?.color} transition-all duration-500`}
                    style={{ width: `${((currentPromptIndex + 1) / (currentCategory?.prompts.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Prompt */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-moss/30 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-sunset flex-shrink-0 mt-1" />
                  <p className="text-lg text-white font-medium font-quicksand leading-relaxed">
                    {currentPrompt}
                  </p>
                </div>
                <textarea
                  value={responses[currentPrompt || ''] || ''}
                  onChange={(e) => setResponses({ ...responses, [currentPrompt || '']: e.target.value })}
                  placeholder="Take your time... there's no right or wrong answer. Write freely."
                  className="w-full min-h-[200px] p-4 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset resize-none text-white placeholder:text-sky/60 font-quicksand"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentPromptIndex(Math.max(0, currentPromptIndex - 1))}
                  disabled={currentPromptIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-medium font-quicksand hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-petal to-sunset text-white font-medium font-quicksand hover:from-sunset hover:to-petal transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {isSaved ? 'Saved!' : 'Save Progress'}
                  </button>

                  {currentPromptIndex < (currentCategory?.prompts.length || 0) - 1 ? (
                    <button
                      onClick={() => setCurrentPromptIndex(currentPromptIndex + 1)}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sunset to-petal text-white font-medium font-quicksand hover:from-petal hover:to-sunset transition-all shadow-lg"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleSave()
                        // TODO: Navigate to reflection summary
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-moss to-moss-dark text-white font-medium font-quicksand hover:from-moss-dark hover:to-moss transition-all shadow-lg"
                    >
                      Complete
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { Compass, ArrowLeft, Eye, Hand, Ear, Droplet, Apple, CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface GroundingStep {
  sense: string
  count: number
  icon: React.ReactNode
  color: string
  prompt: string
  placeholder: string
}

export default function GroundingExercise() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  const steps: GroundingStep[] = [
    {
      sense: 'See',
      count: 5,
      icon: <Eye className="w-8 h-8" />,
      color: 'from-sky to-moss',
      prompt: 'Name 5 things you can see around you',
      placeholder: 'e.g., a lamp, the wall, my hand...'
    },
    {
      sense: 'Touch',
      count: 4,
      icon: <Hand className="w-8 h-8" />,
      color: 'from-petal to-sunset',
      prompt: 'Name 4 things you can touch or feel',
      placeholder: 'e.g., the chair beneath me, my soft sweater...'
    },
    {
      sense: 'Hear',
      count: 3,
      icon: <Ear className="w-8 h-8" />,
      color: 'from-sunset to-petal',
      prompt: 'Name 3 things you can hear',
      placeholder: 'e.g., birds chirping, the hum of my computer...'
    },
    {
      sense: 'Smell',
      count: 2,
      icon: <Droplet className="w-8 h-8" />,
      color: 'from-moss to-moss-dark',
      prompt: 'Name 2 things you can smell (or like to smell)',
      placeholder: 'e.g., coffee, fresh air...'
    },
    {
      sense: 'Taste',
      count: 1,
      icon: <Apple className="w-8 h-8" />,
      color: 'from-sunset to-earth',
      prompt: 'Name 1 thing you can taste (or would like to taste)',
      placeholder: 'e.g., mint from my gum, the lingering taste of tea...'
    }
  ]

  const currentStepData = steps[currentStep]
  const totalResponses = steps.slice(0, currentStep).reduce((sum, step) => sum + step.count, 0)
  const progressPercentage = (totalResponses / 15) * 100

  const handleAddResponse = () => {
    if (currentInput.trim()) {
      const newResponses = [...responses, currentInput.trim()]
      setResponses(newResponses)
      setCurrentInput('')

      // Check if current step is complete
      const responsesForCurrentStep = newResponses.slice(
        steps.slice(0, currentStep).reduce((sum, step) => sum + step.count, 0)
      )
      
      if (responsesForCurrentStep.length >= currentStepData.count) {
        if (currentStep < steps.length - 1) {
          setTimeout(() => setCurrentStep(currentStep + 1), 500)
        } else {
          setIsComplete(true)
          // Auto-save when complete
          handleSaveSession(newResponses)
        }
      }
    }
  }

  const handleSaveSession = async (allResponses: string[]) => {
    if (!user) return
    
    setIsSaving(true)
    try {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000)
      
      // Split responses by sense (5 see, 4 touch, 3 hear, 2 smell, 1 taste)
      const response = await fetch('http://localhost:8000/api/activities/grounding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          see_items: allResponses.slice(0, 5),
          touch_items: allResponses.slice(5, 9),
          hear_items: allResponses.slice(9, 12),
          smell_items: allResponses.slice(12, 14),
          taste_items: allResponses.slice(14, 15),
          duration_seconds: durationSeconds
        }),
      })

      if (!response.ok) {
        console.error('Failed to save grounding session')
      }
    } catch (error) {
      console.error('Failed to save grounding session:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const responsesForCurrentStep = responses.slice(
    steps.slice(0, currentStep).reduce((sum, step) => sum + step.count, 0)
  )

  const remainingForStep = currentStepData.count - responsesForCurrentStep.length

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
              <Compass className="w-6 h-6 text-moss" />
              <h1 className="text-2xl font-bold font-quicksand text-white">
                5-4-3-2-1 Grounding
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Instructions */}
              <div className="text-center mb-8">
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStepData.color} text-white mb-4`}
                  key={currentStep}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {currentStepData.icon}
                </motion.div>
                <h2 className="text-3xl font-bold font-quicksand text-white mb-2">
                  {currentStepData.sense}
                </h2>
                <p className="text-lg text-sky/90 font-quicksand">
                  {currentStepData.prompt}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-sky/80 font-quicksand mb-2">
                  <span>Progress</span>
                  <span>{totalResponses + responsesForCurrentStep.length} / 15</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${currentStepData.color}`}
                    initial={{ width: `${progressPercentage}%` }}
                    animate={{ width: `${((totalResponses + responsesForCurrentStep.length) / 15) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>

              {/* Current Responses */}
              {responsesForCurrentStep.length > 0 && (
                <div className="mb-6 space-y-2">
                  {responsesForCurrentStep.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-moss/30"
                    >
                      <CheckCircle2 className="w-5 h-5 text-moss flex-shrink-0" />
                      <span className="text-white font-quicksand">{response}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center text-white text-sm font-bold font-quicksand`}>
                    {remainingForStep}
                  </div>
                  <span className="text-sm text-sky/80 font-quicksand">
                    {remainingForStep} more to go
                  </span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddResponse()}
                    placeholder={currentStepData.placeholder}
                    className="flex-1 px-4 py-3 bg-white/5 border border-moss/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss text-white placeholder:text-sky/60 font-quicksand"
                    autoFocus
                  />
                  <button
                    onClick={handleAddResponse}
                    disabled={!currentInput.trim()}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r ${currentStepData.color} text-white font-medium font-quicksand hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index < currentStep
                        ? 'bg-moss'
                        : index === currentStep
                        ? 'bg-sunset w-8'
                        : 'bg-white/20'
                    }`}
                  ></div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Completion Screen
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-moss to-moss-dark text-white text-5xl mb-6">
                ✓
              </div>
              <h2 className="text-4xl font-bold font-quicksand text-white mb-4">
                You're Grounded! 🌿
              </h2>
              <p className="text-lg text-sky/90 font-quicksand mb-8 max-w-xl mx-auto">
                You've successfully anchored yourself in the present moment.
                Notice how you feel - calmer, more centered, more aware.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-moss/30 mb-8">
                <h3 className="text-xl font-bold font-quicksand text-white mb-4">
                  Your Grounding Journey
                </h3>
                <div className="space-y-6">
                  {steps.map((step, stepIndex) => {
                    const stepResponses = responses.slice(
                      steps.slice(0, stepIndex).reduce((sum, s) => sum + s.count, 0),
                      steps.slice(0, stepIndex + 1).reduce((sum, s) => sum + s.count, 0)
                    )
                    return (
                      <div key={stepIndex} className="text-left">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                            {step.icon}
                          </div>
                          <h4 className="font-bold font-quicksand text-white">{step.sense}</h4>
                        </div>
                        <ul className="space-y-1 ml-13">
                          {stepResponses.map((response, index) => (
                            <li key={index} className="text-sky/80 text-sm font-quicksand">
                              • {response}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/garden">
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-moss to-moss-dark text-white font-bold font-quicksand hover:from-moss-dark hover:to-moss transition-all shadow-lg">
                    Return to Garden
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setCurrentStep(0)
                    setResponses([])
                    setCurrentInput('')
                    setIsComplete(false)
                  }}
                  className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold font-quicksand hover:bg-white/20 transition-all"
                >
                  Practice Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-moss/10 rounded-xl p-6 border border-moss/30"
          >
            <h4 className="font-bold font-quicksand text-white mb-2">💡 Why This Works</h4>
            <p className="text-sm text-sky/90 font-quicksand">
              The 5-4-3-2-1 technique interrupts anxious thought patterns by redirecting your 
              attention to your immediate sensory experience. It activates your parasympathetic 
              nervous system, helping you feel calmer and more present.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}

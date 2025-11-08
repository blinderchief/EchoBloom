'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import { Wind, ArrowLeft, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2'

export default function BoxBreathing() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [count, setCount] = useState(4)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev > 1) return prev - 1
          
          // Move to next phase
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold1'
            if (currentPhase === 'hold1') return 'exhale'
            if (currentPhase === 'exhale') return 'hold2'
            // Cycle complete
            setCyclesCompleted((c) => c + 1)
            return 'inhale'
          })
          
          return 4
        })
      }, 1000)

      sessionTimerRef.current = setInterval(() => {
        setSessionDuration((d) => d + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current)
    }
  }, [isActive])

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase('inhale')
    setCount(4)
    setCyclesCompleted(0)
    setSessionDuration(0)
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold1': return 'Hold'
      case 'exhale': return 'Breathe Out'
      case 'hold2': return 'Hold'
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-sky to-moss'
      case 'hold1': return 'from-moss to-moss-dark'
      case 'exhale': return 'from-petal to-sunset'
      case 'hold2': return 'from-sunset to-earth'
    }
  }

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-150'
    if (phase === 'exhale') return 'scale-75'
    return 'scale-100'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCompleteSession = async () => {
    if (!user || cyclesCompleted === 0) return
    
    setIsSaving(true)
    try {
      const response = await fetch('http://localhost:8000/api/activities/breathing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          cycles_completed: cyclesCompleted,
          duration_seconds: sessionDuration,
          technique: 'box_breathing',
          notes: `Completed ${cyclesCompleted} cycles in ${formatTime(sessionDuration)}`
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          // Reset session
          handleReset()
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to save breathing session:', error)
    } finally {
      setIsSaving(false)
    }
  }

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
              <Wind className="w-6 h-6 text-sky" />
              <h1 className="text-2xl font-quicksand font-bold text-white">
                Box Breathing
              </h1>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-moss/30"
        >
          <h2 className="text-xl font-quicksand font-bold text-white mb-3">How It Works</h2>
          <p className="text-sky/90 mb-4">
            Box breathing is a powerful stress-relief technique used by Navy SEALs, athletes, and meditators.
            Follow the visual cues to breathe in a 4-4-4-4 pattern.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky to-moss mx-auto mb-2 flex items-center justify-center text-white font-bold">1</div>
              <p className="text-sm text-white">Inhale 4s</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-moss to-moss-dark mx-auto mb-2 flex items-center justify-center text-white font-bold">2</div>
              <p className="text-sm text-white">Hold 4s</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-petal to-sunset mx-auto mb-2 flex items-center justify-center text-white font-bold">3</div>
              <p className="text-sm text-white">Exhale 4s</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sunset to-earth mx-auto mb-2 flex items-center justify-center text-white font-bold">4</div>
              <p className="text-sm text-white">Hold 4s</p>
            </div>
          </div>
        </motion.div>

        {/* Breathing Circle */}
        <div className="relative mb-8">
          <div className="aspect-square max-w-md mx-auto flex items-center justify-center">
            <motion.div
              className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center`}
              animate={{ scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.75 : 1 }}
              transition={{ duration: 4, ease: 'linear' }}
            >
              <div className="text-center text-white">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold mb-2"
                >
                  {getPhaseText()}
                </motion.div>
                <motion.div
                  key={count}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold"
                >
                  {count}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sky to-moss text-white font-quicksand font-bold hover:from-moss hover:to-moss-dark transition-all shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-sunset to-petal text-white font-quicksand font-bold hover:from-petal hover:to-sunset transition-all shadow-lg hover:shadow-xl"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-quicksand font-bold hover:bg-white/20 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Complete Session Button */}
        {cyclesCompleted > 0 && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={handleCompleteSession}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-moss to-moss-dark text-white font-quicksand font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Complete Session & Save'}
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30 text-center">
            <div className="text-3xl font-bold text-sky mb-1">{cyclesCompleted}</div>
            <div className="text-sm text-white/80 font-quicksand">Cycles Completed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-moss/30 text-center">
            <div className="text-3xl font-bold text-moss mb-1">{formatTime(sessionDuration)}</div>
            <div className="text-sm text-white/80 font-quicksand">Session Duration</div>
          </div>
        </div>

        {/* Achievement Notification */}
        <AnimatePresence>
          {cyclesCompleted > 0 && cyclesCompleted % 5 === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-moss to-moss-dark text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <div className="font-quicksand font-bold">Milestone Reached!</div>
                <div className="text-sm">{cyclesCompleted} cycles completed 🎉</div>
              </div>
            </motion.div>
          )}
          
          {/* Success Notification */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky to-moss text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <div className="font-quicksand font-bold">Session Saved! ✨</div>
                <div className="text-sm">Your progress has been recorded</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

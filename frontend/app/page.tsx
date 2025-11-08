'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AnimatedLogo } from '@/components/ui/atoms/AnimatedLogo'
import { FloatingOrb } from '@/components/ui/atoms/FloatingOrb'
import { GlassCard } from '@/components/ui/molecules/GlassCard'
import { Sparkles, Heart, Users, Shield } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-sunset" />,
      title: "AI-Powered Empathy",
      description: "Gemini AI nurtures your emotional seeds into blooming insights"
    },
    {
      icon: <Heart className="w-8 h-8 text-petal" />,
      title: "Living Garden",
      description: "Watch your wellness grow in a beautiful 3D garden visualization"
    },
    {
      icon: <Users className="w-8 h-8 text-moss" />,
      title: "Anonymous Community",
      description: "Share and receive wisdom through our empathy network"
    },
    {
      icon: <Shield className="w-8 h-8 text-navy" />,
      title: "Privacy First",
      description: "GDPR-compliant with end-to-end encryption for your peace of mind"
    }
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy via-navy-light to-moss">
      {/* Floating orbs background */}
      <FloatingOrb size={200} color="#A8D5BA" delay={0} className="top-10 left-10" />
      <FloatingOrb size={150} color="#F4A261" delay={1} className="top-1/3 right-20" />
      <FloatingOrb size={180} color="#FFB6D9" delay={2} className="bottom-20 left-1/4" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-8">
            <AnimatedLogo />
          </div>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-quicksand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Transform your mental wellness journey into a living, breathing garden. 
            Plant your emotions, nurture them with AI, and watch your resilience bloom.
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={() => router.push('/onboard')}
              className="px-8 py-4 bg-gradient-to-r from-moss to-sunset text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              suppressHydrationWarning
            >
              Start Your Garden
            </motion.button>
            <motion.button
              onClick={() => router.push('/garden')}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              suppressHydrationWarning
            >
              Explore Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
            >
              <GlassCard className="text-center h-full">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-quicksand">
                  {feature.title}
                </h3>
                <p className="text-white/70 font-quicksand text-sm">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <GlassCard className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-white/20">
              <div className="px-6 py-4">
                <div className="text-4xl font-bold text-moss mb-2">50K+</div>
                <div className="text-white/70 text-sm">Seeds Planted</div>
              </div>
              <div className="px-6 py-4">
                <div className="text-4xl font-bold text-sunset mb-2">95%</div>
                <div className="text-white/70 text-sm">User Satisfaction</div>
              </div>
              <div className="px-6 py-4">
                <div className="text-4xl font-bold text-petal mb-2">30%</div>
                <div className="text-white/70 text-sm">Mood Improvement</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  )
}

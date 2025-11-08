'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FloatingOrbProps {
  size?: number
  color?: string
  delay?: number
  className?: string
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({ 
  size = 100, 
  color = 'moss', 
  delay = 0,
  className = '' 
}) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: `var(--${color})`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  )
}

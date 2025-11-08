'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flower2 } from 'lucide-react'
import Link from 'next/link'

interface AnimatedLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '', size = 'lg', clickable = true }) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  }

  const logoContent = (
    <motion.div 
      className={`flex items-center gap-3 ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Flower2 className="text-sunset" size={size === 'lg' ? 48 : size === 'md' ? 36 : 24} />
      </motion.div>
      <div>
        <motion.h1 
          className={`${sizes[size]} font-quicksand font-bold bg-gradient-to-r from-moss via-sunset to-petal bg-clip-text text-transparent`}
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          EchoBloom
        </motion.h1>
        <motion.p 
          className="text-sm text-navy/70 font-quicksand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Plant your echoes, watch your wellness bloom
        </motion.p>
      </div>
    </motion.div>
  )

  if (clickable) {
    return <Link href="/">{logoContent}</Link>
  }

  return logoContent
}

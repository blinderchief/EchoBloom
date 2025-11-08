import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 bg-moss text-white rounded-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
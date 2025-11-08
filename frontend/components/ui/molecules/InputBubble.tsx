import React, { useState } from 'react'
import { Mic } from 'lucide-react'

interface InputBubbleProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const InputBubble: React.FC<InputBubbleProps> = ({ value, onChange, placeholder = 'Plant your echo...' }) => {
  const [isListening, setIsListening] = useState(false)

  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onChange(value + transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-white bg-opacity-20 rounded-2xl border border-moss resize-none"
        rows={4}
      />
      <button
        onClick={startListening}
        className={`absolute bottom-2 right-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-moss'} text-white`}
      >
        <Mic size={20} />
      </button>
    </div>
  )
}
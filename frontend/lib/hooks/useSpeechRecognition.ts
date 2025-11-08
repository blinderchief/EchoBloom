import { useState, useCallback } from 'react'

interface UseSpeechRecognitionResult {
  transcript: string
  isListening: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

/**
 * Custom hook for speech recognition with improved error handling
 * Handles common speech recognition errors gracefully
 */
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  const startListening = useCallback(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported. Please use Chrome or Edge.')
      return
    }

    try {
      const recognitionInstance = new (window as any).webkitSpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        setError(null)
      }

      recognitionInstance.onerror = (event: any) => {
        setIsListening(false)

        // Map error codes to user-friendly messages
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again and speak clearly.',
          'audio-capture': 'Microphone not found. Please check your microphone settings.',
          'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
          'network': 'Network error. Please check your internet connection.',
          'aborted': 'Voice input cancelled.',
          'language-not-supported': 'Language not supported. Please try English.',
        }

        const errorMessage = errorMessages[event.error] || `Voice input error: ${event.error}`

        // Only log actual errors to console (not expected ones like no-speech)
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error, event)
        }

        setError(errorMessage)
      }

      setRecognition(recognitionInstance)
      recognitionInstance.start()
    } catch (err) {
      console.error('Failed to start speech recognition:', err)
      setError('Could not start voice input. Please try again.')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}

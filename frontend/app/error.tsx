'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-moss/30 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h2 className="text-2xl font-quicksand font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-white/70 mb-6 font-quicksand">
          Don't worry, your wellness journey is still intact. Let's try to get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-moss to-sunset text-white rounded-lg font-quicksand font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/10 text-white rounded-lg font-quicksand font-semibold hover:bg-white/20 transition-all"
          >
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
            <p className="text-red-300 text-sm font-mono break-words">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

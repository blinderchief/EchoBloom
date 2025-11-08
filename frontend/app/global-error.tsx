'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-moss/30 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🌸</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Global Error Detected
            </h2>
            <p className="text-white/70 mb-6">
              We encountered a critical error. Please refresh the page.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-gradient-to-r from-moss to-sunset text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

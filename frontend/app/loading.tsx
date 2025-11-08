export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-moss flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-moss/30 mb-4">
          <div className="w-10 h-10 border-4 border-moss/30 border-t-moss rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-quicksand font-semibold text-white">
          Loading your garden...
        </h2>
      </div>
    </div>
  )
}

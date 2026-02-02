import HomeContent from '@/components/functional/HomeContent'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
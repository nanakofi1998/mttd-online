import Link from 'next/link'
import { AlertTriangle, BarChart2, Shield, Clock, MapPin, CheckCircle } from 'lucide-react'
import { GlobeBackground } from '@/components/ui/GlobeBackground'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col relative">
      <GlobeBackground />

      {/* Header */}
      <header className="border-b border-surface-800 bg-surface-950/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-200 leading-tight">MTTD Online</p>
              <p className="text-xs text-surface-500 leading-tight hidden sm:block">Motor Traffic & Transport Department</p>
            </div>
          </div>
          <Link href="/dashboard" className="btn-ghost text-xs sm:text-sm">
            Officer Portal →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 relative z-10">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary">Live reporting system</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-surface-200 leading-tight mb-4">
              Report a Road Accident<br />
              <span className="text-primary">Fast. Clear. Accurate.</span>
            </h1>

            <p className="text-base sm:text-lg text-surface-400 mb-8 max-w-xl">
              Use the MTTD Online portal to report road accidents in Ghana.
              Our guided form takes under 5 minutes and works on any device — even offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/report"
                className="btn-primary text-base py-3 px-6 text-center inline-flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report an Accident
              </Link>
              <Link
                href="/dashboard"
                className="btn-secondary text-base py-3 px-6 text-center inline-flex items-center justify-center gap-2"
              >
                <BarChart2 className="w-4 h-4" />
                MTDD Officer Login
              </Link>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Clock,
                title: 'Under 5 minutes',
                desc: 'Step-by-step guided form with auto-save so you never lose progress.',
              },
              {
                icon: MapPin,
                title: 'GPS location pinning',
                desc: 'Auto-detect your location or drop a pin on the map for precision.',
              },
              {
                icon: CheckCircle,
                title: 'Instant confirmation',
                desc: 'Get a reference ID immediately after submitting your report.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5 bg-surface-900/80 backdrop-blur-sm">
                <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-surface-200 mb-1">{title}</h3>
                <p className="text-sm text-surface-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-800 py-6 relative z-10">
        <p className="text-center text-xs text-surface-500">
          © {new Date().getFullYear()} Ghana Motor Traffic & Transport Department · MTTD Online
        </p>
      </footer>
    </div>
  )
}

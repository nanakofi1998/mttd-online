import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'
import { ReportWizard } from '@/components/report/ReportWizard'

export const metadata = {
  title: 'Report Accident | MTTD Online',
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-950/95 backdrop-blur-sm border-b border-surface-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-surface-400 hover:text-surface-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-200">Report Accident</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <ReportWizard />
    </div>
  )
}

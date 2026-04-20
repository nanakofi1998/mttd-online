'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Shield,
  X,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/accidents', icon: FileText, label: 'Accident Records' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-surface-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-200 leading-tight">MTTD Online</p>
            <p className="text-xs text-surface-500 leading-tight">Officer Portal</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-surface-500 hover:text-surface-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Report new link */}
      <div className="px-3 py-4 border-t border-surface-800">
        <Link
          href="/report"
          onClick={onClose}
          className="flex items-center gap-2 w-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          New Report
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-surface-900 border-r border-surface-800 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative w-64 bg-surface-900 border-r border-surface-800 h-full animate-slide-up">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

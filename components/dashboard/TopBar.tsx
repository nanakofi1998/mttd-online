'use client'

import { useState } from 'react'
import { Menu, Search, Bell, User } from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [query, setQuery] = useState('')

  return (
    <header className="h-16 bg-surface-900 border-b border-surface-800 flex items-center gap-3 px-4 flex-shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-surface-400 hover:text-surface-200 p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 pointer-events-none" />
        <input
          type="search"
          placeholder="Search accidents, plates, drivers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-9 pr-3 py-2 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface-900" />
      </button>

      {/* Avatar */}
      <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-surface-800 transition-colors">
        <div className="w-7 h-7 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium text-surface-200 leading-tight">Insp. Mensah</p>
          <p className="text-xs text-surface-500 leading-tight">Greater Accra</p>
        </div>
      </button>
    </header>
  )
}

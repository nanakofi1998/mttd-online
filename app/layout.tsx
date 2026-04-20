import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MTTD Online | Road Accident Reporting System',
  description: 'Ghana MTTD — Report and manage road accidents quickly and accurately.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}

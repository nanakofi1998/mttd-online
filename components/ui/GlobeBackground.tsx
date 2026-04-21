'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  lat: number
  lon: number
  lonSpeed: number
  alpha: number
  size: number
}

interface SignalArc {
  fromLat: number
  fromLon: number
  toLat: number
  toLon: number
  progress: number
  speed: number
  r: number
  g: number
  b: number
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

const SIGNAL_COLORS = [
  hexToRgb('#2563EB'),
  hexToRgb('#0D9488'),
  hexToRgb('#06B6D4'),
  hexToRgb('#3B82F6'),
]

export function GlobeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let rotation = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const project = (lat: number, lon: number, rot: number, R: number, cx: number, cy: number) => {
      const phi = (lat * Math.PI) / 180
      const theta = ((lon + rot) * Math.PI) / 180
      const x = R * Math.cos(phi) * Math.sin(theta)
      const y = R * Math.sin(phi)
      const z = R * Math.cos(phi) * Math.cos(theta)
      return { sx: cx + x, sy: cy - y, z }
    }

    const particles: Particle[] = Array.from({ length: 100 }, () => ({
      lat: Math.random() * 160 - 80,
      lon: Math.random() * 360,
      lonSpeed: (0.15 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1),
      alpha: 0.3 + Math.random() * 0.7,
      size: 0.8 + Math.random() * 1.8,
    }))

    const arcs: SignalArc[] = Array.from({ length: 8 }, () => {
      const c = SIGNAL_COLORS[Math.floor(Math.random() * SIGNAL_COLORS.length)]
      return {
        fromLat: Math.random() * 160 - 80,
        fromLon: Math.random() * 360,
        toLat: Math.random() * 160 - 80,
        toLon: Math.random() * 360,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        r: c.r, g: c.g, b: c.b,
      }
    })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      rotation += 0.06

      const R = Math.min(canvas.width, canvas.height) * 0.36
      // Shift globe right on wider screens for composition with hero text
      const cx = canvas.width > 900 ? canvas.width * 0.65 : canvas.width / 2
      const cy = canvas.height * 0.5

      // Atmosphere glow
      const atm = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.3)
      atm.addColorStop(0, 'rgba(37,99,235,0.06)')
      atm.addColorStop(0.5, 'rgba(6,182,212,0.03)')
      atm.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = atm
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2)
      ctx.fill()

      // Latitude grid lines
      for (let lat = -80; lat <= 80; lat += 15) {
        ctx.beginPath()
        let started = false
        for (let lon = 0; lon <= 361; lon += 2) {
          const p = project(lat, lon, rotation, R, cx, cy)
          if (p.z < 0) { started = false; continue }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true }
          else ctx.lineTo(p.sx, p.sy)
        }
        ctx.strokeStyle = 'rgba(37,99,235,0.18)'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Longitude grid lines
      for (let lon = 0; lon < 360; lon += 15) {
        ctx.beginPath()
        let started = false
        for (let lat = -90; lat <= 90; lat += 2) {
          const p = project(lat, lon, rotation, R, cx, cy)
          if (p.z < 0) { started = false; continue }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true }
          else ctx.lineTo(p.sx, p.sy)
        }
        ctx.strokeStyle = 'rgba(13,148,136,0.13)'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Particles
      for (const pt of particles) {
        pt.lon += pt.lonSpeed * 0.25
        const p = project(pt.lat, pt.lon, rotation, R, cx, cy)
        if (p.z < 0) continue
        const depth = (p.z / R + 1) / 2
        const a = pt.alpha * depth

        // Outer glow
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, pt.size * 5)
        glow.addColorStop(0, `rgba(37,99,235,${a * 0.25})`)
        glow.addColorStop(1, 'rgba(37,99,235,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, pt.size * 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, pt.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(96,165,250,${a})`
        ctx.fill()
      }

      // Signal arcs
      for (const arc of arcs) {
        arc.progress += arc.speed
        if (arc.progress > 1) {
          const c = SIGNAL_COLORS[Math.floor(Math.random() * SIGNAL_COLORS.length)]
          arc.fromLat = Math.random() * 160 - 80
          arc.fromLon = Math.random() * 360
          arc.toLat = Math.random() * 160 - 80
          arc.toLon = Math.random() * 360
          arc.progress = 0
          arc.speed = 0.002 + Math.random() * 0.004
          arc.r = c.r; arc.g = c.g; arc.b = c.b
        }

        // Trail
        ctx.beginPath()
        let started = false
        const tail = Math.max(0, arc.progress - 0.18)
        for (let t = tail; t <= arc.progress; t += 0.015) {
          const lat = arc.fromLat + (arc.toLat - arc.fromLat) * t
          const lon = arc.fromLon + (arc.toLon - arc.fromLon) * t
          const p = project(lat, lon, rotation, R, cx, cy)
          if (p.z < 0) { started = false; continue }
          if (!started) { ctx.moveTo(p.sx, p.sy); started = true }
          else ctx.lineTo(p.sx, p.sy)
        }
        const trailA = Math.min(arc.progress * 5, 1) * 0.7
        ctx.strokeStyle = `rgba(${arc.r},${arc.g},${arc.b},${trailA})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Head dot
        const hLat = arc.fromLat + (arc.toLat - arc.fromLat) * arc.progress
        const hLon = arc.fromLon + (arc.toLon - arc.fromLon) * arc.progress
        const h = project(hLat, hLon, rotation, R, cx, cy)
        if (h.z >= 0) {
          ctx.beginPath()
          ctx.arc(h.sx, h.sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${arc.r},${arc.g},${arc.b})`
          ctx.fill()

          const pulse = ctx.createRadialGradient(h.sx, h.sy, 0, h.sx, h.sy, 10)
          pulse.addColorStop(0, `rgba(${arc.r},${arc.g},${arc.b},0.4)`)
          pulse.addColorStop(1, `rgba(${arc.r},${arc.g},${arc.b},0)`)
          ctx.fillStyle = pulse
          ctx.beginPath()
          ctx.arc(h.sx, h.sy, 10, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Node intersection highlights at grid crossings (visible side only)
      for (let lat = -60; lat <= 60; lat += 30) {
        for (let lon = 0; lon < 360; lon += 30) {
          const p = project(lat, lon, rotation, R, cx, cy)
          if (p.z < 10) continue
          const depth = (p.z / R + 1) / 2
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6,182,212,${0.5 * depth})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

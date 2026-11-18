
/**
 * FloatingFireflies
 * Luciérnagas champagne y rosadas que flotan con movimientos aleatorios.
 */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FloatingFirefliesProps {
  count?: number
  className?: string
}

const TONES = [
  { className: 'bg-champagne', glow: 'color-mix(in oklab, var(--champagne) 80%, transparent)' },
  { className: 'bg-blush', glow: 'color-mix(in oklab, var(--blush) 85%, transparent)' },
  { className: 'bg-rose-soft', glow: 'color-mix(in oklab, var(--rose-soft) 85%, transparent)' },
] as const

export function FloatingFireflies({
  count = 18,
  className = '',
}: FloatingFirefliesProps) {
  const [fireflies, setFireflies] = useState<
    Array<{
      id: number
      left: number
      top: number
      size: number
      duration: number
      delay: number
      drift: number
      tone: (typeof TONES)[number]
    }>
  >([])

  useEffect(() => {
    setFireflies(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 6,
        drift: 20 + Math.random() * 60,
        tone: TONES[Math.floor(Math.random() * TONES.length)]!,
      })),
    )
  }, [count])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {fireflies.map((f) => (
        <motion.span
          key={f.id}
          className={`absolute rounded-full ${f.tone.className}`}
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            boxShadow: `0 0 8px 2px ${f.tone.glow}`,
          }}
          animate={{
            x: [0, f.drift, -f.drift / 2, 0],
            y: [0, -f.drift, f.drift / 3, 0],
            opacity: [0, 1, 0.4, 1, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

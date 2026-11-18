/**
 * FloatingBlossoms
 * Pétalos de rosa y florecillas pastel que caen suavemente con vaivén y giro.
 */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const PETAL_COLORS = ['var(--blush)', 'var(--rose-soft)', 'var(--petal)', 'var(--lavender)', 'var(--peach)']

function Blossom({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={12}
          cy={6.5}
          rx={3.4}
          ry={5.4}
          fill={color}
          opacity={0.9}
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx={12} cy={12} r={2} fill="var(--champagne)" />
    </svg>
  )
}

function Petal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 C19 6 20 15 12 22 C4 15 5 6 12 2Z" fill={color} opacity={0.92} />
      <path
        d="M12 5 C13.5 10 13.5 15 12 19"
        stroke="color-mix(in oklab, var(--rose-deep) 25%, transparent)"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}

interface FloatingBlossomsProps {
  count?: number
  className?: string
}

export function FloatingBlossoms({ count = 6, className = '' }: FloatingBlossomsProps) {
  const [blossoms, setBlossoms] = useState<
    Array<{
      id: number
      left: number
      size: number
      duration: number
      delay: number
      sway: number
      color: string
      petal: boolean
    }>
  >([])

  useEffect(() => {
    setBlossoms(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 12,
        duration: 11 + Math.random() * 10,
        delay: Math.random() * 10,
        sway: 20 + Math.random() * 40,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]!,
        petal: Math.random() < 0.6,
      })),
    )
  }, [count])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {blossoms.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: `${b.left}%` }}
          initial={{ top: '-10%', opacity: 0, rotate: 0 }}
          animate={{
            top: ['-10%', '110%'],
            x: [0, b.sway, -b.sway, 0],
            rotate: [0, 140, 280, 360],
            rotateY: [0, 180, 360],
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          {b.petal ? <Petal size={b.size} color={b.color} /> : <Blossom size={b.size} color={b.color} />}
        </motion.div>
      ))}
    </div>
  )
}

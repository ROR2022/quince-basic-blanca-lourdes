/**
 * EnchantedBackground
 * Fondo global fijo en rosa pastel: degradado, halos, luces bokeh que flotan,
 * destellos, pétalos que caen y una silueta de castillo muy sutil.
 */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FloatingBlossoms } from './floating-blossoms'
import { FloatingFireflies } from './floating-fireflies'
import { Sparkle } from './ornaments'

const BOKEH_COLORS = ['var(--blush)', 'var(--rose-soft)', 'var(--lavender)', 'var(--peach)', 'var(--petal)']

function CastleLine({ className = '', opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M0 300V250h70v-44h54v44h38v-76h43v-72h30v72h43v76h35v-52h58v52h36v-86h36v-58h28v58h36v86h43v-44h60v44h48v-68h40v-54h30v54h40v68h70v46Z"
        fill="currentColor"
      />
    </svg>
  )
}

type Bokeh = { id: number; left: number; top: number; size: number; color: string; duration: number; dx: number; dy: number }
type Star = { id: number; left: number; top: number; size: number; delay: number; rose: boolean }

export function EnchantedBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [bokeh, setBokeh] = useState<Bokeh[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 90,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 5,
        rose: Math.random() < 0.4,
      })),
    )
    setBokeh(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 120 + Math.random() * 200,
        color: BOKEH_COLORS[i % BOKEH_COLORS.length]!,
        duration: 16 + Math.random() * 14,
        dx: (Math.random() - 0.5) * 120,
        dy: (Math.random() - 0.5) * 120,
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-sky)' }} />

      {/* Halos rosados y lavanda */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 20% 0%, color-mix(in oklab, var(--rose-soft) 45%, transparent), transparent 70%), radial-gradient(ellipse 55% 45% at 90% 20%, color-mix(in oklab, var(--lavender) 60%, transparent), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, color-mix(in oklab, var(--peach) 55%, transparent), transparent 70%)',
        }}
      />

      {/* Luces bokeh */}
      {bokeh.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: 0.45,
          }}
          animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: b.duration, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
      ))}

      {/* Destellos */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className={`absolute ${s.rose ? 'text-rose-soft' : 'text-champagne'}`}
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1, 0.5], rotate: [0, 45, 90] }}
          transition={{
            duration: 3 + s.delay,
            delay: s.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <Sparkle size={s.size} />
        </motion.span>
      ))}

      {/* Castillo de cuento muy sutil */}
      <CastleLine className="absolute inset-x-0 bottom-0 h-[34vh] w-full text-rose-soft" opacity={0.14} />
      <CastleLine className="absolute inset-x-0 bottom-0 h-[24vh] w-full text-lavender" opacity={0.25} />

      <FloatingBlossoms count={10} />
      <FloatingFireflies count={12} />
    </div>
  )
}

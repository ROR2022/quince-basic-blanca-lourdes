
/**
 * EnchantedBackground
 * Fondo global fijo en tonos pastel: gradientes, siluetas de castillos,
 * niebla translúcida, luna creciente, estrellas y luciérnagas.
 * Permanece durante el scroll sin afectar la legibilidad.
 */
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FloatingFireflies } from './floating-fireflies'

function CastleLine({
  className = '',
  opacity = 1,
}: {
  className?: string
  opacity?: number
}) {
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

export function EnchantedBackground() {
  const [stars, setStars] = useState<
    Array<{ id: number; left: number; top: number; size: number; delay: number }>
  >([])

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 55,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Gradiente base marfil y azul cielo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--sky) 0%, var(--ivory) 48%, var(--ivory) 100%)',
        }}
      />

      {/* Halos fríos y cálidos de baja intensidad */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 30% 0%, rgba(215,234,244,0.55), transparent 70%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 80% 15%, rgba(220,232,213,0.48), transparent 72%)',
        }}
      />

      {/* Luna creciente */}
      <div className="absolute right-[12%] top-[8%]">
        <div
          className="h-20 w-20 rounded-full"
          style={{
            boxShadow: '14px 8px 0 0 var(--ivory), 0 0 60px 10px rgba(255,248,242,0.4)',
            background: 'transparent',
          }}
        />
      </div>

      {/* Estrellas sutiles */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-champagne"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{
            duration: 3 + s.delay,
            delay: s.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Niebla azul cielo animada */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'linear-gradient(0deg, rgba(215,234,244,0.38), transparent)',
          animation: 'drift 18s ease-in-out infinite',
        }}
      />

      {/* Siluetas originales de castillos para el tema de cuento de hadas */}
      <CastleLine
        className="absolute inset-x-0 bottom-0 h-[38vh] w-full text-sage"
        opacity={0.1}
      />
      <CastleLine
        className="absolute inset-x-0 bottom-0 h-[28vh] w-full text-slate"
        opacity={0.08}
      />

      {/* Luciérnagas globales */}
      <FloatingFireflies count={14} />

      {/* Viñeta suave para conservar profundidad sin oscurecer el lienzo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(229,220,240,0.2) 100%)',
        }}
      />
    </div>
  )
}

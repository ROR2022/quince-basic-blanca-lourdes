/**
 * BasicHero
 * Portada con medallón floral en rosa pastel: tiara, "XV" y rosas,
 * nombre con brillo, cita bíblica y fecha. Se revela al abrir el sobre.
 */
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { invitationConfig } from '@/lib/config'
import { MagicalButterflies } from './magical-butterflies'
import { FloralDivider, Sparkle, SvgLeaf, SvgRose } from './ornaments'

function formatLongDate(iso: string, timeZone: string) {
  const date = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso))

  return `${date.charAt(0).toUpperCase()}${date.slice(1)}`
}

const EASE = [0.22, 1, 0.36, 1] as const

function FloralMedallion({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="medallion-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="var(--ivory)" />
          <stop offset="65%" stopColor="var(--petal)" />
          <stop offset="100%" stopColor="var(--blush)" />
        </radialGradient>
        <linearGradient id="xv-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--rose-deep)" />
          <stop offset="50%" stopColor="var(--rose)" />
          <stop offset="100%" stopColor="var(--champagne)" />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill="url(#medallion-bg)" />
      <ellipse cx="160" cy="200" rx="128" ry="168" fill="none" stroke="var(--champagne)" strokeWidth="2" opacity="0.8" />
      <ellipse cx="160" cy="200" rx="118" ry="158" fill="none" stroke="var(--rose-soft)" strokeWidth="1" strokeDasharray="2 6" />

      {/* Tiara */}
      <g transform="translate(116 70)">
        <path d="M4 40 L12 14 L26 30 L44 4 L62 30 L76 14 L84 40 Z" fill="var(--champagne)" stroke="var(--rose-deep)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 40 H84" stroke="var(--rose-deep)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.5" fill="var(--rose-soft)" />
        <circle cx="44" cy="3" r="4" fill="var(--rose)" />
        <circle cx="76" cy="12" r="3.5" fill="var(--rose-soft)" />
        <circle cx="30" cy="34" r="2" fill="var(--ivory)" />
        <circle cx="58" cy="34" r="2" fill="var(--ivory)" />
      </g>

      {/* XV */}
      <text
        x="160"
        y="235"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="130"
        fill="url(#xv-grad)"
      >
        XV
      </text>
      <text x="160" y="272" textAnchor="middle" fontFamily="'Cinzel', serif" fontSize="14" letterSpacing="6" fill="var(--rose-deep)">
        AÑOS
      </text>

      {/* Ramo inferior */}
      <SvgLeaf x={70} y={330} size={20} rotate={-30} />
      <SvgLeaf x={250} y={330} size={20} rotate={30} />
      <SvgLeaf x={120} y={360} size={18} rotate={-10} />
      <SvgLeaf x={200} y={360} size={18} rotate={10} />
      <SvgLeaf x={160} y={372} size={16} rotate={90} />
      <SvgRose x={92} y={318} r={18} color="var(--peach)" />
      <SvgRose x={228} y={318} r={18} color="var(--lavender)" />
      <SvgRose x={126} y={340} r={24} color="var(--rose-soft)" />
      <SvgRose x={194} y={340} r={24} color="var(--blush)" />
      <SvgRose x={160} y={330} r={30} color="var(--rose)" />

      {/* Rosas superiores */}
      <SvgLeaf x={58} y={112} size={14} rotate={-60} />
      <SvgLeaf x={262} y={112} size={14} rotate={60} />
      <SvgRose x={70} y={96} r={14} color="var(--rose-soft)" />
      <SvgRose x={250} y={96} r={14} color="var(--rose-soft)" />
      <SvgRose x={52} y={130} r={9} color="var(--peach)" />
      <SvgRose x={268} y={130} r={9} color="var(--lavender)" />
    </svg>
  )
}

export function BasicHero({ revealed = true }: { revealed?: boolean }) {
  const { quinceanera, event } = invitationConfig
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 1, delay, ease: EASE },
  })

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      <MagicalButterflies count={6} />

      <motion.div style={{ y: textY }} {...show(0.2)} className="z-10 flex flex-col items-center text-center">
        <span className="font-display text-sm uppercase tracking-[0.4em] text-rose">Mis XV Años</span>
        <FloralDivider />
      </motion.div>

      <motion.div
        style={{ y: photoY }}
        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
        animate={revealed ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -4 }}
        transition={{ duration: 1.3, delay: 0.4, ease: EASE }}
        className="relative z-10 my-6"
      >
        {/* Aro de destellos girando */}
        <motion.div
          className="pointer-events-none absolute -inset-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={`absolute left-1/2 top-1/2 ${i % 2 ? 'text-rose-soft' : 'text-champagne'}`}
              style={{ transform: `rotate(${i * 45}deg) translateY(-190px)` }}
            >
              <Sparkle size={i % 2 ? 10 : 14} />
            </span>
          ))}
        </motion.div>
        <motion.div
          className="quince-glow relative h-72 w-56 overflow-hidden rounded-[45%_45%_45%_45%/40%_40%_60%_60%] border-2 border-rose-soft sm:h-96 sm:w-72"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          <FloralMedallion label={`Medallón floral de los XV años de ${quinceanera.name}`} />
        </motion.div>
      </motion.div>

      <motion.div style={{ y: textY }} {...show(0.9)} className="z-10 flex flex-col items-center text-center">
        <h1 className="name-shimmer font-script text-7xl leading-[1.2] sm:text-9xl">{quinceanera.name}</h1>

        <blockquote className="mt-6 max-w-lg text-pretty font-serif text-lg italic leading-relaxed text-ink sm:text-xl">
          {quinceanera.phrase}
        </blockquote>
        <p className="mt-2 font-display text-sm text-rose">{quinceanera.verseReference}</p>

        <div className="mt-8 flex items-center gap-3 text-ink">
          <Sparkle size={10} className="text-champagne" />
          <span className="h-px w-8 bg-rose-soft" />
          <span className="font-display text-sm uppercase tracking-[0.25em]">
            {formatLongDate(event.date, event.timeZone)}
          </span>
          <span className="h-px w-8 bg-rose-soft" />
          <Sparkle size={10} className="text-champagne" />
        </div>
      </motion.div>
    </section>
  )
}

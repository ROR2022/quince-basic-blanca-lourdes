
/**
 * BasicHero
 * Portada ilustrada de cuento de hadas con nombre, cita bíblica y fecha local.
 * Incluye un parallax ligero y un resplandor pastel sutil.
 */
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { invitationConfig } from '@/lib/config'
import { MagicalButterflies } from './magical-butterflies'

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

export function BasicHero() {
  const { quinceanera, event } = invitationConfig
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Parallax ligero de la foto y los textos
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      <MagicalButterflies count={5} />

      {/* Encabezado */}
      <motion.div
        style={{ y: textY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 flex flex-col items-center text-center"
      >
        <span className="font-display text-sm uppercase tracking-[0.4em] text-ink">
          Mis XV Años
        </span>
        <div className="my-3 h-px w-24 bg-champagne/70" />
      </motion.div>

      {/* Ilustración original de castillo y corona */}
      <motion.div
        style={{ y: photoY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 my-6"
      >
        <motion.div
          className="relative h-72 w-56 overflow-hidden rounded-[45%_45%_45%_45%/40%_40%_60%_60%] border-2 border-sky quince-glow sm:h-96 sm:w-72"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 320 400"
            className="h-full w-full"
            role="img"
            aria-label={`Ilustración de cuento de hadas para los XV años de ${quinceanera.name}`}
          >
            <defs>
              <linearGradient id="castle-sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--ivory)" />
                <stop offset="100%" stopColor="var(--sky)" />
              </linearGradient>
            </defs>
            <rect width="320" height="400" fill="url(#castle-sky)" />
            <circle cx="248" cy="82" r="34" fill="var(--champagne)" opacity=".65" />
            <path
              d="M0 336 Q80 296 160 334 T320 324 V400 H0Z"
              fill="var(--lavender)"
              opacity=".8"
            />
            <path
              d="M70 322V204h48v-54h34v54h16v-84h44v84h18v-54h34v54h22v118Z"
              fill="var(--sage)"
              stroke="var(--slate)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="m66 207 28-39 28 39m43-3 25-43 25 43m14 4 25-39 25 39"
              fill="var(--lavender)"
              stroke="var(--slate)"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M151 322v-76a23 23 0 0 1 46 0v76"
              fill="var(--ivory)"
              stroke="var(--slate)"
              strokeWidth="4"
            />
            <path
              d="m146 100 8-20 13 14 13-27 13 27 13-14 8 20Z"
              fill="var(--champagne)"
              stroke="var(--slate)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M145 104h64" stroke="var(--slate)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="180" cy="67" r="5" fill="var(--champagne)" />
            <circle cx="156" cy="84" r="4" fill="var(--sky)" />
            <circle cx="204" cy="84" r="4" fill="var(--peach)" />
            <path d="M0 356q35-25 70 0t70 0 70 0 70 0 70 0" fill="none" stroke="var(--champagne)" strokeWidth="3" opacity=".8" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Nombre de la quinceañera (script con brillo azul y champagne) */}
      <motion.div
        style={{ y: textY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="z-10 flex flex-col items-center text-center"
      >
        <h1 className="name-shimmer font-script text-7xl leading-[1.2] sm:text-9xl">
          {quinceanera.name}
        </h1>

        <blockquote className="mt-6 max-w-lg text-pretty font-serif text-lg italic leading-relaxed text-ink sm:text-xl">
          {quinceanera.phrase}
        </blockquote>
        <p className="mt-2 font-display text-sm text-slate">
          {quinceanera.verseReference}
        </p>

        <div className="mt-8 flex items-center gap-3 text-ink">
          <span className="h-px w-8 bg-champagne/70" />
          <span className="font-display text-sm uppercase tracking-[0.25em]">
            {formatLongDate(event.date, event.timeZone)}
          </span>
          <span className="h-px w-8 bg-champagne/70" />
        </div>
      </motion.div>
    </section>
  )
}

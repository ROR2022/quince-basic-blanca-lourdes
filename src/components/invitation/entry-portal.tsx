/**
 * EntryPortal
 * Sobre de invitación realista en rosa pastel. Al pulsar el sello o el botón,
 * el sello se rompe, la solapa se abre, la tarjeta sale del sobre y se revela
 * la invitación. También activa la música.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { invitationConfig } from '@/lib/config'
import { FloatingBlossoms } from './floating-blossoms'
import { FloatingFireflies } from './floating-fireflies'
import { FloralDivider, Sparkle } from './ornaments'

interface EntryPortalProps {
  visible: boolean
  /** Se llama en el clic (gesto del usuario) para iniciar la música. */
  onOpen: () => void
  /** Se llama al terminar la animación del sobre. */
  onEnter: () => void
  guest: {
    name: string
    quantity: string
    companionLimit: number | null
  } | null
}

type Phase = 'closed' | 'breaking' | 'flap' | 'letter' | 'leaving'

const EASE = [0.22, 1, 0.36, 1] as const

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
}

function SealFace({ monogram }: { monogram: string }) {
  return (
    <div className="wax-seal flex h-full w-full items-center justify-center rounded-full">
      <div className="wax-seal-ring flex h-[78%] w-[78%] items-center justify-center rounded-full">
        <span className="seal-text font-script text-2xl leading-none sm:text-3xl">{monogram}</span>
      </div>
    </div>
  )
}

export function EntryPortal({ visible, onOpen, onEnter, guest }: EntryPortalProps) {
  const { quinceanera, event } = invitationConfig
  const [phase, setPhase] = useState<Phase>('closed')
  const timers = useRef<number[]>([])
  const monogram = initials(quinceanera.name)

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const opened = phase !== 'closed'
  const flapOpen = phase === 'flap' || phase === 'letter' || phase === 'leaving'
  const letterOut = phase === 'letter' || phase === 'leaving'

  function handleOpen() {
    if (opened) return
    onOpen()
    setPhase('breaking')
    const schedule = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    schedule(() => setPhase('flap'), 550)
    schedule(() => setPhase('letter'), 1400)
    schedule(() => setPhase('leaving'), 2700)
    schedule(onEnter, 2800)
  }

  const eventDate = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: event.timeZone,
  }).format(new Date(event.date))

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-5 text-center"
          style={{ background: 'var(--gradient-sky)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <FloatingBlossoms count={16} />
          <FloatingFireflies count={18} />

          {/* Encabezado */}
          <motion.div
            className="relative z-10 mb-[min(7rem,12svh)] flex flex-col items-center"
            initial={{ opacity: 0, y: -16 }}
            animate={opened ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: opened ? 0 : 0.2 }}
          >
            <Sparkle size={22} className="text-champagne [@media(max-height:700px)]:hidden" />
            <p className="mt-3 font-display text-xs uppercase tracking-[0.35em] text-rose">
              Mis XV años
            </p>
            <p className="mt-2 max-w-xs font-serif text-2xl leading-snug text-ink sm:text-3xl">
              Una noche mágica está por comenzar
            </p>
          </motion.div>

          {/* Sobre */}
          <motion.div
            className="relative z-10 aspect-[7/5] w-[min(88vw,440px,calc((100svh-360px)*1.4))] min-w-[260px]"
            style={{ perspective: 1400 }}
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={
              phase === 'leaving'
                ? { opacity: 0, y: 60, scale: 0.92, rotate: 0 }
                : opened
                  ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                  : { opacity: 1, y: [0, -8, 0], scale: 1, rotate: [-2, -1, -2] }
            }
            transition={
              opened
                ? { duration: 0.7, ease: EASE }
                : {
                    opacity: { duration: 0.8, delay: 0.3 },
                    scale: { duration: 0.8 },
                    y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                    rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
                  }
            }
          >
            {/* Cuerpo trasero del sobre */}
            <div className="envelope-body absolute inset-0 rounded-md" />
            <div
              className="envelope-liner absolute inset-x-0 top-0 h-[58%]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />

            {/* Tarjeta */}
            <motion.div
              className="envelope-paper absolute inset-x-[6%] top-[5%] h-[88%] rounded-sm px-4 py-3"
              style={{ zIndex: letterOut ? 25 : 20 }}
              initial={false}
              animate={
                phase === 'leaving'
                  ? { y: '-62%', scale: 1.08 }
                  : letterOut
                    ? { y: '-62%', scale: 1 }
                    : { y: 0, scale: 1 }
              }
              transition={{ duration: 1.1, ease: EASE }}
            >
              <div className="flex h-full flex-col items-center justify-start rounded-sm border border-champagne/60 pt-3">
                <p className="font-display text-[10px] uppercase tracking-[0.3em] text-rose sm:text-xs">
                  Mis XV años
                </p>
                <p className="name-shimmer mt-1 font-script text-4xl leading-tight sm:text-5xl">
                  {quinceanera.name}
                </p>
                <FloralDivider className="!mt-1 !h-5 !w-32" />
                <p className="mt-1 font-serif text-sm italic text-ink sm:text-base">{eventDate}</p>
              </div>
            </motion.div>

            {/* Bolsillo frontal */}
            <div className="envelope-pocket-left absolute inset-0 z-30 rounded-l-md" />
            <div className="envelope-pocket-right absolute inset-0 z-30 rounded-r-md" />
            <div className="envelope-pocket-bottom absolute inset-0 z-30 rounded-b-md" />

            {/* Destinatario */}
            <div className="absolute inset-x-0 bottom-[7%] z-[31] flex flex-col items-center px-6">
              <span className="font-display text-[10px] uppercase tracking-[0.3em] text-rose-deep/80">
                {guest ? 'Invitación especial para' : 'Para'}
              </span>
              <span className="guest-name mt-0.5 line-clamp-2 font-script text-2xl leading-tight text-ink sm:text-3xl">
                {guest ? guest.name : 'Nuestros queridos invitados'}
              </span>
              {guest && (
                <span className="mt-1 rounded-full border border-rose-soft bg-petal/80 px-3 py-0.5 text-[11px] font-medium text-ink">
                  {guest.companionLimit === null
                    ? 'Cantidad de asistentes por confirmar'
                    : guest.quantity === 'personal'
                      ? 'Pase personal'
                      : `Pase para ${guest.quantity}`}
                </span>
              )}
            </div>

            {/* Solapa superior con dos caras */}
            <motion.div
              className="absolute inset-x-0 top-0 h-[58%]"
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: letterOut ? 10 : 40,
              }}
              initial={false}
              animate={{ rotateX: flapOpen ? 180 : 0 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            >
              <div
                className="envelope-flap absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0 3px 4px color-mix(in oklab, var(--rose-deep) 25%, transparent))',
                }}
              />
              <div
                className="envelope-inner absolute inset-0"
                style={{
                  clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>

            {/* Sello de cera (botón) */}
            <button
              type="button"
              onClick={handleOpen}
              disabled={opened}
              aria-label="Abrir el sobre de la invitación"
              className="absolute left-1/2 top-[58%] z-50 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-20 sm:w-20"
            >
              <span className={`absolute inset-0 rounded-full ${opened ? '' : 'seal-pulse'}`} />
              <motion.span
                className="absolute inset-0"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
                animate={opened ? { x: -40, y: 60, rotate: -35, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeIn' }}
              >
                <SealFace monogram={monogram} />
              </motion.span>
              <motion.span
                className="absolute inset-0"
                style={{ clipPath: 'inset(0 0 0 50%)' }}
                animate={opened ? { x: 40, y: 60, rotate: 35, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeIn' }}
              >
                <SealFace monogram={monogram} />
              </motion.span>
            </button>

            {/* Destellos al abrir */}
            <AnimatePresence>
              {phase === 'breaking' &&
                Array.from({ length: 10 }).map((_, i) => {
                  const angle = (i / 10) * Math.PI * 2
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-[58%] z-50 text-champagne"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                      animate={{ x: Math.cos(angle) * 90, y: Math.sin(angle) * 70, opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    >
                      <Sparkle size={14} />
                    </motion.span>
                  )
                })}
            </AnimatePresence>
          </motion.div>

          {/* Botón */}
          <motion.div
            className="relative z-10 mt-[min(2.5rem,5svh)] flex flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={opened ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: opened ? 0 : 0.5 }}
          >
            <motion.button
              type="button"
              onClick={handleOpen}
              disabled={opened}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="btn-rose relative overflow-hidden rounded-full px-9 py-4 font-display text-sm uppercase tracking-[0.2em]"
            >
              Entrar a la invitación
            </motion.button>
            <p className="mt-3 text-xs text-rose-deep/80">Toca el sello o el botón · se activará la música</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

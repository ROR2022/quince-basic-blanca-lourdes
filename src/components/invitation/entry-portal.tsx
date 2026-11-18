
/**
 * EntryPortal
 * Pantalla introductoria en tonos pastel. Al pulsar el botón se abre un portal de ramas,
 * hojas y partículas, y se revela la invitación. También activa la música.
 */
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { invitationConfig } from '@/lib/config'
import { FloatingFireflies } from './floating-fireflies'

interface EntryPortalProps {
  visible: boolean
  onEnter: () => void
  guest: {
    name: string
    quantity: string
    companionLimit: number | null
  } | null
}

export function EntryPortal({ visible, onEnter, guest }: EntryPortalProps) {
  const { quinceanera } = invitationConfig

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-6 text-center"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--ivory) 0%, var(--sky) 60%, var(--sage) 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15 }}
          transition={{ duration: 1 }}
        >
          <FloatingFireflies count={22} />

          {/* Arco de ramas decorativo */}
          <svg
            viewBox="0 0 400 200"
            className="pointer-events-none absolute top-0 h-48 w-full max-w-2xl text-champagne/70"
            aria-hidden="true"
          >
            <path
              d="M0,10 Q120,90 200,60 Q280,90 400,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M60,45 q-10,-18 -26,-22 M120,58 q-8,-20 -24,-26 M200,60 q0,-22 -2,-40 M280,58 q8,-20 24,-26 M340,45 q10,-18 26,-22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.7"
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative z-10 my-auto flex flex-col items-center gap-4 py-8 sm:gap-6"
          >
            <Sparkles className="h-8 w-8 text-champagne" />
            <p className="max-w-md font-serif text-2xl leading-relaxed text-ink sm:text-3xl">
              Una noche mágica está por comenzar
            </p>

            <motion.button
              type="button"
              onClick={onEnter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="group relative mt-2 overflow-hidden rounded-full border border-slate bg-slate px-8 py-4 font-display text-sm uppercase tracking-[0.2em] text-ivory shadow-lg transition-colors hover:bg-slate-hover"
              style={{ boxShadow: '0 0 30px 6px rgba(67,94,120,0.24)' }}
            >
              Entrar a la invitación
            </motion.button>

            <div className="mt-1 w-full max-w-sm rounded-2xl border border-champagne/70 bg-ivory/85 px-6 py-5 shadow-[0_12px_35px_rgba(52,67,84,0.14)] backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink">
                {guest
                  ? 'Tienes una invitación especial de'
                  : 'Le invitamos a celebrar los XV años de'}
              </p>
              <p className="name-shimmer mt-1 font-script text-5xl leading-tight">
                {quinceanera.name}
              </p>

              {guest && (
                <>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate">
                    Invitado/a
                  </p>
                  <p className="guest-name mt-1 text-balance font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                    {guest.name}
                  </p>
                  <span className="mt-3 inline-flex rounded-full border border-sage bg-lavender/60 px-4 py-1 text-sm font-medium text-ink">
                    {guest.companionLimit === null
                      ? 'Cantidad de asistentes por confirmar'
                      : guest.quantity === 'personal'
                        ? 'Pase personal'
                        : `Pase para ${guest.quantity}`}
                  </span>
                </>
              )}
            </div>

            <p className="mt-2 text-xs text-slate">
              Al entrar se activará la música de fondo
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

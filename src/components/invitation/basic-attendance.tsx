
/**
 * Formulario RSVP que abre WhatsApp con el mensaje preparado.
 * La invitación no registra respuestas en el sitio.
 */
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { invitationConfig } from '@/lib/config'
import { MagicalButterflies } from './magical-butterflies'
import { SectionReveal } from './section-reveal'

interface RSVPData {
  name: string
  attending: 'yes' | 'no' | ''
  guests: number
  totalAttendees: number
  message: string
}

interface BasicAttendanceProps {
  companionLimit: number | null
  invitationLabel?: string | undefined
}

function buildRSVPMessage(
  data: RSVPData,
  invitationLabel: string | undefined,
  isUnlimited: boolean,
): string {
  const lines = [
    `Confirmación de asistencia - ${invitationConfig.quinceanera.name}`,
    ...(invitationLabel ? [`Invitación: ${invitationLabel}`] : []),
    `Nombre: ${data.name}`,
    `Asistencia: ${data.attending === 'yes' ? 'Sí, asistiré' : 'No podré asistir'}`,
  ]
  if (data.attending === 'yes') {
    lines.push(
      isUnlimited
        ? `Total de asistentes (incluida la persona que confirma): ${data.totalAttendees}`
        : `Acompañantes: ${data.guests}`,
    )
  }
  if (data.message) lines.push(`Mensaje: ${data.message}`)
  return lines.join('\n')
}

// Abre WhatsApp con el RSVP prellenado. El invitado debe presionar "Enviar" en la app.
function sendRSVPByWhatsApp(
  data: RSVPData,
  invitationLabel: string | undefined,
  isUnlimited: boolean,
): Window | null {
  const number = invitationConfig.confirmationWhatsappNumber
  if (!number) return null

  const text = encodeURIComponent(
    buildRSVPMessage(data, invitationLabel, isUnlimited),
  )
  return window.open(`https://wa.me/${number}?text=${text}`, '_blank')
}

// Confeti multicolor con los tonos de la paleta de la invitación.
function launchConfetti() {
  const styles = getComputedStyle(document.documentElement)
  const colors = ['--slate', '--sky', '--sage', '--lavender', '--peach', '--champagne'].map(
    (token) => styles.getPropertyValue(token).trim(),
  )
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors })
  setTimeout(
    () => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }),
    200,
  )
  setTimeout(
    () => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }),
    400,
  )
}

const inputClass =
  'w-full rounded-xl border border-input bg-ivory/90 px-4 py-3 text-ink placeholder:text-slate backdrop-blur-sm transition-colors focus:border-slate focus:ring-2 focus:ring-slate/20 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-slate focus-visible:outline-offset-2'

export function BasicAttendance({
  companionLimit,
  invitationLabel,
}: BasicAttendanceProps) {
  const { event, quinceanera } = invitationConfig
  const hasConfirmationContact = Boolean(
    invitationConfig.confirmationWhatsappNumber,
  )
  const deadline = new Date(event.rsvpDeadline).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const [form, setForm] = useState<RSVPData>({
    name: '',
    attending: '',
    guests: 0,
    totalAttendees: 1,
    message: '',
  })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!hasConfirmationContact) {
      setError('La confirmación por WhatsApp estará disponible próximamente.')
      return
    }
    // Validación básica
    if (!form.name.trim()) {
      setError('Por favor escriba su nombre completo.')
      return
    }
    if (!form.attending) {
      setError('Indique si podrá asistir.')
      return
    }
    if (
      form.attending === 'yes' &&
      companionLimit === null &&
      (!Number.isSafeInteger(form.totalAttendees) || form.totalAttendees < 1)
    ) {
      setError('Indique un total válido de asistentes (número entero, mínimo 1).')
      return
    }
    if (
      form.attending === 'yes' &&
      companionLimit !== null &&
      form.guests > companionLimit
    ) {
      setError(`Esta invitación permite hasta ${companionLimit} acompañantes.`)
      return
    }

    const popup = sendRSVPByWhatsApp(
      form,
      invitationLabel,
      companionLimit === null,
    )
    if (!popup) {
      setError(
        'No se pudo abrir WhatsApp. Permita las ventanas emergentes e inténtelo de nuevo.',
      )
      return
    }

    setDone(true)
    if (form.attending === 'yes') launchConfetti()
  }

  return (
    <SectionReveal className="relative px-6 py-20">
      <MagicalButterflies count={3} />
      <div className="mx-auto max-w-lg">
        <h2 className="text-center font-display text-2xl uppercase tracking-[0.2em] text-ink sm:text-3xl">
          Confirme su asistencia
        </h2>
        <p className="mt-3 text-center font-serif text-lg text-slate">
          Fecha límite para confirmar: {deadline}
        </p>
        {!hasConfirmationContact && (
          <p
            className="mt-2 text-center text-sm text-slate"
            role="status"
          >
            El número de WhatsApp para confirmar se agregará próximamente.
          </p>
        )}

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-sky bg-sky/55 p-6 shadow-md backdrop-blur-md sm:p-8">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center py-8 text-center"
              >
                <MagicalButterflies count={4} />
                <CheckCircle2 className="h-14 w-14 text-slate" aria-hidden="true" />
                <p className="mt-4 font-script text-4xl text-slate">
                  ¡Gracias!
                </p>
                <p className="mt-2 font-serif text-lg text-ink">
                  {form.attending === 'yes'
                    ? `Nos encantará celebrar con usted, ${form.name.split(' ')[0]}.`
                    : 'Gracias por avisarnos. Le extrañaremos.'}
                </p>
                <p className="mt-2 text-sm text-slate">
                  Se abrió WhatsApp con tu confirmación: solo falta que la envíes.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
                noValidate
              >
                <div>
                  <label htmlFor="rsvp-name" className="mb-1 block text-sm text-ink">
                    Nombre completo
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Su nombre"
                  />
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm text-ink">¿Podrá asistir?</legend>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="¿Podrá asistir?">
                    {[
                      { value: 'yes', label: 'Sí, asistiré' },
                      { value: 'no', label: 'No podré asistir' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={form.attending === opt.value}
                        onClick={() =>
                          setForm({
                            ...form,
                            attending: opt.value as 'yes' | 'no',
                            guests: opt.value === 'yes' ? form.guests : 0,
                          })
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                          form.attending === opt.value
                            ? 'border-slate bg-lavender/70 text-ink'
                            : 'border-input bg-ivory/90 text-slate hover:border-slate/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {form.attending === 'yes' &&
                  (companionLimit === null ? (
                    <div>
                      <label htmlFor="rsvp-total-attendees" className="mb-1 block text-sm text-ink">
                        Número total de asistentes (incluyendo a quien confirma, sin límite asignado)
                      </label>
                      <input
                        id="rsvp-total-attendees"
                        type="number"
                        min={1}
                        step={1}
                        className={inputClass}
                        value={form.totalAttendees}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            totalAttendees:
                              e.currentTarget.value === ''
                                ? 0
                                : Number(e.currentTarget.value),
                          })
                        }
                      />
                    </div>
                  ) : companionLimit > 0 ? (
                    <div>
                      <label htmlFor="rsvp-guests" className="mb-1 block text-sm text-ink">
                        Número de acompañantes (máximo {companionLimit})
                      </label>
                      <input
                        id="rsvp-guests"
                        type="number"
                        min={0}
                        max={companionLimit}
                        step={1}
                        className={inputClass}
                        value={form.guests}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            guests: Math.min(
                              companionLimit,
                              Math.max(
                                0,
                                Math.trunc(Number(e.target.value) || 0),
                              ),
                            ),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-slate">
                      Esta invitación no incluye pases adicionales.
                    </p>
                  ))}

                <div>
                  <label htmlFor="rsvp-message" className="mb-1 block text-sm text-ink">
                    Mensaje para {quinceanera.shortName} (opcional)
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Escriba sus buenos deseos"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!hasConfirmationContact}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate px-6 py-3 font-display text-sm uppercase tracking-[0.15em] text-ivory transition-transform hover:scale-[1.02] hover:bg-slate-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Confirmar asistencia
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionReveal>
  )
}

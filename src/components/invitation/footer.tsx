
/**
 * Footer
 * Mensaje de agradecimiento, firma, fecha del evento y crédito discreto.
 */
import { Moon } from 'lucide-react'
import { invitationConfig } from '@/lib/config'
import { FloatingBlossoms } from './floating-blossoms'
import { SectionReveal } from './section-reveal'

export function Footer() {
  const { quinceanera, event, familyMessage } = invitationConfig
  const dateLabel = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: event.timeZone,
  }).format(new Date(event.date))

  return (
    <SectionReveal as="div" className="relative px-6 pb-16 pt-10 text-center">
      <FloatingBlossoms count={5} />
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
        {/* Corona / luna decorativa */}
        <div className="flex items-center gap-2 text-rose">
          <span className="h-px w-10 bg-champagne/70" />
          <Moon className="h-5 w-5" aria-hidden="true" />
          <span className="h-px w-10 bg-champagne/70" />
        </div>

        <p className="font-script text-4xl text-rose">
          {quinceanera.name} y familia
        </p>

        <p className="text-sm text-ink">{familyMessage}</p>

        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-rose">
          {dateLabel}
        </p>

        <p className="mt-6 text-[11px] text-rose">
          Invitación digital creada con cariño 💝
        </p>
      </div>
    </SectionReveal>
  )
}

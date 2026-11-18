
import { Clock, MapPin, PartyPopper } from 'lucide-react'
import { invitationConfig } from '@/lib/config'
import { FloatingBlossoms } from './floating-blossoms'
import { SectionReveal } from './section-reveal'
import { FloralDivider } from './ornaments'

export function BasicEventDetails() {
  const { event, reception } = invitationConfig

  return (
    <SectionReveal className="relative px-6 py-20">
      <FloatingBlossoms count={5} />
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-2xl uppercase tracking-[0.2em] text-ink sm:text-3xl">
          Recepción
        </h2>
        <FloralDivider />

        <div className="mt-10 rounded-2xl border border-blush bg-blush/55 p-6 shadow-md backdrop-blur-md sm:p-8">
          <div className="flex items-center gap-3 text-ink">
            <PartyPopper className="h-6 w-6" aria-hidden="true" />
            <h3 className="font-display text-xl uppercase tracking-[0.15em]">
              {reception.name}
            </h3>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-ink">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>
              Llegada a partir de las {event.arrivalTime} h · Inicio a las{' '}
              {event.startTime} h
            </span>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-rose">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{reception.address}</span>
          </div>

          {reception.mapsUrl && (
            <a
              href={reception.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose px-4 py-2 text-sm font-medium text-ivory transition-transform hover:scale-105 hover:bg-rose-deep"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Ver ubicación
            </a>
          )}
        </div>
      </div>
    </SectionReveal>
  )
}

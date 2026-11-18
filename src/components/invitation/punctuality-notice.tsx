
import { Clock3 } from 'lucide-react'
import { SectionReveal } from './section-reveal'

export function PunctualityNotice() {
  return (
    <SectionReveal className="relative px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-sage bg-sage/75 px-6 py-8 text-center shadow-md backdrop-blur-md sm:px-10">
        <div className="flex items-center justify-center gap-2 text-ink">
          <Clock3 className="h-5 w-5" aria-hidden="true" />
          <h2 className="font-display text-xl uppercase tracking-[0.15em] sm:text-2xl">
            Su puntualidad es importante
          </h2>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-pretty font-serif text-lg leading-relaxed text-ink">
          Le esperamos a partir de las 7:00 p. m. El evento dará inicio a las
          8:00 p. m. Agradecemos su puntualidad para compartir cada momento de
          esta celebración.
        </p>
      </div>
    </SectionReveal>
  )
}


/**
 * PremiumInvitation
 * Invitación formal tipo carta / pergamino mágico con corona SVG original,
 * bordes florales en champagne, textura marfil-lavanda y brillos en las esquinas.
 */
import { motion } from 'framer-motion'
import { invitationConfig } from '@/lib/config'
import { MagicalButterflies } from './magical-butterflies'
import { SectionReveal } from './section-reveal'

/** Corona / tiara original en SVG. */
function Tiara() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden="true">
      <path
        d="M6 46 L14 18 L28 34 L44 10 L60 34 L74 18 L82 46 Z"
        fill="var(--champagne)"
        stroke="var(--slate)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 46 H82" stroke="var(--slate)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="16" r="3.5" fill="var(--sky)" stroke="var(--slate)" strokeWidth="1" />
      <circle cx="44" cy="8" r="4" fill="var(--lavender)" stroke="var(--slate)" strokeWidth="1" />
      <circle cx="74" cy="16" r="3.5" fill="var(--sage)" stroke="var(--slate)" strokeWidth="1" />
      <circle cx="28" cy="36" r="2.5" fill="var(--ivory)" />
      <circle cx="60" cy="36" r="2.5" fill="var(--ivory)" />
    </svg>
  )
}

function CornerFlourish({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={`absolute h-14 w-14 text-champagne ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2,2 Q30,6 30,30 Q6,30 2,2 Z M2,2 q20,-1 34,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

export function PremiumInvitation() {
  const { parents, quinceanera, godparents } = invitationConfig

  return (
    <SectionReveal className="relative px-6 py-20">
      <MagicalButterflies count={3} />
      <motion.article
        initial={{ opacity: 0, rotateX: -12, y: 40 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border-2 border-champagne/70 px-8 py-12 text-center shadow-xl sm:px-14"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, var(--ivory) 0%, var(--lavender) 55%, var(--sky) 100%)',
          boxShadow: '0 20px 60px -20px rgba(52,67,84,0.2)',
        }}
      >
        {/* Brillos dorados en las esquinas */}
        <CornerFlourish className="left-3 top-3" />
        <CornerFlourish className="right-3 top-3 rotate-90" />
        <CornerFlourish className="bottom-3 left-3 -rotate-90" />
        <CornerFlourish className="bottom-3 right-3 rotate-180" />

        <div className="flex justify-center">
          <Tiara />
        </div>

        {/* Iniciales decorativas */}
        <div className="mt-4 font-script text-5xl text-slate">
          {quinceanera.shortName.charAt(0)}
        </div>

        <p className="mt-6 font-serif text-lg leading-relaxed text-ink">
          Con la bendición de Dios y el amor de mis padres:
        </p>
        <h4 className="mt-4 font-script text-3xl text-slate">
          Mis Padres
        </h4>
        <div className="my-5 space-y-1 font-display text-lg uppercase tracking-wider text-ink">
          <p>{parents.first}</p>
          <p className="text-sm text-slate">y</p>
          <p>{parents.second}</p>
        </div>

        <h4 className="mt-4 font-script text-3xl text-slate">
          Y de mis padrinos:
        </h4>
        <div className="my-5 space-y-1 font-display text-lg uppercase tracking-wider text-ink">
          <p>{godparents.godmother}</p>
          <p className="text-sm text-slate">y</p>
          <p>{godparents.godfather}</p>
        </div>

        <p className="mx-auto max-w-md text-pretty font-serif text-lg leading-relaxed text-ink">
          Tenemos el honor de invitarle a celebrar mis quince años.
        </p>

        <div className="mx-auto mt-8 h-px w-32 bg-champagne/70" />
        <p className="mt-4 font-script text-4xl text-slate">
          {quinceanera.name}
        </p>
      </motion.article>
    </SectionReveal>
  )
}

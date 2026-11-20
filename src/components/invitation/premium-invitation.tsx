
/**
 * PremiumInvitation
 * Invitación formal tipo carta / pergamino mágico con corona SVG original,
 * bordes florales en champagne, textura marfil-lavanda y brillos en las esquinas.
 */
import { motion } from 'framer-motion'
import { invitationConfig } from '@/lib/config'
import { MagicalButterflies } from './magical-butterflies'
import { SectionReveal } from './section-reveal'
import { SvgLeaf, SvgRose } from './ornaments'

/** Corona / tiara original en SVG. */
function Tiara() {
  return (
    <svg width="88" height="56" viewBox="0 0 88 56" fill="none" aria-hidden="true">
      <path
        d="M6 46 L14 18 L28 34 L44 10 L60 34 L74 18 L82 46 Z"
        fill="var(--champagne)"
        stroke="var(--rose)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 46 H82" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="16" r="3.5" fill="var(--blush)" stroke="var(--rose)" strokeWidth="1" />
      <circle cx="44" cy="8" r="4" fill="var(--lavender)" stroke="var(--rose)" strokeWidth="1" />
      <circle cx="74" cy="16" r="3.5" fill="var(--sage)" stroke="var(--rose)" strokeWidth="1" />
      <circle cx="28" cy="36" r="2.5" fill="var(--ivory)" />
      <circle cx="60" cy="36" r="2.5" fill="var(--ivory)" />
    </svg>
  )
}

function CornerFlourish({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute h-16 w-16 ${className}`} aria-hidden="true">
      <path d="M4,4 Q30,6 34,30 M4,4 Q6,30 30,34" fill="none" stroke="var(--champagne)" strokeWidth="1.2" />
      <SvgLeaf x={26} y={10} size={7} rotate={20} />
      <SvgLeaf x={10} y={26} size={7} rotate={70} />
      <SvgRose x={14} y={14} r={8} color="var(--rose-soft)" />
      <SvgRose x={28} y={24} r={5} color="var(--blush)" />
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
            'radial-gradient(circle at 50% 0%, var(--ivory) 0%, var(--petal) 55%, var(--blush) 100%)',
          boxShadow: '0 20px 60px -20px color-mix(in oklab, var(--ink) 20%, transparent)',
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
        <div className="mt-4 font-script text-5xl text-rose">
          {quinceanera.shortName.charAt(0)}
        </div>

        <p className="mt-6 font-serif text-lg leading-relaxed text-ink">
          Con la bendición y el amor de Dios:
        </p>
        <h4 className="mt-4 font-script text-3xl text-rose">
          Mis Padres
        </h4>
        <div className="my-5 space-y-1 font-display text-lg uppercase tracking-wider text-ink">
          <p>{parents.first}</p>
          <p className="text-sm text-rose">y</p>
          <p>{parents.second}</p>
        </div>

        <h4 className="mt-4 font-script text-3xl text-rose">
          Y de mis padrinos:
        </h4>
        <div className="my-5 space-y-1 font-display text-lg uppercase tracking-wider text-ink">
          <p>{godparents.godmother}</p>
          <p className="text-sm text-rose">y</p>
          <p>{godparents.godfather}</p>
        </div>

        <p className="mx-auto max-w-md text-pretty font-serif text-lg leading-relaxed text-ink">
          Tenemos el honor de invitarle a celebrar mis quince años.
        </p>

        <div className="mx-auto mt-8 h-px w-32 bg-champagne/70" />
        <p className="mt-4 font-script text-4xl text-rose">
          {quinceanera.name}
        </p>
      </motion.article>
    </SectionReveal>
  )
}

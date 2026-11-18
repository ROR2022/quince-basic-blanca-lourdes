/**
 * Ornamentos compartidos: rosas en SVG, destellos y divisor floral.
 */
import { motion } from 'framer-motion'

/** Rosa dibujada dentro de un <svg> padre. */
export function SvgRose({
  x,
  y,
  r,
  color = 'var(--rose-soft)',
}: {
  x: number
  y: number
  r: number
  color?: string
}) {
  const stroke = 'color-mix(in oklab, var(--rose-deep) 55%, transparent)'
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={color} />
      <circle r={r * 0.78} fill="none" stroke={stroke} strokeWidth={r * 0.06} opacity={0.5} />
      <path
        d={`M ${-r * 0.62} ${r * 0.1} A ${r * 0.62} ${r * 0.62} 0 0 1 ${r * 0.55} ${-r * 0.25}`}
        fill="none"
        stroke={stroke}
        strokeWidth={r * 0.08}
        strokeLinecap="round"
      />
      <path
        d={`M ${r * 0.45} ${r * 0.05} A ${r * 0.42} ${r * 0.42} 0 0 1 ${-r * 0.3} ${r * 0.38}`}
        fill="none"
        stroke={stroke}
        strokeWidth={r * 0.08}
        strokeLinecap="round"
      />
      <path
        d={`M ${-r * 0.22} ${-r * 0.05} A ${r * 0.22} ${r * 0.22} 0 1 1 ${r * 0.12} ${r * 0.15}`}
        fill="none"
        stroke={stroke}
        strokeWidth={r * 0.08}
        strokeLinecap="round"
      />
      <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.28} fill="var(--ivory)" opacity={0.3} />
    </g>
  )
}

/** Hoja simple para acompañar las rosas. */
export function SvgLeaf({ x, y, size, rotate }: { x: number; y: number; size: number; rotate: number }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={size}
      ry={size * 0.38}
      fill="var(--sage)"
      stroke="color-mix(in oklab, var(--ink) 25%, transparent)"
      strokeWidth={0.6}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  )
}

/** Destello de cuatro puntas. */
export function Sparkle({ size = 12, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
    </svg>
  )
}

/** Divisor floral animado para debajo de los títulos. */
export function FloralDivider({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 28"
      className={`mx-auto mt-3 h-7 w-48 ${className}`}
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.path
        d="M8 14 H76 M124 14 H192"
        stroke="var(--champagne)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <motion.g
        variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
        style={{ transformOrigin: '100px 14px' }}
      >
        <SvgLeaf x={84} y={14} size={8} rotate={-15} />
        <SvgLeaf x={116} y={14} size={8} rotate={15} />
        <SvgRose x={100} y={14} r={9} color="var(--rose-soft)" />
      </motion.g>
      <circle cx="4" cy="14" r="2" fill="var(--rose-soft)" />
      <circle cx="196" cy="14" r="2" fill="var(--rose-soft)" />
    </motion.svg>
  )
}

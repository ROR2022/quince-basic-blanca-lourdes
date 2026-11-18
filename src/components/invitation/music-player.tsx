
/**
 * MusicPlayer
 * Botón flotante circular (esquina inferior derecha) para reproducir/pausar
 * la música de fondo. Gira mientras suena y tiene brillo azul cielo.
 * El estado de reproducción se controla desde la página (audio compartido).
 */
import { motion } from 'framer-motion'
import { Music, Pause } from 'lucide-react'

interface MusicPlayerProps {
  isPlaying: boolean
  onToggle: () => void
}

export function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        aria-pressed={isPlaying}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.06 }}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-slate/50 bg-sky/95 text-slate shadow-lg backdrop-blur-md"
        style={{ boxShadow: '0 0 20px 4px rgba(67,94,120,0.2)' }}
      >
        <motion.span
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }
              : { duration: 0.3 }
          }
          className="flex items-center justify-center"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Music className="h-6 w-6" />}
        </motion.span>
      </motion.button>
      <span className="rounded-full bg-sky/95 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink shadow backdrop-blur">
        Música
      </span>
    </div>
  )
}

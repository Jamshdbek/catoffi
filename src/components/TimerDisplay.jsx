import { motion, AnimatePresence } from 'framer-motion'
import CircularTimer from './CircularTimer'
import { fmt } from '../utils/time'
import { useTheme } from '../contexts/ThemeContext'

export default function TimerDisplay({
  title,
  remaining,
  total,
  running,
  onToggle,
  onReset,
  onSkip,
  onAdjust,
}) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 100
  const status = running ? 'Running' : remaining === total ? 'Ready' : (remaining === 0 ? 'Done' : 'Paused')
  const { bgImage } = useTheme()

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        position: 'relative',
      }}
    >
      {/* Title section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: 'center'}}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={title}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: 12,
              color: 'var(--text-sub)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {title}
          </motion.p>
        </AnimatePresence>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {pct}% remaining
        </p>
      </motion.div>

      {/* Circular timer with center text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularTimer
          remaining={remaining}
          duration={total}
          running={running}
          onAdjust={onAdjust}
          size={360}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: remaining >= 3600 ? 46 : 56,
              fontWeight: 500,
              letterSpacing: '-2px',
              color: bgImage ? "#ffff" : 'var(--text)',
              textShadow: bgImage ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
              // color: 'var(--panel-bg)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {fmt(remaining)}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 8,
                letterSpacing: '0.06em',
              }}
            >
              {status}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'center', gap: 16 }}
      >
        {/* Reset button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92, rotate: -180 }}
          onClick={onReset}
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'var(--btn-bg)',
            border: '1px solid var(--btn-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--btn-color)',
          }}
          aria-label="Reset timer"
        >
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 3L15.6 3C15.2686 3 15 3.26863 15 3.6V3.6L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.5 3.5C18.7983 4.80851 21 8.29825 21 12C21 16.8715 16.9706 21 12 21C7.02944 21 3 16.8715 3 12C3 8.73514 4.80989 5.52512 7.5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={onToggle}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--play-bg)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--play-color)',
            boxShadow: running
              ? '0 6px 24px rgba(0,0,0,0.18), 0 0 0 0 var(--play-bg)'
              : '0 4px 14px rgba(0,0,0,0.12)',
          }}
          aria-label={running ? 'Pause' : 'Start'}
        >
          <AnimatePresence mode="wait">
            {running ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="4" width="4.5" height="16" rx="2.2" />
                  <rect x="14.5" y="4" width="4.5" height="16" rx="2.2" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.5, opacity: 0, x: -4 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.5, opacity: 0, x: 4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
                  <path d="M7 4.5C7 3.67 7.92 3.2 8.6 3.68l11.2 7.5a1 1 0 0 1 0 1.64L8.6 20.32C7.92 20.8 7 20.33 7 19.5V4.5z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Skip button */}
        <motion.button
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.92 }}
          onClick={onSkip}
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'var(--btn-bg)',
            border: '1px solid var(--btn-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--btn-color)',
          }}
          aria-label="Skip"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}

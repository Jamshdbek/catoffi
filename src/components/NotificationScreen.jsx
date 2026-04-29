import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fmtShort } from '../utils/time'

/**
 * Fullscreen notification window shown when a timer ends.
 * Loaded as a separate Electron window via main.cjs.
 */
export default function NotificationScreen({ name, duration }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    // Play system beep via Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const playTone = (freq, time, dur) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0, ctx.currentTime + time)
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + time + 0.02)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + time + dur)
        osc.start(ctx.currentTime + time)
        osc.stop(ctx.currentTime + time + dur)
      }
      playTone(880, 0, 0.3)
      playTone(1100, 0.35, 0.3)
      playTone(880, 0.7, 0.3)
      playTone(1320, 1.05, 0.6)
    } catch {}

    // Auto-close after 30 seconds
    const t = setTimeout(() => handleClose(), 30000)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      if (window.electronAPI) {
        window.electronAPI.closeNotification()
      }
    }, 300)
  }

  const handleFocusApp = () => {
    if (window.electronAPI) {
      window.electronAPI.focusMainWindow()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Animated background rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{
            duration: 3,
            delay: i * 0.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.4)',
          }}
        />
      ))}

      {/* Subtle grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: visible ? 1 : 0.8, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.15 }}
        style={{
          textAlign: 'center',
          zIndex: 10,
          padding: 40,
        }}
      >
        {/* Pulsing icon */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 36px auto',
            boxShadow: '0 0 80px rgba(255,255,255,0.4)',
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="9" />
            <polyline points="12 8 12 13 16 15" />
            <path d="M5 3 L2 6" />
            <path d="M22 6 L19 3" />
          </svg>
        </motion.div>

        {/* "Time's up" text */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Time's Up
        </motion.p>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            fontSize: 19,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 56,
            fontWeight: 400,
          }}
        >
          {duration > 0 ? `${fmtShort(duration)} session complete` : 'Session complete'}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleFocusApp}
            style={{
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: 14,
              padding: '15px 32px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 160,
            }}
          >
            Open App
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClose}
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.85)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 14,
              padding: '15px 32px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 160,
            }}
          >
            Dismiss
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 0.4 : 0 }}
          transition={{ delay: 1.2 }}
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 40,
            letterSpacing: '0.05em',
          }}
        >
          This window closes automatically in 30 seconds
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

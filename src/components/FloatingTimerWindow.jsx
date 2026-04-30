import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fmt } from '../utils/time'

export default function FloatingTimerWindow() {
  const [state, setState] = useState({ remaining: 0, running: false, title: 'Timer' })

  useEffect(() => {
    // Apply saved theme so CSS variables work correctly
    try {
      const theme = localStorage.getItem('focus-timer-theme') || 'dark'
      document.documentElement.setAttribute('data-theme', theme)
    } catch {}

    // Make body/root transparent so only the widget is visible
    document.body.style.background = 'transparent'
    document.documentElement.style.background = 'transparent'
    const root = document.getElementById('root')
    if (root) root.style.background = 'transparent'

    const cleanup = window.electronAPI?.onFloatingTimerState((s) => setState(s))
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, [])

  const { remaining, running, title } = state

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 12px',
        background: 'var(--bg)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid var(--panel-border)',
        borderRadius: 14,
        boxSizing: 'border-box',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Pulse dot */}
      <div style={{ position: 'relative', flexShrink: 0, width: 7, height: 7 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: running ? 'var(--text)' : 'var(--text-muted)',
          transition: 'background 0.2s',
        }} />
      </div>

      {/* Timer text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: '-0.5px',
          color: 'var(--text)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {fmt(remaining)}
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          marginTop: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </div>
      </div>

      {/* Play / Pause */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        style={{
          WebkitAppRegion: 'no-drag',
          width: 26, height: 26,
          borderRadius: '50%',
          background: 'var(--btn-bg)',
          border: '1px solid var(--btn-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--btn-color)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        onClick={() => window.electronAPI?.floatingTimerToggle()}
      >
        {running ? (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="4" width="4.5" height="16" rx="1.5"/>
            <rect x="14.5" y="4" width="4.5" height="16" rx="1.5"/>
          </svg>
        ) : (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
            <path d="M7 4.5C7 3.67 7.92 3.2 8.6 3.68l11.2 7.5a1 1 0 0 1 0 1.64L8.6 20.32C7.92 20.8 7 20.33 7 19.5V4.5z"/>
          </svg>
        )}
      </motion.button>

      {/* Close */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        style={{
          WebkitAppRegion: 'no-drag',
          width: 18, height: 18,
          borderRadius: '50%',
          background: 'none',
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
          flexShrink: 0,
          cursor: 'pointer',
          padding: 0,
        }}
        onClick={() => window.electronAPI?.floatingTimerClose()}
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </motion.button>
    </div>
  )
}

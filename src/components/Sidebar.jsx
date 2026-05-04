import { useState } from 'react'
import { motion } from 'framer-motion'
import { PRESETS } from '../utils/constants'
import { fmtShort } from '../utils/time'
import ThemeToggle from './ThemeToggle'
import SettingsPanel from './SettingsPanel'
import logo from "../../public/logo.png"
export default function Sidebar({
  selectedPresetId,
  activeTimerId,
  onSelectPreset,
  onOpenServices,
}) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--panel-border)',
        borderRadius: 22,
        width: 246,
        minWidth: 246,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px',
        gap: 18,
        overflowY: 'auto',
      }}
    >
      {/* Header: logo + settings + theme toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'var(--play-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={logo} alt="" />
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.92, rotate: 30 }}
            onClick={() => setShowSettings((s) => !s)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: showSettings
                ? 'var(--card-active-bg)'
                : 'var(--btn-bg)',
              border: `1px solid ${showSettings ? 'var(--card-active-border)' : 'var(--btn-border)'
                }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showSettings ? 'var(--text)' : 'var(--btn-color)',
              transition: 'all 0.18s',
            }}
          >
            <motion.svg
              animate={{ rotate: showSettings ? 90 : 0 }}
              transition={{ duration: 0.4 }}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </motion.svg>
          </motion.button>
        </div>
        <ThemeToggle />
      </div>

      <SettingsPanel open={showSettings} />

      <div style={{ height: 1, background: 'var(--divider)' }} />
      {/* Mode selector */}
     {!showSettings && <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Mode
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PRESETS.map((p) => {
            const active = selectedPresetId === p.id && !activeTimerId
            return (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPreset(p)}
                style={{
                  background: active
                    ? 'var(--card-active-bg)'
                    : 'transparent',
                  border: `1px solid ${active ? 'var(--card-active-border)' : 'transparent'
                    }`,
                  borderRadius: 11,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  color: active ? 'var(--text)' : 'var(--text-sub)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.16s',
                  width: '100%',
                }}
              >
                <motion.span
                  animate={{
                    scale: active ? 1 : 0.8,
                    background: active
                      ? 'var(--text)'
                      : 'var(--progress-bg)',
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                {p.label}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 10.5,
                    color: 'var(--text-muted)',
                    fontFamily: 'DM Mono, monospace',
                  }}
                >
                  {fmtShort(p.duration)}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>}
      {/* Services button — pinned to bottom */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ height: 1, background: 'var(--divider)', marginBottom: 12 }} />
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Services
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onOpenServices}
          style={{
            width: '100%',
            background: 'var(--btn-bg)',
            border: '1px solid var(--btn-border)',
            borderRadius: 11,
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            color: 'var(--text-sub)',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
            transition: 'all 0.16s',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Manage Services
        </motion.button>
      </div>
    </motion.div>

  )
}

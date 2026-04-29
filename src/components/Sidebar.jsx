import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRESETS } from '../utils/constants'
import { fmtShort } from '../utils/time'
import ThemeToggle from './ThemeToggle'
import SettingsPanel from './SettingsPanel'
import logo from "../../public/logo.png"
export default function Sidebar({
  selectedPresetId,
  activeTimerId,
  onSelectPreset,
  stats,
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
            {/* <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--play-color)"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg> */}
            {/* <svg   stroke="var(--play-color)"  height="20px" width="20px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512" xml:space="preserve">
              <style type="text/css">
              </style>
              <g>
                <path class="st0" d="M461.814,197.514c-2.999-11.335-14.624-18.093-25.958-15.094c-1.866,0.553-13.477,3.649-26.042,14.341
		c-6.234,5.349-12.633,12.751-17.361,22.454c-4.748,9.69-7.685,21.577-7.657,35.033c0.013,16.345,4.133,34.895,13.442,56.257
		c6.282,14.403,9.144,29.697,9.144,44.846c0.062,25.627-8.438,50.756-21.121,68.283c-6.296,8.777-13.546,15.606-20.816,20.022
		c-2.986,1.81-5.943,3.131-8.888,4.181l0.989-5.854c-0.055-17.03-4.05-34.84-13.021-50.528
		c-28.356-49.643-66.223-134.741-66.223-134.741l-1.527-4.879c29.47-7.796,58.579-23.408,73.148-54.985
		c38.931-84.344-41.08-142.73-41.08-142.73s-25.958-56.222-38.924-54.06c-12.978,2.164-41.094,38.931-41.094,38.931h-23.788h-23.788
		c0,0-28.108-36.767-41.08-38.931c-12.979-2.163-38.924,54.06-38.924,54.06s-80.018,58.386-41.087,142.73
		c13.822,29.953,40.741,45.572,68.634,53.748l-2.951,9.662c0,0-31.908,81.552-60.279,131.195C37.198,441.092,58.478,512,97.477,512
		c29.47,0,79.14,0,101.692,0c7.292,0,11.763,0,11.763,0c22.544,0,72.222,0,101.691,0c12.654,0,23.38-7.547,31.204-19.324
		c15.826-0.013,30.81-4.872,43.707-12.758c19.455-11.915,34.708-30.32,45.434-51.896c10.685-21.618,16.856-46.636,16.878-72.672
		c0-20.484-3.885-41.619-12.682-61.813c-7.561-17.34-9.918-30.216-9.904-39.29c0.028-7.526,1.5-12.544,3.359-16.414
		c1.417-2.889,3.124-5.17,4.983-7.091c2.771-2.868,5.964-4.879,8.349-6.054c1.182-0.595,2.135-0.968,2.674-1.162l0.449-0.152
		l-0.007-0.028C458.179,220.189,464.779,208.724,461.814,197.514z"/>
              </g>
            </svg> */}
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
      <div>
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
      </div>

      <div style={{ height: 1, background: 'var(--divider)' }} />

    </motion.div>
  )
}

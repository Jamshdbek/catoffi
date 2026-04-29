import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { THEMES } from '../utils/constants'

export default function SettingsPanel({ open }) {
  const { theme, setTheme } = useTheme()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: -4 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 14,
              padding: '14px 13px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Theme
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}
            >
              {THEMES.map((t) => {
                const active = theme === t.id
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    title={t.label}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 10,
                      background: t.preview,
                      border: active
                        ? `2px solid var(--text)`
                        : `1px solid var(--card-border)`,
                      padding: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Accent dot in corner */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: t.accent,
                        boxShadow: active
                          ? `0 0 14px ${t.accent}`
                          : 'none',
                      }}
                    />
                  </motion.button>
                )
              })}
            </div>

            <p
              style={{
                fontSize: 10.5,
                color: 'var(--text-sub)',
                lineHeight: 1.5,
              }}
            >
              {THEMES.find((t) => t.id === theme)?.label}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TAGS } from '../utils/constants'
import { useLanguage } from '../contexts/LanguageContext'

export default function AddTimerModal({ open, onAdd, onClose, title, submitLabel }) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [digits, setDigits] = useState([0, 0, 0, 0]) // [m1, m2, s1, s2]
  const [tag, setTag] = useState('Work')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setDigits([0, 0, 0, 0])
      setTag('Work')
      setErr('')
    }
  }, [open])

  const timeSecs = (digits[0] * 10 + digits[1]) * 60 + (digits[2] * 10 + digits[3])
  const timeDisplay = `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`

  function handleTimeKeyDown(e) {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault()
      setDigits(prev => [...prev.slice(1), parseInt(e.key)])
      setErr('')
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      setDigits(prev => [0, ...prev.slice(0, -1)])
      setErr('')
    }
  }

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, name, digits, tag])

  function submit() {
    if (!name.trim()) {
      setErr(t('errNameRequired'))
      return
    }
    if (timeSecs <= 0) {
      setErr(t('errInvalidTime'))
      return
    }
    onAdd({ id: Date.now(), name: name.trim(), duration: timeSecs, tag })
    onClose()
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 10,
    padding: '11px 13px',
    color: 'var(--text)',
    fontSize: 14,
    transition: 'border-color 0.18s, background 0.18s',
  }

  const labelStyle = {
    fontSize: 10.5,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              background: 'var(--bg)',
              backgroundImage: 'var(--bg-gradient)',
              border: '1px solid var(--panel-border)',
              borderRadius: 22,
              padding: '28px 26px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '-0.3px',
                }}
              >
                {title}
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                style={{
                  background: 'var(--btn-bg)',
                  border: '1px solid var(--btn-border)',
                  borderRadius: 8,
                  width: 30,
                  height: 30,
                  color: 'var(--text-sub)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            <div>
              <label style={labelStyle}>{t('nameLbl')}</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErr('')
                }}
                placeholder={t('namePlaceholder')}
                style={inputStyle}
                autoFocus
              />
            </div>

            <div>
              <label style={labelStyle}>{t('durationLbl')}</label>
              <input
                readOnly
                value={timeDisplay}
                onKeyDown={handleTimeKeyDown}
                style={{
                  ...inputStyle,
                  fontFamily: 'DM Mono, monospace',
                  textAlign: 'center',
                  fontSize: 28,
                  letterSpacing: 6,
                  cursor: 'default',
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>{t('tagLbl')}</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  cursor: 'pointer',
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: 36,
                }}
              >
                {TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {t('tag_' + tag)}
                  </option>
                ))}
              </select>
            </div>

            <AnimatePresence>
              {err && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{
                    fontSize: 12,
                    color: '#ef5b5b',
                    marginTop: -10,
                  }}
                >
                  {err}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={submit}
              style={{
                background: 'var(--play-bg)',
                color: 'var(--play-color)',
                border: 'none',
                borderRadius: 12,
                padding: '13px',
                fontSize: 14,
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {submitLabel}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

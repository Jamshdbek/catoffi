import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { THEMES } from '../utils/constants'

const MIN_W = 400
const MIN_H = 300
const MAX_W = 7680
const MAX_H = 4320
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export default function SettingsPanel({ open }) {
  const { theme, setTheme, bgImage, setBgImage } = useTheme()
  const inputRef = useRef(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    setError(null)

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm fayllari qabul qilinadi.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`Fayl hajmi 5 MB dan oshmasligi kerak (hozir: ${(file.size / 1024 / 1024).toFixed(1)} MB).`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      const img = new Image()
      img.onload = () => {
        if (img.width < MIN_W || img.height < MIN_H) {
          setError(`Rasm o'lchami kamida ${MIN_W}×${MIN_H} px bo'lishi kerak (hozir: ${img.width}×${img.height}).`)
          return
        }
        if (img.width > MAX_W || img.height > MAX_H) {
          setError(`Rasm o'lchami ${MAX_W}×${MAX_H} px dan oshmasligi kerak (hozir: ${img.width}×${img.height}).`)
          return
        }
        setBgImage(dataUrl)
      }
      img.onerror = () => setError('Rasm o\'qib bo\'lmadi.')
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

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
              gap: 14,
            }}
          >
            {/* ── Theme selector ── */}
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
                        boxShadow: active ? `0 0 14px ${t.accent}` : 'none',
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

            {/* ── Divider ── */}
            <div style={{ height: 1, background: 'var(--card-border)' }} />

            {/* ── Background image ── */}
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Background Image
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onInputChange}
              onClick={(e) => { e.target.value = '' }}
            />

            {/* Drop zone / preview */}
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                border: dragging
                  ? '1.5px dashed var(--text)'
                  : '1.5px dashed var(--card-border)',
                cursor: 'pointer',
                height: bgImage ? 80 : 64,
                transition: 'border-color 0.2s, height 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: bgImage ? 'none' : 'var(--card-bg)',
                backgroundSize: 'cover'
              }}
            >
              {bgImage ? (
                <>
                  <img
                    src={bgImage}
                    alt="bg preview"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10.5,
                      color: '#fff',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Click to change
                  </div>
                </>
              ) : (
                <p
                  style={{
                    fontSize: 10.5,
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    padding: '0 8px',
                  }}
                >
                  Choose a picture or drop it here
                </p>
              )}
            </motion.div>

            {/* Limits hint */}
            <p style={{ fontSize: 9.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {MIN_W}×{MIN_H} — {MAX_W}×{MAX_H} px &nbsp;·&nbsp; maks 5 MB
              &nbsp;·&nbsp; JPG / PNG / WebP
            </p>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: 10,
                    color: '#f87171',
                    lineHeight: 1.5,
                    marginTop: -6,
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Remove button */}
            {bgImage && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setBgImage(null); setError(null) }}
                style={{
                  marginTop: -4,
                  padding: '6px 0',
                  borderRadius: 8,
                  border: '1px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-muted)',
                  fontSize: 10.5,
                  cursor: 'pointer',
                }}
              >
                Remove image
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UpdateBanner() {
  const [state, setState] = useState(null)
  // state: null | 'available' | 'downloading' | 'ready' | 'error'
  const [progress, setProgress] = useState(0)
  const [version, setVersion] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!window.electronAPI) return

    const cleanups = [
      window.electronAPI.onUpdateAvailable((info) => {
        setVersion(info?.version ?? '')
        setState('available')
        setDismissed(false)
      }),
      window.electronAPI.onUpdateDownloadProgress((p) => {
        setProgress(Math.round(p?.percent ?? 0))
        setState('downloading')
      }),
      window.electronAPI.onUpdateDownloaded((info) => {
        setVersion(info?.version ?? version)
        setState('ready')
      }),
      window.electronAPI.onUpdateError(() => {
        setState('error')
      }),
    ]

    return () => cleanups.forEach((fn) => fn?.())
  }, [])

  const visible = !dismissed && state !== null

  return (
    <AnimatePresence>
      {visible && state !== 'error' && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{
            position: 'fixed',
            top: 44,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: 320,
            maxWidth: 480,
          }}
          className="no-drag"
        >
          <div
            style={{
              background: 'rgba(20,20,28,0.96)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span style={{ fontSize: 20 }}>
              {state === 'ready' ? '✅' : state === 'error' ? '⚠️' : '⬆️'}
            </span>

            <div style={{ flex: 1, minWidth: 0 }}>
              {state === 'available' && (
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>
                  Yangi versiya {version ? `v${version}` : ''} yuklab olinmoqda...
                </p>
              )}
              {state === 'downloading' && (
                <>
                  <p style={{ margin: '0 0 6px', color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>
                    Yangilash yuklanmoqda — {progress}%
                  </p>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </>
              )}
              {state === 'ready' && (
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>
                  v{version} versiyasiga yangilandi, iltimos, yangilashni o'rnatish uchun qayta ishga tushiring
                </p>
              )}
              {/* {state === 'error' && (
                <p style={{ margin: 0, color: '#fca5a5', fontSize: 13, fontWeight: 500 }}>
                  Yangilashda xatolik yuz berdi
                </p>
              )} */}
            </div>

            {state === 'ready' && (
              <button
                onClick={() => window.electronAPI.installUpdate()}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Qayta ishga tushring
              </button>
            )}

            {(state === 'ready' || state === 'error') && (
              <button
                onClick={() => setDismissed(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: 16,
                  lineHeight: 1,
                  padding: '2px 4px',
                }}
                aria-label="Yopish"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

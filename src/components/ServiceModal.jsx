import { motion, AnimatePresence } from 'framer-motion'

function Toggle({ enabled, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: enabled ? 'var(--text)' : 'var(--progress-bg)',
        border: 'none',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <motion.div
        animate={{ x: enabled ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: enabled ? 'var(--bg)' : 'var(--btn-color)',
        }}
      />
    </motion.button>
  )
}

function ServiceRow({ icon, label, desc, enabled, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: enabled ? 'var(--card-active-bg)' : 'var(--card-bg)',
          border: `1px solid ${enabled ? 'var(--card-active-border)' : 'var(--card-border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: enabled ? 'var(--text)' : 'var(--text-muted)',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>{label}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  )
}

export default function ServiceModal({
  open,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
  floatingTimerEnabled,
  onToggleFloatingTimer,
  windowHeaderEnabled,
  onToggleWindowHeader,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            display: "flex",
            zIndex: 100,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
            margin: "auto",
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        >
          <motion.div
            className="no-drag"
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '40%',
              left: '40%',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              zIndex: 101,
              background: 'var(--bg)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid var(--panel-border)',
              borderRadius: 20,
              margin: "auto",
              padding: '20px 20px 16px',
              width: 310,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: 'var(--btn-bg)',
                  border: '1px solid var(--btn-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-sub)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Services</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: 'var(--btn-bg)',
                  border: '1px solid var(--btn-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-sub)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>
            
            <div style={{ height: 1, background: 'var(--divider)', marginBottom: 4 }} />

            <ServiceRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
              label="Notifications"
              desc="Timer completion alerts"
              enabled={notificationsEnabled}
              onToggle={onToggleNotifications}
            />

            <div style={{ height: 1, background: 'var(--divider)' }} />

            <ServiceRow
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="3" />
                  <path d="M12 8v4l2.5 2.5" />
                </svg>
              }
              label="Floating Timer"
              desc="Draggable mini timer overlay"
              enabled={floatingTimerEnabled}
              onToggle={onToggleFloatingTimer}
            />

            {onToggleWindowHeader && (
              <>
                <div style={{ height: 1, background: 'var(--divider)' }} />
                <ServiceRow
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <line x1="2" y1="9" x2="22" y2="9" />
                      <circle cx="6" cy="6.5" r="0.8" fill="currentColor" />
                      <circle cx="9.5" cy="6.5" r="0.8" fill="currentColor" />
                      <circle cx="13" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                  }
                  label="Window Header"
                  desc="Title bar with window controls"
                  enabled={windowHeaderEnabled}
                  onToggle={onToggleWindowHeader}
                />
              </>
            )}

            <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            v1.0.7
          </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

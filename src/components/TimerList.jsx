import { motion, AnimatePresence } from 'framer-motion'
import { fmt, fmtShort } from '../utils/time'

export default function TimerList({
  timers,
  activeTimerId,
  remaining,
  total,
  running,
  onSelect,
  onDelete,
  onAdd,
}) {
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--panel-border)',
        borderRadius: 22,
        width: 268,
        minWidth: 268,
        maxHeight: 'calc(100vh - 40px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '22px 16px',
        gap: 14,
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
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.2px',
          }}
        >
          Timers
        </p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onAdd}
          style={{
            background: 'var(--play-bg)',
            border: 'none',
            borderRadius: 9,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--play-color)',
          }}
          aria-label="Add new timer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </div>

      <div style={{ height: 1, background: 'var(--divider)' }} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingRight: 2,
        }}
      >
        {timers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: 60 }}
          >
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              No timers yet.
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Tap + to add one.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {timers.map((t, idx) => {
            const isActive = activeTimerId === t.id
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 24 }}
                transition={{
                  duration: 0.25,
                  delay: idx < 8 ? idx * 0.03 : 0,
                  layout: { duration: 0.2 },
                }}
                whileHover={{ style:{background:'var(--card-active-bg)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--card-active-border)'
                      : 'var(--card-border)'
                  }`,} }}
                onClick={() => onSelect(t)}
                style={{
                  background: isActive
                    ? 'var(--card-active-bg)'
                    : 'var(--card-bg)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--card-active-border)'
                      : 'var(--card-border)'
                  }`,
                  borderRadius: 13,
                  padding: '11px 13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  cursor: 'pointer',
                  transition: 'background 0.16s, border-color 0.16s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {t.name}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <AnimatePresence>
                      {isActive && running && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: 'var(--text)',
                            background: 'var(--progress-bg)',
                            borderRadius: 5,
                            padding: '2px 6px',
                            letterSpacing: '0.07em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                            }}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: '#ef4444',
                            }}
                          />
                          LIVE
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.button
                      whileHover={{ scale: 1.15, color: '#ef5b5b' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(t.id)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--tag-text)',
                      background: 'var(--tag-bg)',
                      borderRadius: 5,
                      padding: '2px 7px',
                    }}
                  >
                    {t.tag}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontFamily: 'DM Mono, monospace',
                      color: 'var(--text-sub)',
                    }}
                  >
                    {isActive ? fmt(remaining) : fmtShort(t.duration)}
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: 'var(--progress-bg)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: isActive ? `${pct}%` : '100%',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      background: 'var(--progress-fill)',
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

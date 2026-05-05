import { motion, AnimatePresence } from 'framer-motion'
import { fmt, fmtShort } from '../utils/time'
import { useLanguage } from '../contexts/LanguageContext'

export default function TimerList({
  timers,
  activeTimerId,
  remaining,
  total,
  running,
  onSelect,
  onDelete,
  onAdd,
  stepSteps,
  stepIndex,
  stepActive,
  stepLoop,
  onAddStep,
  onDeleteStep,
  onStartSequence,
  onStopSequence,
  onToggleStepLoop,
}) {
  const { t } = useLanguage()
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
        padding: '22px 16px 14px',
        gap: 14,
        position: 'relative',
      }}
    >
      {/* Timers header */}
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
          {t('timers')}
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
          aria-label={t('addNewTimer')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </div>

      {timers.length > 0 && <div style={{ height: 1, background: 'var(--divider)' }} />}

      {/* Scrollable content area */}
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
        <AnimatePresence>
          {timers.map((timer, idx) => {
            const isActive = activeTimerId === timer.id
            return (
              <motion.div
                key={timer.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 24 }}
                transition={{
                  duration: 0.25,
                  delay: idx < 8 ? idx * 0.03 : 0,
                  layout: { duration: 0.2 },
                }}
                onClick={() => onSelect(timer)}
                style={{
                  background: isActive
                    ? 'var(--card-active-bg)'
                    : 'var(--card-bg)',
                  border: `1px solid ${isActive
                    ? 'var(--card-active-border)'
                    : 'var(--card-border)'
                    }`,
                  borderRadius: 16,
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
                    {timer.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                            transition={{ duration: 1.4, repeat: Infinity }}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: '#ef4444',
                            }}
                          />
                          {t('live')}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.button
                      whileHover={{ scale: 1.15, color: '#ef5b5b' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(timer.id)
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
                    {t('tag_' + timer.tag)}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontFamily: 'DM Mono, monospace',
                      color: 'var(--text-sub)',
                    }}
                  >
                    {isActive ? fmt(remaining) : fmtShort(timer.duration)}
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
                    animate={{ width: isActive ? `${pct}%` : '100%' }}
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

        {/* ── Step Sequence section ── */}
        <div style={{ height: 1, background: 'var(--divider)', marginTop: 8, marginBottom: 2, flexShrink: 0 }} />

        {/* Step Sequence header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.15px',
            }}
          >
            {t('stepSequence')}
          </p>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {/* Loop toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleStepLoop}
              title={stepLoop ? t('loopOn') : t('loopOff')}
              style={{
                background: stepLoop ? 'var(--play-bg)' : 'transparent',
                border: `1px solid ${stepLoop ? 'transparent' : 'var(--card-border)'}`,
                borderRadius: 7,
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stepLoop ? 'var(--play-color)' : 'var(--text-muted)',
                transition: 'background 0.18s, border-color 0.18s, color 0.18s',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </motion.button>

            {/* Start / Stop sequence */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stepActive ? onStopSequence : onStartSequence}
              disabled={!stepActive && stepSteps.length === 0}
              style={{
                background: stepActive ? '#ef4444' : 'var(--play-bg)',
                border: 'none',
                borderRadius: 7,
                height: 26,
                paddingInline: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                color: stepActive ? '#fff' : 'var(--play-color)',
                fontSize: 11,
                fontWeight: 600,
                opacity: !stepActive && stepSteps.length === 0 ? 0.38 : 1,
                transition: 'background 0.18s, opacity 0.18s',
              }}
            >
              {stepActive ? (
                <>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                  {t('stop')}
                </>
              ) : (
                <>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {t('start')}
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Step items with vertical stepper */}
        {stepSteps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {t('noStepsYet')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence>
              {stepSteps.map((step, idx) => {
                const isStepActive = stepActive && stepIndex === idx
                const isCompleted = stepActive && idx < stepIndex
                const isLast = idx === stepSteps.length - 1

                return (
                  <motion.div
                    key={step.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', gap: 8 }}
                  >
                    {/* Stepper column */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 14,
                        paddingTop: 9,
                        flexShrink: 0,
                      }}
                    >
                      {/* Dot */}
                      <motion.div
                        animate={isStepActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={isStepActive ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : {}}
                        style={{
                          width: isStepActive ? 10 : 8,
                          height: isStepActive ? 10 : 8,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: isCompleted || isStepActive
                            ? 'var(--progress-fill)'
                            : 'transparent',
                          border: `1.5px solid ${isCompleted || isStepActive
                            ? 'var(--progress-fill)'
                            : 'var(--divider)'}`,
                          transition: 'background 0.25s ease, border-color 0.25s ease, width 0.15s ease, height 0.15s ease',
                        }}
                      />
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          style={{
                            width: 1,
                            flex: 1,
                            minHeight: 10,
                            marginTop: 3,
                            background: isCompleted
                              ? 'var(--progress-fill)'
                              : 'var(--divider)',
                            opacity: isCompleted ? 0.5 : 1,
                            transition: 'background 0.3s ease',
                          }}
                        />
                      )}
                    </div>

                    {/* Step card */}
                    <div
                      style={{
                        flex: 1,
                        background: isStepActive
                          ? 'var(--card-active-bg)'
                          : 'var(--card-bg)',
                        border: `1px solid ${isStepActive
                          ? 'var(--card-active-border)'
                          : 'var(--card-border)'}`,
                        borderRadius: 10,
                        padding: '7px 9px',
                        marginBottom: isLast ? 0 : 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.18s, border-color 0.18s',
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {step.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10.5,
                            fontFamily: 'DM Mono, monospace',
                            color: isStepActive ? 'var(--text-sub)' : 'var(--text-muted)',
                            marginTop: 1,
                          }}
                        >
                          {isStepActive ? fmt(remaining) : fmtShort(step.duration)}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ color: '#ef5b5b' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteStep(step.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginLeft: 4,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Step button — pinned to bottom of panel */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onAddStep}
        style={{
          background: 'var(--play-bg)',
          border: '1px dashed var(--play-bg)',
          borderRadius: 10,
          padding: '9px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          color: 'var(--play-color)',
          fontSize: 12,
          fontWeight: 500,
          flexShrink: 0,
          transition: 'border-color 0.18s, background 0.18s',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {t('addStepBtn')}
      </motion.button>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 22,
          background: 'var(--card-bg)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: -1,
        }}
      />
    </motion.div>
  )
}

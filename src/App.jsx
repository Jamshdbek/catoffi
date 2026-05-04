import { useState, useEffect, useCallback, useRef } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import UpdateBanner from './components/UpdateBanner'
import Sidebar from './components/Sidebar'
import TimerDisplay from './components/TimerDisplay'
import TimerList from './components/TimerList'
import AddTimerModal from './components/AddTimerModal'
import ServiceModal from './components/ServiceModal'
import TitleBar from './components/TitleBar'
import { PRESETS, INITIAL_TIMERS } from './utils/constants'
import { useTimer } from './hooks/useTimer'

function AppInner() {
  const { bgImage } = useTheme()
  const [preset, setPreset] = useState(PRESETS[0])
  const [activeTimer, setActiveTimer] = useState(null)
  const [timers, setTimers] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-timer-timers')
      return saved ? JSON.parse(saved) : INITIAL_TIMERS
    } catch {
      return INITIAL_TIMERS
    }
  })
  const [showModal, setShowModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('focus-notifications') ?? 'true') } catch { return true }
  })
  const [floatingTimerEnabled, setFloatingTimerEnabled] = useState(false)
  const [windowHeaderEnabled, setWindowHeaderEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('focus-window-header') ?? 'true') } catch { return true }
  })

  const isWindows = window.electronAPI?.platform === 'win32'
  const showTitleBar = isWindows && windowHeaderEnabled

  // Step sequence state
  const [stepSteps, setStepSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-timer-step-seq')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [stepIndex, setStepIndex] = useState(0)
  const [stepLoop, setStepLoop] = useState(false)
  const [stepActive, setStepActive] = useState(false)
  const [showStepModal, setShowStepModal] = useState(false)

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('focus-timer-stats')
      return saved
        ? JSON.parse(saved)
        : { sessions: 0, focusTime: 0, streak: 0, lastDate: null }
    } catch {
      return { sessions: 0, focusTime: 0, streak: 0, lastDate: null }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('focus-timer-timers', JSON.stringify(timers))
    } catch { }
  }, [timers])

  useEffect(() => {
    try {
      localStorage.setItem('focus-timer-step-seq', JSON.stringify(stepSteps))
    } catch { }
  }, [stepSteps])

  useEffect(() => {
    try {
      localStorage.setItem('focus-timer-stats', JSON.stringify(stats))
    } catch { }
  }, [stats])

  // Derive active values (step mode takes priority over regular timer)
  const activeTimerObj = !stepActive ? timers.find((t) => t.id === activeTimer) : null
  const currentStepObj = stepActive ? (stepSteps[stepIndex] ?? null) : null
  const currentTitle = currentStepObj?.name ?? activeTimerObj?.name ?? preset.label
  const currentDuration = currentStepObj?.duration ?? activeTimerObj?.duration ?? preset.duration

  // Ref so handleComplete can call timer.startWithDuration (timer defined below)
  const timerRef = useRef(null)

  const handleComplete = useCallback(() => {
    setStats((s) => {
      const today = new Date().toDateString()
      const newStreak = s.lastDate === today ? s.streak : s.streak + 1
      return {
        sessions: s.sessions + 1,
        focusTime: s.focusTime + currentDuration,
        streak: newStreak,
        lastDate: today,
      }
    })

    if (window.electronAPI) {
      window.electronAPI.timerFinished({
        name: currentTitle,
        type: currentStepObj?.tag ?? activeTimerObj?.tag ?? 'Focus',
        duration: currentDuration,
        notificationsEnabled,
      })
    } else if (notificationsEnabled) {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`⏰ ${currentTitle}`, {
            body: `Time's up! Session complete.`,
          })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission()
        }
      }
    }

    // Advance step sequence
    if (stepActive) {
      const nextIdx = stepIndex + 1
      if (nextIdx < stepSteps.length) {
        setStepIndex(nextIdx)
        timerRef.current?.startWithDuration(stepSteps[nextIdx].duration)
      } else if (stepLoop) {
        setStepIndex(0)
        timerRef.current?.startWithDuration(stepSteps[0].duration)
      } else {
        setStepActive(false)
        setStepIndex(0)
      }
    }
  }, [currentTitle, currentDuration, activeTimerObj, currentStepObj, stepActive, stepIndex, stepSteps, stepLoop, notificationsEnabled])

  const timer = useTimer({
    initialDuration: PRESETS[0].duration,
    onComplete: handleComplete,
  })

  // Keep ref current so handleComplete can call timer methods
  timerRef.current = timer

  // Sync timer duration on preset/timer change — skipped while step sequence is running
  useEffect(() => {
    if (!stepActive) {
      timer.setDuration(currentDuration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDuration])

  const handleSelectPreset = useCallback((p) => {
    setPreset(p)
    setActiveTimer(null)
  }, [])

  const handleSelectTimer = useCallback((t) => {
    setActiveTimer(t.id)
    setStepActive(false)
    setStepIndex(0)
  }, [])

  const handleDeleteTimer = useCallback(
    (id) => {
      setTimers((ts) => ts.filter((t) => t.id !== id))
      if (activeTimer === id) {
        setActiveTimer(null)
      }
    },
    [activeTimer]
  )

  const handleAddTimer = useCallback((t) => {
    setTimers((ts) => [...ts, t])
  }, [])

  // Step sequence handlers
  const handleAddStep = useCallback((step) => {
    setStepSteps((ss) => [...ss, step])
  }, [])

  const handleDeleteStep = useCallback((id) => {
    setStepSteps((ss) => {
      const next = ss.filter((s) => s.id !== id)
      if (next.length === 0) setStepActive(false)
      return next
    })
  }, [])

  const handleStartSequence = useCallback(() => {
    if (stepSteps.length === 0) return
    setActiveTimer(null)
    setStepActive(true)
    setStepIndex(0)
    timerRef.current?.startWithDuration(stepSteps[0].duration)
  }, [stepSteps])

  const handleStopSequence = useCallback(() => {
    setStepActive(false)
    setStepIndex(0)
    timerRef.current?.pause()
  }, [])

  const handleToggleStepLoop = useCallback(() => {
    setStepLoop((v) => !v)
  }, [])

  // Electron: show/hide native floating window when toggle changes
  useEffect(() => {
    if (!window.electronAPI) return
    if (floatingTimerEnabled) {
      window.electronAPI.showFloatingTimer()
    } else {
      window.electronAPI.hideFloatingTimer()
    }
  }, [floatingTimerEnabled])

  // Electron: push timer state to floating window on every tick
  useEffect(() => {
    if (!window.electronAPI || !floatingTimerEnabled) return
    window.electronAPI.updateFloatingTimer({
      remaining: timer.remaining,
      running: timer.running,
      title: currentTitle,
    })
  }, [timer.remaining, timer.running, currentTitle, floatingTimerEnabled])

  // Electron: listen for play/pause requests from floating window
  useEffect(() => {
    if (!window.electronAPI) return
    const cleanup = window.electronAPI.onFloatingTimerToggleRequest(() => timer.toggle())
    return cleanup
  }, [timer.toggle])

  // Electron: floating window closed by its own X button → sync state
  useEffect(() => {
    if (!window.electronAPI) return
    const cleanup = window.electronAPI.onFloatingTimerClosed(() => setFloatingTimerEnabled(false))
    return cleanup
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (showModal || showStepModal) return
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT' ||
        e.target.tagName === 'TEXTAREA'
      )
        return

      if (e.code === 'Space') {
        e.preventDefault()
        timer.toggle()
      } else if (e.code === 'KeyR') {
        timer.reset()
      } else if (e.code === 'KeyN' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setShowModal(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [timer, showModal, showStepModal])

  return (
    <>
      <UpdateBanner />
      {showTitleBar && <TitleBar />}
      <div
        style={{
          width: '100%',
          height: '100vh',
          background: 'var(--bg)',
          backgroundImage: bgImage ? 'none' : 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: showTitleBar ? 52 : 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
          gap: 18,
          position: 'relative',
          overflow: 'hidden',
        }}
        className="drag-region"
      >
        {bgImage && (
          <img
            key={bgImage}
            src={bgImage}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.02,
            pointerEvents: 'none',
            zIndex: 1,
            backgroundSize: 'cover',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />

        <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, position: 'relative', zIndex: 2 }}>
          <Sidebar
            selectedPresetId={preset.id}
            activeTimerId={activeTimer}
            onSelectPreset={handleSelectPreset}
            stats={stats}
            onOpenServices={() => setShowServiceModal(true)}
          />

          <TimerDisplay
            title={currentTitle}
            remaining={timer.remaining}
            total={timer.duration}
            running={timer.running}
            onToggle={timer.toggle}
            onReset={timer.reset}
            onSkip={timer.skip}
            onAdjust={timer.setRemainingManual}
          />

          <TimerList
            timers={timers}
            activeTimerId={activeTimer}
            remaining={timer.remaining}
            total={timer.duration}
            running={timer.running}
            onSelect={handleSelectTimer}
            onDelete={handleDeleteTimer}
            onAdd={() => setShowModal(true)}
            stepSteps={stepSteps}
            stepIndex={stepIndex}
            stepActive={stepActive}
            stepLoop={stepLoop}
            onAddStep={() => setShowStepModal(true)}
            onDeleteStep={handleDeleteStep}
            onStartSequence={handleStartSequence}
            onStopSequence={handleStopSequence}
            onToggleStepLoop={handleToggleStepLoop}
          />
        </div>

        <AddTimerModal
          open={showModal}
          onAdd={handleAddTimer}
          onClose={() => setShowModal(false)}
        />
        <AddTimerModal
          open={showStepModal}
          onAdd={handleAddStep}
          onClose={() => setShowStepModal(false)}
          title="New Step"
          submitLabel="Add Step"
        />
        <ServiceModal
          open={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => {
            setNotificationsEnabled((v) => {
              const next = !v
              try { localStorage.setItem('focus-notifications', JSON.stringify(next)) } catch { }
              return next
            })
          }}
          floatingTimerEnabled={floatingTimerEnabled}
          onToggleFloatingTimer={() => setFloatingTimerEnabled((v) => !v)}
          windowHeaderEnabled={windowHeaderEnabled}
          onToggleWindowHeader={isWindows ? () => {
            setWindowHeaderEnabled((v) => {
              const next = !v
              try { localStorage.setItem('focus-window-header', JSON.stringify(next)) } catch { }
              return next
            })
          } : null}
        />
      </div>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}

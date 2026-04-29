import { useState, useEffect, useCallback } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Sidebar from './components/Sidebar'
import TimerDisplay from './components/TimerDisplay'
import TimerList from './components/TimerList'
import AddTimerModal from './components/AddTimerModal'
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

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem('focus-timer-timers', JSON.stringify(timers))
    } catch {}
  }, [timers])

  useEffect(() => {
    try {
      localStorage.setItem('focus-timer-stats', JSON.stringify(stats))
    } catch {}
  }, [stats])

  // Get active title and duration
  const activeTimerObj = timers.find((t) => t.id === activeTimer)
  const currentTitle = activeTimerObj ? activeTimerObj.name : preset.label
  const currentDuration = activeTimerObj ? activeTimerObj.duration : preset.duration

  // Timer hook
  const handleComplete = useCallback(() => {
    // Update stats
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

    // Trigger notification
    if (window.electronAPI) {
      window.electronAPI.timerFinished({
        name: currentTitle,
        type: activeTimerObj ? activeTimerObj.tag : 'Focus',
        duration: currentDuration,
      })
    } else {
      // Browser fallback
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
  }, [currentTitle, currentDuration, activeTimerObj])

  const timer = useTimer({
    initialDuration: PRESETS[0].duration,
    onComplete: handleComplete,
  })

  // Sync timer duration when preset/active timer changes
  useEffect(() => {
    timer.setDuration(currentDuration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDuration])

  const handleSelectPreset = useCallback(
    (p) => {
      setPreset(p)
      setActiveTimer(null)
    },
    []
  )

  const handleSelectTimer = useCallback((t) => {
    setActiveTimer(t.id)
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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (showModal) return
      // Don't trigger when typing in inputs
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
  }, [timer, showModal])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: bgImage ? 'none' : 'var(--bg)',
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : 'var(--bg-gradient)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 18,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="drag-region"
    >
      {/* Subtle grain texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          pointerEvents: 'none',
          backgroundSize:"cover",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="no-drag" style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
        <Sidebar
          selectedPresetId={preset.id}
          activeTimerId={activeTimer}
          onSelectPreset={handleSelectPreset}
          stats={stats}
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
        />
      </div>

      <AddTimerModal
        open={showModal}
        onAdd={handleAddTimer}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}

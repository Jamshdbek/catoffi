import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Timer hook with smooth ticking.
 * Uses requestAnimationFrame-style update via setInterval(1s) but tracks
 * absolute end timestamp so it stays accurate even if tab is throttled.
 */
export function useTimer({ initialDuration = 25 * 60, onComplete } = {}) {
  const [duration, setDuration] = useState(initialDuration)
  const [remaining, setRemaining] = useState(initialDuration)
  const [running, setRunning] = useState(false)

  const endTimestampRef = useRef(null)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Tick loop
  useEffect(() => {
    if (!running) return

    const tick = () => {
      const now = Date.now()
      const remainingMs = endTimestampRef.current - now
      const secs = Math.max(0, Math.ceil(remainingMs / 1000))
      setRemaining(secs)

      if (remainingMs <= 0) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setRunning(false)
        endTimestampRef.current = null
        if (onCompleteRef.current) onCompleteRef.current()
      }
    }

    // Run once immediately
    tick()
    intervalRef.current = setInterval(tick, 250)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running])

  const start = useCallback(() => {
    if (remaining <= 0) return
    endTimestampRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }, [remaining])

  const pause = useCallback(() => {
    setRunning(false)
    endTimestampRef.current = null
  }, [])

  const toggle = useCallback(() => {
    if (running) pause()
    else start()
  }, [running, start, pause])

  const reset = useCallback(() => {
    setRunning(false)
    endTimestampRef.current = null
    setRemaining(duration)
  }, [duration])

  const skip = useCallback(() => {
    setRunning(false)
    endTimestampRef.current = null
    setRemaining(0)
  }, [])

  /**
   * Set a new total duration for the timer (and reset remaining).
   */
  const setNewDuration = useCallback((newDuration) => {
    setDuration(newDuration)
    setRemaining(newDuration)
    setRunning(false)
    endTimestampRef.current = null
  }, [])

  /**
   * Set the remaining time directly (used by drag-to-adjust).
   * Only allowed when not running.
   */
  const setRemainingManual = useCallback((newRemaining) => {
    if (running) return
    const clamped = Math.max(0, Math.min(duration, Math.round(newRemaining)))
    setRemaining(clamped)
  }, [running, duration])

  return {
    duration,
    remaining,
    running,
    progress: duration > 0 ? remaining / duration : 0,
    start,
    pause,
    toggle,
    reset,
    skip,
    setDuration: setNewDuration,
    setRemainingManual,
  }
}

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * Circular timer with draggable handle to adjust remaining time when paused.
 *
 * Props:
 *   remaining: seconds left
 *   duration: total seconds
 *   running: whether timer is running
 *   onAdjust: callback(newRemaining) when user drags the handle
 */
export default function CircularTimer({
  remaining,
  duration,
  running,
  onAdjust,
  size = 360,
}) {
  const R = size / 2 - 42
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * R
  const progress = duration > 0 ? remaining / duration : 1
  const offset = circ * (1 - progress)

  // Counter-clockwise dot angle: starts at top, moves right to left as time runs out
  const dotAngle = -Math.PI / 2 - (1 - progress) * 2 * Math.PI
  const dotX = cx + R * Math.cos(dotAngle)
  const dotY = cy + R * Math.sin(dotAngle)

  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  /** Convert pointer position to a remaining-seconds value. */
  const computeRemainingFromPointer = useCallback((clientX, clientY) => {
    if (!svgRef.current) return null
    const rect = svgRef.current.getBoundingClientRect()
    // Coordinates relative to SVG center
    const x = clientX - rect.left - cx
    const y = clientY - rect.top - cy
    // Calculate angle: 0 is at the top, going clockwise
    let angle = Math.atan2(x, -y) // 0 at top, positive clockwise
    if (angle < 0) angle += 2 * Math.PI
    // Map angle to fraction of cycle (0..1)
    const fraction = 1 - (angle / (2 * Math.PI))
    return Math.round(fraction * duration)
  }, [cx, cy, duration])

  const handlePointerDown = (e) => {
    if (running) return
    e.preventDefault()
    setDragging(true)
    const newRemaining = computeRemainingFromPointer(e.clientX, e.clientY)
    if (newRemaining !== null && onAdjust) onAdjust(newRemaining)
  }

  useEffect(() => {
    if (!dragging) return

    const handleMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX
      const clientY = e.clientY ?? e.touches?.[0]?.clientY
      if (clientX === undefined) return
      const newRemaining = computeRemainingFromPointer(clientX, clientY)
      if (newRemaining !== null && onAdjust) onAdjust(newRemaining)
    }
    const handleUp = () => setDragging(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [dragging, computeRemainingFromPointer, onAdjust])

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      style={{
        display: 'block',
        cursor: running ? 'default' : (dragging ? 'grabbing' : 'pointer'),
        userSelect: 'none',
      }}
      onMouseDown={handlePointerDown}
      onTouchStart={(e) => {
        if (running) return
        const t = e.touches[0]
        if (!t) return
        setDragging(true)
        const newRemaining = computeRemainingFromPointer(t.clientX, t.clientY)
        if (newRemaining !== null && onAdjust) onAdjust(newRemaining)
      }}
    >
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ring-color)" />
          <stop offset="100%" stopColor="var(--ring-end)" />
        </linearGradient>
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="var(--ring-track)"
        strokeWidth="14"
      />

      {/* Inner circle - subtle fill */}
      <circle
        cx={cx}
        cy={cy}
        r={R - 22}
        fill="var(--card-bg)"
      />

      {/* Progress arc — counter-clockwise via mirror transform */}
      <g transform={`scale(-1,1) translate(-${size},0)`}>
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: running ? 'stroke-dashoffset 0.8s linear' : (dragging ? 'none' : 'stroke-dashoffset 0.25s ease-out'),
          }}
        />
      </g>

      {/* Drag handle dot at leading edge */}
      {progress > 0.005 && (
        <motion.circle
          cx={dotX}
          cy={dotY}
          r={dragging ? 11 : 8}
          fill="var(--dot-color)"
          stroke="var(--ring-color)"
          strokeWidth={dragging ? 3 : 2}
          filter={running ? 'url(#dotGlow)' : undefined}
          animate={{
            r: dragging ? 11 : 8,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            transition: running ? 'cx 0.8s linear, cy 0.8s linear' : 'none',
          }}
        />
      )}
    </svg>
  )
}

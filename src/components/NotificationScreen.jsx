import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import catData from '../assets/look_cat.json'

export default function NotificationScreen() {
  const [show, setShow] = useState(false)

  const handleClose = useCallback(() => {
    setShow(false)
    setTimeout(() => {
      if (window.electronAPI) {
        window.electronAPI.focusMainWindow()
      }
    }, 350)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const soundEnabled = params.get('notificationsEnabled') !== 'false'

    if (soundEnabled) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(500, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15)
        osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.45)
      } catch {}
    }

    setShow(true)
    const t = setTimeout(handleClose, 10000)
    return () => clearTimeout(t)
  }, [handleClose])

  return (
    <div
      onClick={handleClose}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: show ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Lottie
          animationData={catData}
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>
    </div>
  )
}

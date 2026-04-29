import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('focus-timer-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  const [bgImage, setBgImageState] = useState(() => {
    try {
      return localStorage.getItem('focus-timer-bg-image') || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('focus-timer-theme', theme)
    } catch {}
  }, [theme])

  const setBgImage = (dataUrl) => {
    setBgImageState(dataUrl)
    try {
      if (dataUrl) {
        localStorage.setItem('focus-timer-bg-image', dataUrl)
      } else {
        localStorage.removeItem('focus-timer-bg-image')
      }
    } catch {
      // localStorage may be full — still apply in-memory
    }
  }

  const isDark = theme !== 'light'

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, bgImage, setBgImage }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

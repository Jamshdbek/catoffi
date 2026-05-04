import { useState } from 'react'

function WinBtn({ onClick, children, isClose }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 46,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered
          ? isClose
            ? '#e81123'
            : 'rgba(128,128,128,0.18)'
          : 'transparent',
        color: hovered && isClose ? '#ffffff' : 'var(--text-sub)',
        transition: 'background 0.1s, color 0.1s',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

export default function TitleBar() {
  const [maximized, setMaximized] = useState(false)

  const ctrl = (action) => {
    if (action === 'maximize') setMaximized((v) => !v)
    window.electronAPI?.windowControl(action)
  }

  return (
    <div
      className="drag-region"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--panel-border)',
      }}
    >
      <span
        style={{
          padding: '0 14px',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        CatOffi
      </span>

      <div className="no-drag" style={{ display: 'flex', height: '100%' }}>
        {/* Minimize */}
        <WinBtn onClick={() => ctrl('minimize')}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </WinBtn>

        {/* Maximize / Restore */}
        <WinBtn onClick={() => ctrl('maximize')}>
          {maximized ? (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="0.5" width="7" height="7" />
              <rect x="0.5" y="3" width="7" height="7" fill="var(--bg)" />
              <rect x="0.5" y="3" width="7" height="7" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="0.5" y="0.5" width="9" height="9" />
            </svg>
          )}
        </WinBtn>

        {/* Close */}
        <WinBtn onClick={() => ctrl('close')} isClose>
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </WinBtn>
      </div>
    </div>
  )
}

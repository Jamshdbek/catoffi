import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import NotificationScreen from './components/NotificationScreen.jsx'
import './styles/index.css'

// Check if this window is the fullscreen notification
const params = new URLSearchParams(window.location.search)
const isNotification = params.get('notify') === '1'
// const isNotification = true


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isNotification ? (
      <NotificationScreen
        name={params.get('name') || 'Timer'}
        type={params.get('type') || 'Timer'}
        duration={parseInt(params.get('duration') || '0', 10)}
      />
    ) : (
      <App />
    )}
  </React.StrictMode>
)

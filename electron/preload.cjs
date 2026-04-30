const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Timer finished -> open fullscreen notification window
  timerFinished: (payload) => ipcRenderer.send('timer-finished', payload),
  // Close the notification window (called from inside it)
  closeNotification: () => ipcRenderer.send('close-notification'),
  // Bring main window to front
  focusMainWindow: () => ipcRenderer.send('focus-main-window'),
  // Window controls (for custom titlebar on Windows)
  windowControl: (action) => ipcRenderer.send('window-control', action),
  // Get platform
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  // Detect if we are in Electron
  isElectron: true,

  // Floating timer — called from main window
  showFloatingTimer: () => ipcRenderer.send('floating-timer-show'),
  hideFloatingTimer: () => ipcRenderer.send('floating-timer-hide'),
  updateFloatingTimer: (state) => ipcRenderer.send('floating-timer-update', state),
  onFloatingTimerToggleRequest: (cb) => {
    const handler = () => cb();
    ipcRenderer.on('floating-timer-toggle-request', handler);
    return () => ipcRenderer.removeListener('floating-timer-toggle-request', handler);
  },
  onFloatingTimerClosed: (cb) => {
    const handler = () => cb();
    ipcRenderer.on('floating-timer-closed', handler);
    return () => ipcRenderer.removeListener('floating-timer-closed', handler);
  },

  // Floating timer — called from the floating window itself
  onFloatingTimerState: (cb) => {
    const handler = (_e, state) => cb(state);
    ipcRenderer.on('floating-timer-state', handler);
    return () => ipcRenderer.removeListener('floating-timer-state', handler);
  },
  floatingTimerToggle: () => ipcRenderer.send('floating-timer-toggle'),
  floatingTimerClose: () => ipcRenderer.send('floating-timer-close'),

  // Auto-updater
  onUpdateAvailable: (cb) => {
    const h = (_e, info) => cb(info);
    ipcRenderer.on('update-available', h);
    return () => ipcRenderer.removeListener('update-available', h);
  },
  onUpdateDownloadProgress: (cb) => {
    const h = (_e, progress) => cb(progress);
    ipcRenderer.on('update-download-progress', h);
    return () => ipcRenderer.removeListener('update-download-progress', h);
  },
  onUpdateDownloaded: (cb) => {
    const h = (_e, info) => cb(info);
    ipcRenderer.on('update-downloaded', h);
    return () => ipcRenderer.removeListener('update-downloaded', h);
  },
  onUpdateError: (cb) => {
    const h = (_e, msg) => cb(msg);
    ipcRenderer.on('update-error', h);
    return () => ipcRenderer.removeListener('update-error', h);
  },
  installUpdate: () => ipcRenderer.send('install-update'),
});

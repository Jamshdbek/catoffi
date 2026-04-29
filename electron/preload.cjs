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
});

const { app, BrowserWindow, ipcMain, Notification, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;
let notificationWindow = null;
let tray = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    show: false,
    backgroundColor: '#0a0a0a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: process.platform !== 'darwin' ? false : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // macOS-style: minimize to tray instead of close
  mainWindow.on('close', (e) => {
    if (process.platform !== 'darwin' && !app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

/**
 * Open a fullscreen notification window when the timer ends.
 * This appears on top of all windows on all displays' primary screen.
 */
function createFullscreenNotification(payload) {
  // Close any existing notification window first
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow = null;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  notificationWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    fullscreen: true,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    show: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Always-on-top across full screens (macOS too)
  notificationWindow.setAlwaysOnTop(true, 'screen-saver');
  notificationWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Pass the data via query string
  const params = new URLSearchParams({
    name: payload.name || 'Timer',
    type: payload.type || 'Timer',
    duration: String(payload.duration || 0),
  });

  if (isDev) {
    notificationWindow.loadURL(`http://localhost:5173/?notify=1&${params.toString()}`);
  } else {
    notificationWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      search: `notify=1&${params.toString()}`,
    });
  }

  notificationWindow.once('ready-to-show', () => {
    notificationWindow.show();
    notificationWindow.focus();
  });

  // Also fire a system notification
  if (Notification.isSupported()) {
    new Notification({
      title: '⏰ Time is up!',
      body: `${payload.name || 'Your timer'} has finished.`,
      silent: false,
      urgency: 'critical',
    }).show();
  }

  notificationWindow.on('closed', () => {
    notificationWindow = null;
  });
}

function createTray() {
  // Create a transparent icon to avoid file dependency
  const icon = nativeImage.createEmpty();
  try {
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Focus Timer',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip('Focus Timer');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    // Tray may fail on Linux without proper icon - just skip
    console.log('Tray not available:', e.message);
  }
}

app.whenReady().then(() => {
  createMainWindow();
  if (process.platform !== 'darwin') {
    createTray();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

// IPC handlers - bridge between renderer and main process
ipcMain.on('timer-finished', (event, payload) => {
  createFullscreenNotification(payload);
});

ipcMain.on('close-notification', () => {
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow = null;
  }
});

ipcMain.on('focus-main-window', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow = null;
  }
});

ipcMain.on('window-control', (event, action) => {
  if (!mainWindow) return;
  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'maximize':
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      else mainWindow.maximize();
      break;
    case 'close':
      mainWindow.close();
      break;
  }
});

ipcMain.handle('get-platform', () => process.platform);

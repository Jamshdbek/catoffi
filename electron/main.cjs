const { app, BrowserWindow, ipcMain, Notification, screen, Tray, Menu, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;
let notificationWindow = null;
let floatingWindow = null;
let tray = null;

const iconPath = path.join(__dirname, '../public/icon.png');

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    title: 'CatOffi',
    minWidth: 980,
    minHeight: 680,
    show: false,
    backgroundColor: '#0a0a0a',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    frame: process.platform !== 'darwin' ? false : true,
    icon: iconPath,
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

  const catW = 200;
  const catH = 355;

  notificationWindow = new BrowserWindow({
    width: catW,
    height: catH,
    x: Math.round((width - catW) / 2),
    y: height - catH,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    show: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

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
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.show();
      notificationWindow.focus();
    }
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

function createFloatingWindow() {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.show();
    return;
  }

  const { width } = screen.getPrimaryDisplay().workAreaSize;

  floatingWindow = new BrowserWindow({
    width: 200,
    height: 66,
    x: width - 220,
    y: 20,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  floatingWindow.setAlwaysOnTop(true, 'floating');
  floatingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });

  if (isDev) {
    floatingWindow.loadURL('http://localhost:5173/?floating=1');
  } else {
    floatingWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      search: 'floating=1',
    });
  }

  floatingWindow.on('closed', () => {
    floatingWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('floating-timer-closed');
    }
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
    tray.setToolTip('CatOffi');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    // Tray may fail on Linux without proper icon - just skip
    console.log('Tray not available:', e.message);
  }
}

app.whenReady().then(() => {
  createMainWindow();
  if (process.platform === 'darwin' && fs.existsSync(iconPath)) {
    app.dock.setIcon(iconPath);
  }
  if (process.platform !== 'darwin') {
    createTray();
  }

  if (!isDev) {
    // Check for updates 5 seconds after launch so the window is ready
    setTimeout(() => autoUpdater.checkForUpdates(), 5000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

autoUpdater.on('update-available', (info) => {
  mainWindow?.webContents.send('update-available', info);
});

autoUpdater.on('download-progress', (progress) => {
  mainWindow?.webContents.send('update-download-progress', progress);
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow?.webContents.send('update-downloaded', info);
});

autoUpdater.on('error', (err) => {
  mainWindow?.webContents.send('update-error', err?.message ?? 'Unknown error');
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
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

ipcMain.on('floating-timer-show', () => {
  createFloatingWindow();
});

ipcMain.on('floating-timer-hide', () => {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.close();
    floatingWindow = null;
  }
});

ipcMain.on('floating-timer-update', (_event, state) => {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.webContents.send('floating-timer-state', state);
  }
});

ipcMain.on('floating-timer-toggle', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('floating-timer-toggle-request');
  }
});

ipcMain.on('floating-timer-close', () => {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.close();
    floatingWindow = null;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('floating-timer-closed');
  }
});

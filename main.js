const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron/main')
const { execFile } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const isDev = !app.isPackaged
let win = null
let timer = null
let last = null

function micBinaryPath() {
    // In dev, use the assets path, when packaged use the resources path
    return isDev 
    ? path.join(__dirname, 'assets', 'bin', 'mic-in-use') 
    : path.join(app.getAppPath(), 'resources', 'bin', 'mic-in-use')
}

function startMicWatch() {
    if (process.platform !== 'darwin') return
    const bin = micBinaryPath()
    if (!fs.existsSync(bin)) {
        console.warn(`[mic] binary not found at ${bin}. Skipping mic watch.`)
        return
    }
    try {
        fs.accessSync(bin, fs.constants.X_OK)
    } catch (e) {
        console.warn(`[mic] binary is not executable at ${bin}. Run: chmod +x ${bin}`)
        return
    }
    // Send initial status immediately
    execFile(bin, (err, stdout) => {
        if (!err && win) {
            const inUse = String(stdout).trim() === '1'
            last = inUse
            win.webContents.send('mic-in-use', inUse)
        }
    })
    timer = setInterval(() => {
        execFile(bin, (err, stdout) => {
            if (err) {
                // one-line warn; keep noise low
                console.warn(`[mic] detector error: ${err.message}`)
                return
            }
            if (!win) return
            const inUse = String(stdout).trim() === '1'
            if (inUse !== last) {
                last = inUse
                win.webContents.send('mic-in-use', inUse) // IPC: main -> renderer
            }
        })
    }, 1000)
}

function getMicPermission() {
    return systemPreferences.askForMediaAccess('microphone')
}

function createWindow() {
    win = new BrowserWindow({
      width: 900, height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false, // safer
        contextIsolation: true, // safer
      },
    });
  
    if (isDev) {
      win.webContents.once('did-fail-load', () => {
        win.loadFile(path.join(__dirname, 'index.html'))
      })
      win.loadURL('http://localhost:5173')
      win.webContents.openDevTools()
    } else {
      win.loadFile(path.join(__dirname, 'index.html'))
    }
  
    if (process.platform === 'darwin') {
      systemPreferences.askForMediaAccess('microphone').then(() => startMicWatch());
    } else {
      startMicWatch();
    }
  }

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('mic-status', () => last)
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
      })
})


app.on('window-all-closed', () => {
    if (timer) clearInterval(timer);
    if (process.platform !== 'darwin') {
    app.quit()
  }
})
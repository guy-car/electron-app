const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  micInUse: (callback) => ipcRenderer.on('mic-in-use', callback)
})

contextBridge.exposeInMainWorld('mic', {
  onChange: (callback) => {
    ipcRenderer.on('mic-in-use', (_event, inUse) => callback(inUse))
  },
  getStatus: () => ipcRenderer.invoke('mic-status')
})
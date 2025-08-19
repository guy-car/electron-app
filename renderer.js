const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

// Show ping/pong response in UI
const info = document.getElementById('info')
;(async () => {
  const response = await window.versions.ping()
  info.innerText = `Ping response: ${response}`
})()

// Also log it
;(async () => {
  const response = await window.versions.ping()
  console.log(response)
})()

// Mic status
const micEl = document.getElementById('mic-in-use')
if (window.mic && typeof window.mic.onChange === 'function') {
  window.mic.onChange((inUse) => {
    micEl.innerText = inUse ? 'Mic: in use' : 'Mic: idle'
  })
  // also ask once to populate immediately
  if (typeof window.mic.getStatus === 'function') {
    window.mic.getStatus().then((inUse) => {
      if (typeof inUse === 'boolean') {
        micEl.innerText = inUse ? 'Mic: in use' : 'Mic: idle'
      }
    })
  }
} else {
  micEl.innerText = 'Mic: watcher not available'
}
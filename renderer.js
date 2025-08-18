const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const info = document.getElementById('info');
(async () => {
    const response = await window.versions.ping()
    info.innerText = `Ping response: ${response}`
})()

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()
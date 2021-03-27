const electron = require("electron")
const { ipcRenderer } = electron

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(document.querySelector("#hours").value)
    const clock = {
        hours: document.querySelector("#hours").value,
        minutes: document.querySelector("#minutes").value,
        seconds: document.querySelector("#seconds").value,
    }
    ipcRenderer.send("timer:updateClock", clock)
    console.log("sednend data")
})

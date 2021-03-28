const electron = require("electron")
const { ipcRenderer } = electron

document.querySelector("#clockForm").addEventListener("submit", (e) => {
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

document.querySelector("#fontForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const size = document.querySelector("#font").value
    if (size.length > 0) {
        ipcRenderer.send("timer:updateFont", size)
        console.log("updated font")
    } else {
        alert("debilu wpisz coś")
    }
})

document.querySelector("#close").addEventListener("click", (e) => {
    e.preventDefault()
    ipcRenderer.send("app:close")
})

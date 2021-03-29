const electron = require("electron")
const { ipcRenderer, shell } = electron

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

function showConf() {
    document.querySelector("#configForm").innerHTML = `
                <section class="configSection">
                    <input type="text" value="" placeholder="user token" id="token" />
                    <input type="text" value="" placeholder="username" id="username" />
                </section>
                <p>Click <a onClick="openLink()">here</a> to get token</p>
                <button>append config</button>
    `
}

function openLink() {
    shell.openExternal("https://twitchapps.com/tmi/")
}

document.querySelector("#showConfig").addEventListener("click", (e) => {
    e.preventDefault()
    showConf()
})

document.querySelector("#configForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const token = document.querySelector("#token").value
    const username = document.querySelector("#username").value
    if (token.length > 0 && username.length > 0) {
        ipcRenderer.send("app:updateConfig", token, username)
        document.querySelector("#configForm").innerHTML = `
                <button onClick="showConf()" id="showConfig">Show Config</button>
    `
    } else {
        alert("wpisz coś debilu")
    }
})

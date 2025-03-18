let adminMode = false
let waitingForProjectSelection = false
let awaitingPassword = false // Status für Passwortabfrage im Terminal
let awaitingSecretPassword = false // Neuer Status für die Secret-Passwortabfrage
let commandHistory = [];
let historyIndex = 0;

const terminalInput = document.querySelector(".terminal-input")
const terminalOutput = document.getElementById("terminal-output")
const bruteBtn = document.getElementById("bruteforce-btn")
const injectBtn = document.getElementById("inject-btn")
const secretBtn = document.getElementById("secret-btn")

/* Funktionen zur Ermittlung und Wiederherstellung der Caret-Position */
function getCaretPosition(editableDiv) {
  let caretPos = 0
  const sel = window.getSelection()
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0)
    caretPos = range.endOffset
  }
  return caretPos
}

function setCaretPositionInNode(node, offset) {
  const sel = window.getSelection()
  const range = document.createRange()
  range.setStart(node, offset)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

/* Falls der Cursor im "sudo"-Span liegt, wird er in den Resttext verschoben */
function moveCaretAfterSudo() {
  const span = terminalInput.querySelector("span")
  if (span) {
    if (terminalInput.childNodes.length >= 2) {
      setCaretPositionInNode(terminalInput.childNodes[1], 0)
    } else {
      const tn = document.createTextNode("")
      terminalInput.appendChild(tn)
      setCaretPositionInNode(tn, 0)
    }
  }
}

/* Einfaches Input-Event (ohne spezielle Formatierung) */
terminalInput.addEventListener("input", () => {
  // Text unverändert lassen.
})

terminalInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    let command = terminalInput.innerText.trim();
    if (command !== "") {
      commandHistory.push(command);
      historyIndex = commandHistory.length; // Setze den Index ans Ende der Historie
    }
  }
}, true);

// Listener für die Pfeiltasten zur Navigation in der Befehls-Historie
terminalInput.addEventListener("keydown", function(e) {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (commandHistory.length > 0) {
      if (historyIndex > 0) {
        historyIndex--;
      }
      terminalInput.innerText = commandHistory[historyIndex];
      setCaretPositionInNode(terminalInput.firstChild, terminalInput.innerText.length);
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (commandHistory.length > 0) {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.innerText = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.innerText = "";
      }
      setCaretPositionInNode(terminalInput.firstChild, terminalInput.innerText.length);
    }
  }
});

/* Funktion zur Verarbeitung und Ausgabe von Befehlen */
function processCommand(command) {
  // Neue Passwortabfrage für den secret-Befehl – im Terminal, analog zu awaitingPassword
  if (awaitingSecretPassword) {
    if (command === "latifi") {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Access granted. Redirecting to realsecret.html...</div>`
      setTimeout(() => {
        window.open("realsecret.html", "_blank")
      }, 500)
    } else {
      terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Incorrect secret password.</div>`
    }
    awaitingSecretPassword = false
    terminalOutput.scrollTop = terminalOutput.scrollHeight
    return
  }

  // Bestehende Admin-Passwortabfrage (für sudo su)
  if (awaitingPassword) {
    if (command === "iddox") {
      adminMode = true
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Admin mode activated.</div>`
      document.querySelector(".terminal-header").innerHTML = "Admin@root:~$ "
    } else {
      terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Incorrect password.</div>`
    }
    awaitingPassword = false
    terminalOutput.scrollTop = terminalOutput.scrollHeight
    return
  }

  // Ausgabe des eingegebenen Befehls
  terminalOutput.innerHTML += `<div>Iddox@system:~$ ${command}</div>`
  let recognized = false

  if (command === "clear") {
    terminalOutput.innerHTML = ""
    recognized = true
    return
  } else if (command === "about") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening about page in a new tab...</div>`
    setTimeout(() => {
      window.open("about.html", "_blank")
      // Keine Weiterleitung der aktuellen Seite
    }, 500)
    recognized = true
    return
  } else if (command === "projects") {
    waitingForProjectSelection = true
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Projects:<br>
1. Ultimate Security-Bot<br>
2. Status Rotator-Bot<br>
Please type '1' or '2' to select.
</div>`
    recognized = true
    return
  } else if (command === "contact") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening contact page in a new tab...</div>`
    setTimeout(() => {
      window.open("contact.html", "_blank")
      // Keine Weiterleitung der aktuellen Seite
    }, 500)
    recognized = true
    return
  }
  // Neuer Befehl "secret": Gibt den Hinweis aus (egal ob Admin oder nicht)
  else if (command === "secret") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Iddox@root:~$ The secret of this website is one or more hidden HTML files. You might be able to find them by using certain commands. Try *start secret.* Maybe that will launch our secret HTML file? We might be able to see the command, along with the required password, in the background.</div>`
    recognized = true
    return
  }
  // Befehl zur Aktivierung des Admin-Modus
  else if (command === "sudo su") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Enter admin password:</div>`
    awaitingPassword = true
    recognized = true
    return
  }
  // Neuer Befehl "start real_secret": Nur im Admin-Modus verfügbar; löst eine Passwortabfrage im Terminal aus
  else if (command === "start real_secret") {
    if (adminMode) {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Enter secret password:</div>`
      awaitingSecretPassword = true
    } else {
      terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Access denied. You must enter admin mode first.</div>`
    }
    recognized = true
    return
  }
  // Neuer Befehl "list": Zeigt eine virtuelle Hierarchie des PCs "Iddox" an
  else if (command === "list") {
    const tree = `Iddox/
├── bin/
│   ├── latifi.exe
│   └── secret.txt
├── etc/
│   ├── config.cfg
│   └── hosts
│   └── wireshark
├── home/
│   └── user/
│       ├── documents/
│       │   ├── resume.docx
│       │   └── secret_notes.txt
│       ├── downloads/
│           └──rockyou.txt
└── var/
    └── log/
        └── system.log
        └── win32.log`
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px; white-space: pre;">${tree}</div>`
    recognized = true
    return
  }
  // Änderung: Neuer Terminal-Befehl "-t" statt "latifi -s -H"
  else if (command === "-t") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Starting Terminal module...</div>`
    openNewTerminal()
    recognized = true
    return
  } else if (command === "sudo start latifi.exe") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">latifi.exe started ☠</div>`
    recognized = true
    const cycles = 3
    let currentCycle = 0
    function runCycle() {
      const downloadBar = document.createElement("div")
      downloadBar.innerHTML = "Download: [" + "_".repeat(10) + "]"
      terminalOutput.appendChild(downloadBar)
      let progress = 0
      const cycleInterval = setInterval(() => {
        progress++
        let bar = "Download: ["
        for (let i = 0; i < 10; i++) {
          bar += i < progress ? "█" : "_"
        }
        bar += "]"
        downloadBar.innerHTML = bar
        if (progress >= 10) {
          clearInterval(cycleInterval)
          currentCycle++
          if (currentCycle < cycles) {
            setTimeout(runCycle, 500)
          } else {
            terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Download log.files.txt successful</div>`
            setTimeout(() => {
              terminalOutput.innerHTML = ""
            }, 5000)
          }
        }
      }, 200)
    }
    runCycle()
    return
  } else if (command === "bruteforce -l -p") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Running BruteForce check...</div>`
    simulateBruteforceCheckInOriginalTerminal()
    recognized = true
    return
  }
  // Bestehender Code: Falls der Nutzer "sudo start secret" eintippt (wird hier nicht geändert)
  else if (command === "sudo start secret") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening secret page in a new tab...</div>`
    setTimeout(() => {
      window.open("secret.html", "_blank")
      // Keine Weiterleitung der aktuellen Seite
    }, 500)
    recognized = true
    return
  }

  // Help-Befehl: Aktualisiert um die neuen Befehle "-t" und "list"
  else if (command === "help") {
    if (adminMode) {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- about : Show information about Iddox<br>
- projects : List projects<br>
- contact : Open contact page<br>
- secret : Tipp for my Secret<br>
- -t : Start new Terminal<br>
- list : Display hierarchy of Iddox<br>
- sudo su : Activate Admin Mode<br>
- sudo start latifi.exe : Start latifi.exe<br>
- sudo start secret : Open the (not real) Secret Webpage
- bruteforce -l -p : Run BruteForce check<br>
</div>`
    } else {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- about : Show information about Iddox<br>
- projects : List projects<br>
- contact : Open contact page<br>
- secret : Tipp for my Secret<br>
- list : Display hierarchy of Iddox<br>
- -t : Start new Terminal<br>
</div>`
    }
    recognized = true
    return
  }

  // Projektauswahl (1 oder 2)
  if (waitingForProjectSelection) {
    if (command === "1") {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening Ultimate Security-Bot project in a new tab...</div>`
      setTimeout(() => {
        window.open("https://github.com/IddoxLatifi/SecureBotV1", "_blank")
        // Keine Weiterleitung der aktuellen Seite
      }, 500)
      waitingForProjectSelection = false
      recognized = true
      return
    } else if (command === "2") {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening Status Rotator-Bot project in a new tab...</div>`
      setTimeout(() => {
        window.open("https://github.com/IddoxLatifi/Discord-Status-Rotator", "_blank")
        // Keine Weiterleitung der aktuellen Seite
      }, 500)
      waitingForProjectSelection = false
      recognized = true
      return
    } else {
      terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Invalid selection. Please type '1' or '2' to select a project.</div>`
      return
    }
  }

  if (!recognized) {
    terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">
Command not found: ${command}. Type 'help' for available commands.
</div>`
    return
  }

  terminalOutput.scrollTop = terminalOutput.scrollHeight
}

/* Eventlistener: Drücken der Enter-Taste verarbeitet den Befehl */
terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    const command = terminalInput.innerText.trim()
    processCommand(command)
    terminalInput.innerText = ""
  }
})

/* Button Eventlistener für die drei speziellen Buttons */
bruteBtn.addEventListener("click", (e) => {
  e.preventDefault() // Verhindert die Navigation der aktuellen Seite
  processCommand("bruteforce -l -p")
})

injectBtn.addEventListener("click", (e) => {
  e.preventDefault() // Verhindert die Navigation der aktuellen Seite
  processCommand("sudo start latifi.exe")
})

secretBtn.addEventListener("click", (e) => {
  e.preventDefault() // Verhindert die Navigation der aktuellen Seite
  window.open("secret.html", "_blank")
  // Keine Weiterleitung der aktuellen Seite
})

/* Simulation des BruteForce-Checks (ohne zusätzliche Fenster/Alerts) */
function simulateBruteforceCheckInOriginalTerminal() {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5
    if (progress > 100) progress = 100
    terminalOutput.innerHTML += `<div style="color:#00ff00;">BruteForce progress: ${progress}%</div>`
    terminalOutput.scrollTop = terminalOutput.scrollHeight
    if (progress === 100) {
      clearInterval(interval)
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">BruteForce check complete.</div>`
    }
  }, 300)
}

/* openNewTerminal: Erstellt ein neues Terminal-Element in der aktuellen Seite */
function openNewTerminal() {
  // Erstelle ein neues Terminal-Container-Element
  const newTerminal = document.createElement("div")
  newTerminal.className = "terminal new-terminal"
  newTerminal.innerHTML = `
    <div class="terminal-header">New Terminal: Iddox@system:~$ </div>
    <div class="terminal-input" contenteditable="true" spellcheck="false" autofocus></div>
    <div class="terminal-output" style="color: #00ff00; margin-top: 10px; min-height: 300px;"></div>
    <span class="cursor">_</span>
  `
  // Style als Overlay (kann nach Bedarf angepasst werden)
  newTerminal.style.position = "fixed"
  newTerminal.style.top = "50px"
  newTerminal.style.left = "50px"
  newTerminal.style.width = "80%"
  newTerminal.style.height = "auto" // Automatische Höhe basierend auf Inhalt
  newTerminal.style.minHeight = "300px" // Minimale Höhe
  newTerminal.style.maxHeight = "500px" // Maximale Höhe
  newTerminal.style.backgroundColor = "rgba(0,0,0,0.9)"
  newTerminal.style.border = "2px solid #ff0000"
  newTerminal.style.boxShadow = "0 0 10px #ff0000"
  newTerminal.style.zIndex = "1000"
  newTerminal.style.padding = "1.5rem"
  newTerminal.style.overflowY = "auto"

  document.body.appendChild(newTerminal)

  // Füge einen Event Listener für das Eingabefeld im neuen Terminal hinzu
  const newTerminalInput = newTerminal.querySelector(".terminal-input")
  const newTerminalOutput = newTerminal.querySelector(".terminal-output")

  // Mache das Eingabefeld fokussierbar und setze den Fokus
  newTerminalInput.focus()

  // Event Listener für Eingabe im neuen Terminal
  newTerminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const command = newTerminalInput.innerText.trim()
      // Ausgabe des Befehls im neuen Terminal
      newTerminalOutput.innerHTML += `<div>Iddox@system:~$ ${command}</div>`

      // Befehlsverarbeitung für das neue Terminal (alle normalen Befehle)
      let recognized = false

      if (command === "clear") {
        newTerminalOutput.innerHTML = ""
        recognized = true
      } else if (command === "exit") {
        document.body.removeChild(newTerminal)
        recognized = true
      } else if (command === "about") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening about page in a new tab...</div>`
        setTimeout(() => {
          window.open("about.html", "_blank")
          // Keine Weiterleitung der aktuellen Seite
        }, 500)
        recognized = true
      } else if (command === "projects") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Projects:<br>
1. Ultimate Security-Bot<br>
2. Status Rotator-Bot<br>
Please type '1' or '2' to select.
</div>`
        recognized = true
      } else if (command === "1") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening Ultimate Security-Bot project in a new tab...</div>`
        setTimeout(() => {
          window.open("https://github.com/IddoxLatifi/SecureBotV1", "_blank")
          // Keine Weiterleitung der aktuellen Seite
        }, 500)
        recognized = true
      } else if (command === "2") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening Status Rotator-Bot project in a new tab...</div>`
        setTimeout(() => {
          window.open("https://github.com/IddoxLatifi/Discord-Status-Rotator", "_blank")
          // Keine Weiterleitung der aktuellen Seite
        }, 500)
        recognized = true
      } else if (command === "contact") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening contact page in a new tab...</div>`
        setTimeout(() => {
          window.open("contact.html", "_blank")
          // Keine Weiterleitung der aktuellen Seite
        }, 500)
        recognized = true
      } else if (command === "help") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- about : Show information about Iddox<br>
- projects : List projects<br>
- contact : Open contact page<br>
- exit : Close this terminal<br>
- secret : Display hint<br>
- -t : Start Terminal module<br>
- list : Display virtual hierarchy of Iddox<br>
- bruteforce -l -p : Run BruteForce check
</div>`
        recognized = true
      } else if (command === "bruteforce -l -p") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Running BruteForce check...</div>`
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 5
          if (progress > 100) progress = 100
          newTerminalOutput.innerHTML += `<div style="color:#00ff00;">BruteForce progress: ${progress}%</div>`
          newTerminalOutput.scrollTop = newTerminalOutput.scrollHeight
          if (progress === 100) {
            clearInterval(interval)
            newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">BruteForce check complete.</div>`
          }
        }, 300)
        recognized = true
      }

      if (!recognized) {
        newTerminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">
Command not found: ${command}. Type 'help' for available commands.
</div>`
      }

      newTerminalInput.innerText = ""
      newTerminalOutput.scrollTop = newTerminalOutput.scrollHeight
    }
  })

  // Implementiere Drag-Funktionalität für das neue Terminal
  const terminalHeader = newTerminal.querySelector(".terminal-header")
  let isDragging = false
  let offsetX, offsetY

  terminalHeader.style.cursor = "move" // Zeige, dass der Header zum Verschieben ist

  terminalHeader.addEventListener("mousedown", (e) => {
    isDragging = true
    offsetX = e.clientX - newTerminal.getBoundingClientRect().left
    offsetY = e.clientY - newTerminal.getBoundingClientRect().top
  })

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      newTerminal.style.left = e.clientX - offsetX + "px"
      newTerminal.style.top = e.clientY - offsetY + "px"
    }
  })

  document.addEventListener("mouseup", () => {
    isDragging = false
  })
}

// Event Listener für den "About"-Button
document.addEventListener("DOMContentLoaded", () => {
  const aboutBtn = document.getElementById("about-btn")
  if (aboutBtn) {
    aboutBtn.addEventListener("click", (e) => {
      e.preventDefault() // Verhindert die Navigation der aktuellen Seite
      window.open("about.html", "_blank")
      return false // Verhindert weitere Aktionen
    })
  }
})

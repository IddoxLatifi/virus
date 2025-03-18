let adminMode = false
let waitingForProjectSelection = false
let waitingForLatifiSelection = false  // Neuer Status für latifi -s Auswahl
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
  
  // Falls wir gerade im latifi -s Auswahlmodus sind
  if (waitingForLatifiSelection) {
    switch (command) {
      case "1":
        terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">One of the most popular token grabbers is Red-Tiger. In addition to its virus builder, it has many other features and not only allows you to grab Discord tokens but also stores cookies and much more. Please note that this tool is for testing purposes only and should be used on one of your friends who approves it! <a href="https://github.com/loxy0dev/RedTiger-Tools" target="_blank">Red Tiger</a></div>`;
        break;
      case "2":
        terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">IP grabbers can log your IP address via web links, images, or executable files. An IP address can cause a lot of damage, so it's important to protect it. Well-known web grabbers include <a href="https://grabify.link/" target="_blank">Grabify</a> The "Virus Builder" from the RedTiger open source software also logs IP addresses. There's also a way to log your IP address via an image! Clicking on an image automatically executes redirecting web links! A simple example of a grabber that sends your HWID information and IP to a webhook link and takes a screenshot of your screens can be found on my Github profile. <a href="https://github.com/IddoxLatifi/simpledox" target="_blank">Click here</a></div>`;
        break;
      case "3":
        terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Simply put, spoofers automatically change your hardware information to a random one. This allows you to blur certain exclusions or footprints. Use <a href="https://github.com/SecHex/SecHex-Spoofy">SecHex Spoofy</a> on your own Risk!</div>`;
        break;
      case "4":
        terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Simply put, SQL injections are requests to the database, which ideally grants us admin rights and full access to a website's database. More information <a href="https://github.com/RohitY2J/RedTiger_SQL_Injection_Lab/blob/master/2%201%20Red%20Tiger%20Labs%2023543885813e45a99ee35509954b82cf.md" target="_blank">here</a>.</div>`;
        break;
      case "5":
        terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">One of the best-known and best AI modules on the market is definitely <a href="https://github.com/All-Hands-AI/OpenHands" target="_blank">OpenHands</a>. With their open source software, they've been enriching the lives of several programmers for more than a year! <a href="https://v0.dev/" target="_blank">V0</a> is a excellent AI to Create Websites inclusive Javascripts and css.`;
        break;
      default:
        terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Ungültige Auswahl. Bitte wähle eine Zahl zwischen 1 und 5.</div>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        // Fokus wieder auf das Eingabefeld setzen und Auswahlmodus beibehalten
        terminalInput.focus();
        return;
    }
    waitingForLatifiSelection = false;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.focus();
    return;
  }
  

  // Bestehende Admin-Passwortabfrage (für sudo su)
  if (awaitingPassword) {
    if (command === "yougotit") {
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
  } else if (command === "contact") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Opening contact page in a new tab...</div>`
    setTimeout(() => {
      window.open("contact.html", "_blank")
    }, 500)
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
  // Neuer Befehl: latifi -s (nur im Admin-Modus verfügbar)
  else if (command === "latifi -s") {
    if (!adminMode) {
      terminalOutput.innerHTML += `<div style="color:#ff0000; margin-top:10px;">Access denied. Admin mode required.</div>`
      recognized = true
      return
    }
    // ASCII Art in Rot (im <pre>-Block für Formatierung)
    terminalOutput.innerHTML += `<pre style="color:#ff0000; margin-top:10px;">
██       █████  ████████ ██ ███████ ██     ██ ███    ██      ██ ███████  ██████ ████████  ██████  ██████  
██      ██   ██    ██    ██ ██      ██     ██ ████   ██      ██ ██      ██         ██    ██    ██ ██   ██ 
██      ███████    ██    ██ █████   ██     ██ ██ ██  ██      ██ █████   ██         ██    ██    ██ ██████  
██      ██   ██    ██    ██ ██      ██     ██ ██  ██ ██ ██   ██ ██      ██         ██    ██    ██ ██   ██ 
███████ ██   ██    ██    ██ ██      ██     ██ ██   ████  █████  ███████  ██████    ██     ██████  ██   ██ 
                                                                                                         
</pre>`;
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">This modul was scripted by @apt_start_latifi</div>`;
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Wähle zwischen folgendem:<br>
1. Discord-Token-Grabber<br>
2. IP-Grabber<br>
3. Spoofer<br>
4. Brute-Force<br>
5. AI</div>`;
    waitingForLatifiSelection = true;
    recognized = true;
    return;
  }
  // Änderung: Neuer Terminal-Befehl "-t"
  else if (command === "-t") {
    terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Starting Terminal module...</div>`
    openNewTerminal()
    recognized = true
    return
  }
  // Help-Befehl
  else if (command === "help") {
    if (adminMode) {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- contact : Open contact page<br>
- sudo su : Activate Admin Mode<br>
- latifi -s : Start latifi module (Admin only)<br>
- -t : Start new Terminal<br>
</div>`
    } else {
      terminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- contact : Open contact page<br>
- -t : Start new Terminal<br>
</div>`
    }
    recognized = true
    return
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
  newTerminal.style.height = "auto"
  newTerminal.style.minHeight = "300px"
  newTerminal.style.maxHeight = "500px"
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

      // Befehlsverarbeitung für das neue Terminal (nur help, clear, exit und -t)
      let recognized = false

      if (command === "clear") {
        newTerminalOutput.innerHTML = ""
        recognized = true
      } else if (command === "exit") {
        document.body.removeChild(newTerminal)
        recognized = true
      } else if (command === "help") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">
Available commands:<br>
- help : Show available commands<br>
- clear : Clear terminal<br>
- exit : Close this terminal<br>
- -t : Start new Terminal <br>
</div>`
        recognized = true
      } else if (command === "-t") {
        newTerminalOutput.innerHTML += `<div style="color:#00ff00; margin-top:10px;">Starting new Terminal module...</div>`
        openNewTerminal()
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

  terminalHeader.style.cursor = "move"

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

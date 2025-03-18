document.addEventListener('DOMContentLoaded', function () {
  // Wir stellen sicher, dass kein weiteres Terminal erstellt wird
  const existingTerminal = document.querySelector('.terminal');
  if (existingTerminal) return; // Wenn bereits ein Terminal existiert, tun wir nichts

  // Terminal erstellen
  const terminal = document.createElement('div');
  terminal.classList.add('terminal');
  terminal.innerHTML = `
    <div class="terminal-header">Iddox@system:~$ </div>
    <div id="terminal-output" style="color: #00ff00; margin-top: 10px; min-height: 300px;"></div>
    <div class="terminal-footer">
      <input type="text" id="commandInput" placeholder="Enter command...">
      <button id="submitCommand">Submit</button>
    </div>
  `;
  document.body.appendChild(terminal); // Terminal zum Body hinzufügen

  const output = document.getElementById('terminal-output');
  const commandInput = document.getElementById('commandInput');
  const submitCommand = document.getElementById('submitCommand');

  submitCommand.addEventListener('click', () => {
    let command = commandInput.value.trim();

    // Wenn der Befehl "latifi -s -H" eingegeben wird, öffnen wir das Terminal
    if (command === 'latifi -s -H') {
      openNewTerminal(); // Aufruf der Funktion zum Öffnen eines neuen Terminals
    } else if (command === 'bruteforce -l -p') {
      simulateBruteforceCheck();
    }

    commandInput.value = ''; // Eingabefeld leeren
  });

  function openNewTerminal() {
    // Wenn wir das neue Terminal öffnen wollen
    const newTerminal = document.createElement('div');
    newTerminal.classList.add('terminal');
    newTerminal.innerHTML = `
      <div class="terminal-header">New Terminal: Iddox@system:~$ </div>
      <div id="new-terminal-output" style="color: #00ff00; margin-top: 10px; min-height: 300px;"></div>
      <div class="terminal-footer">
        <input type="text" id="new-commandInput" placeholder="Enter command...">
        <button id="new-submitCommand">Submit</button>
      </div>
    `;
    document.body.appendChild(newTerminal); // Neues Terminal zum Body hinzufügen

    // Ausgabe für das neue Terminal
    const newOutput = document.getElementById('new-terminal-output');
    newOutput.innerHTML += `<div style="color:#00ff00;">Opening new terminal...</div>`;
    
    // Wenn der Befehl "latifi -s -H" erneut ausgeführt wird
    document.getElementById('new-submitCommand').addEventListener('click', () => {
      let newCommand = document.getElementById('new-commandInput').value.trim();
      if (newCommand === 'latifi -s -H') {
        openNewTerminal(); // Neues Terminal öffnen
      }
      document.getElementById('new-commandInput').value = ''; // Eingabefeld leeren
    });
  }

  function simulateBruteforceCheck() {
    output.innerHTML += '\nChecking Ports...\n';
    setTimeout(() => {
      output.innerHTML += 'Port Check Successful\n';
      output.scrollTop = output.scrollHeight;

      setTimeout(() => {
        output.innerHTML += 'Checking foodsteps...\n';
        output.scrollTop = output.scrollHeight;

        setTimeout(() => {
          output.innerHTML += 'Successfull\n';
          output.scrollTop = output.scrollHeight;

          setTimeout(() => {
            output.innerHTML += 'Login...\n';
            output.scrollTop = output.scrollHeight;

            setTimeout(() => {
              output.innerHTML += 'Successfull\n';
              output.scrollTop = output.scrollHeight;

              // Schließt das Terminal nach der Simulation
              setTimeout(() => {
                terminal.style.display = 'none';
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  // Funktion für das Verschieben des Terminals
  let terminalHeader = document.querySelector('.terminal-header');
  let offsetX, offsetY;

  terminalHeader.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - terminal.offsetLeft;
    offsetY = e.clientY - terminal.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    terminal.style.left = `${e.clientX - offsetX}px`;
    terminal.style.top = `${e.clientY - offsetY}px`;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});

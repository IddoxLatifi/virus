// game.js
// 1. IP über ipify abrufen.
// 2. Mit dieser IP über die IP2Location-API weitere Infos holen.
// 3. Die Daten im Modal anzeigen (Country, Region, City, Koordinaten).

function openIPModal() {
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalLinks = document.getElementById("modalLinks");
  
    modalTitle.innerText = "IP Information";
    modalText.innerText = "Lade IP-Daten...";
    modalLinks.innerHTML = "";
    modalOverlay.style.display = "flex";
  
    // 1) IP-Adresse über ipify.org abrufen
    fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(ipData => {
        // 2) IP2Location-API aufrufen (API-Schlüssel erforderlich)
        const ip = ipData.ip;

  
        fetch(ip2locationUrl)
          .then(res => res.json())
          .then(locationData => {
            // 3) Daten im Modal anzeigen
            //    Die verfügbaren Felder können je nach API-Paket variieren
            //    Siehe Doku: https://www.ip2location.com/ip2location-web-service
            const country = locationData.country_name || "Unbekannt";
            const countryCode = locationData.country_code || "";
            const region = locationData.region_name || "Unbekannt";
            const city = locationData.city_name || "Unbekannt";
            const latitude = locationData.latitude || "n/a";
            const longitude = locationData.longitude || "n/a";
  
            // Ausgabe formatieren
            const output = `
              <strong>IP Address:</strong> ${ip}<br>
              <strong>Country:</strong> ${country} [${countryCode}]<br>
              <strong>Region:</strong> ${region}<br>
              <strong>City:</strong> ${city}<br>
              <strong>Coordinates:</strong> ${latitude}, ${longitude}
            `;
  
            modalText.innerHTML = output;
          })
          .catch(error => {
            console.error("Fehler bei IP2Location:", error);
            modalText.innerText = `IP Address: ${ip}\nFehler bei IP2Location.`;
          });
      })
      .catch(error => {
        console.error("Fehler beim Abrufen der IP-Adresse:", error);
        modalText.innerText = "Fehler beim Abrufen der IP-Adresse.";
      });
  }

  // Event-Listener für den Button mit data-link="location"
  document.querySelectorAll('.draggable-round-button[data-link="location"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      openIPModal();
    }, true);
  });
  
document.addEventListener("DOMContentLoaded", function() {
  // Hilfsfunktion: Erstelle ein Ausgabe-Item für Text
  function createOutputItem(title, content, filenamePrefix) {
    const container = document.createElement("div");
    container.className = "crypto-output-item";
    
    // Kopfzeile mit Titel und Zeitstempel
    const header = document.createElement("div");
    header.className = "crypto-output-header";
    const timeStamp = new Date().toLocaleString();
    header.innerText = `${title} – ${timeStamp}`;
    
    // Scrollbarer Bereich mit Inhalt
    const outputArea = document.createElement("textarea");
    outputArea.className = "crypto-output-text";
    outputArea.readOnly = true;
    outputArea.value = content;
    
    // Download-Button
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "crypto-download-btn";
    downloadBtn.innerText = "Download";
    downloadBtn.addEventListener("click", function() {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filenamePrefix}_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    
    container.appendChild(header);
    container.appendChild(outputArea);
    container.appendChild(downloadBtn);
    return container;
  }
  
  // Hilfsfunktion: Erstelle ein Ausgabe-Item für Bilder
  function createImageOutputItem(title, dataUrl, filenamePrefix) {
    const container = document.createElement("div");
    container.className = "crypto-output-item";
    
    // Kopfzeile mit Titel und Zeitstempel
    const header = document.createElement("div");
    header.className = "crypto-output-header";
    const timeStamp = new Date().toLocaleString();
    header.innerText = `${title} – ${timeStamp}`;
    
    // Bild-Element
    const img = document.createElement("img");
    img.src = dataUrl;
    img.style.maxWidth = "100%";
    
    // Download-Button für Bild
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "crypto-download-btn";
    downloadBtn.innerText = "Download";
    downloadBtn.addEventListener("click", function() {
      // Extrahiere Mime-Type aus dem DataURL, z.B. "data:image/png;base64,..."
      let mime = "image/png";
      const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z]+);/);
      if (mimeMatch && mimeMatch[1]) {
        mime = mimeMatch[1];
      }
      // Bestimme die Dateiendung anhand des Mime-Types
      let ext = "png";
      if(mime === "image/jpeg") ext = "jpg";
      else if(mime === "image/gif") ext = "gif";
      
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filenamePrefix}_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    
    container.appendChild(header);
    container.appendChild(img);
    container.appendChild(downloadBtn);
    return container;
  }
  
  // Code-Bereich
  const encryptCodeBtn = document.getElementById("encryptCodeBtn");
  const decryptCodeBtn = document.getElementById("decryptCodeBtn");
  const cryptoCodeInput = document.getElementById("cryptoCodeInput");
  const cryptoTitle = document.getElementById("cryptoTitle");
  const cryptoCodeKey = document.getElementById("cryptoCodeKey");
  const cryptoCodeOutputContainer = document.getElementById("cryptoCodeOutputContainer");

  encryptCodeBtn.addEventListener("click", function() {
    const code = cryptoCodeInput.value;
    const key = cryptoCodeKey.value;
    const title = cryptoTitle.value || "Kein Titel";
    if(code && key) {
      const encrypted = CryptoJS.AES.encrypt(code, key).toString();
      const outputItem = createOutputItem(title, encrypted, "code_enc");
      cryptoCodeOutputContainer.appendChild(outputItem);
    } else {
      alert("Bitte Code, Titel und Schlüssel eingeben.");
    }
  });

  decryptCodeBtn.addEventListener("click", function() {
    const code = cryptoCodeInput.value;
    const key = cryptoCodeKey.value;
    const title = cryptoTitle.value || "Kein Titel";
    if(code && key) {
      try {
        const bytes = CryptoJS.AES.decrypt(code, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const outputItem = createOutputItem(title, decrypted || "Entschlüsselung fehlgeschlagen.", "code_dec");
        cryptoCodeOutputContainer.appendChild(outputItem);
      } catch (e) {
        alert("Fehler bei der Entschlüsselung.");
      }
    } else {
      alert("Bitte Code, Titel und Schlüssel eingeben.");
    }
  });
  
  // Datei-Bereich (Textdateien / Verschlüsselte Bildtexte)
  const encryptFileBtn = document.getElementById("encryptFileBtn");
  const decryptFileBtn = document.getElementById("decryptFileBtn");
  const cryptoFileInput = document.getElementById("cryptoFileInput");
  const cryptoFileKey = document.getElementById("cryptoFileKey");
  const cryptoFileOutputContainer = document.getElementById("cryptoFileOutputContainer");

  function processFile(encrypt = true) {
    const file = cryptoFileInput.files[0];
    const key = cryptoFileKey.value;
    const title = file ? file.name : "Datei";
    if (!file) {
      alert("Bitte Datei auswählen.");
      return;
    }
    if (!key || key.trim() === "") {
      alert("Bitte Schlüssel eingeben.");
      return;
    }
    // Blob-Erstellung aus der angehängten Datei; falls file.type nicht gesetzt ist, default "text/plain"
    const blob = new Blob([file], { type: file.type || "text/plain" });
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      let processed;
      try {
        if (encrypt) {
          processed = CryptoJS.AES.encrypt(content, key).toString();
        } else {
          const bytes = CryptoJS.AES.decrypt(content, key);
          processed = bytes.toString(CryptoJS.enc.Utf8);
          if(!processed) { 
            processed = "Entschlüsselung fehlgeschlagen."; 
          }
        }
      } catch (err) {
        processed = "Fehler bei der Verarbeitung der Datei.";
      }
      if (!encrypt && processed.startsWith("data:image/")) {
        // Falls es sich um einen verschlüsselten Bildtext handelt, wird das Bild angezeigt.
        const outputItem = createImageOutputItem(title, processed, "img_dec");
        cryptoFileOutputContainer.appendChild(outputItem);
      } else {
        const outputItem = createOutputItem(title, processed, encrypt ? "file_enc" : "file_dec");
        cryptoFileOutputContainer.appendChild(outputItem);
      }
    };
    reader.readAsText(blob);
  }
  
  encryptFileBtn.addEventListener("click", function() { processFile(true); });
  decryptFileBtn.addEventListener("click", function() { processFile(false); });
  
  // Bild-Bereich (Bilder werden als DataURL verarbeitet)
  const encryptImageBtn = document.getElementById("encryptImageBtn");
  const decryptImageBtn = document.getElementById("decryptImageBtn");
  const cryptoImageInput = document.getElementById("cryptoImageInput");
  const cryptoImageKey = document.getElementById("cryptoImageKey");
  const cryptoImageOutputContainer = document.getElementById("cryptoImageOutputContainer");

  function processImage(encrypt = true) {
    const file = cryptoImageInput.files[0];
    const key = cryptoImageKey.value;
    const title = file ? file.name : "Bild";
    if (!file || !key) {
      alert("Bitte Datei auswählen und Schlüssel eingeben.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      let processed;
      try {
        if (encrypt) {
          processed = CryptoJS.AES.encrypt(content, key).toString();
        } else {
          const bytes = CryptoJS.AES.decrypt(content, key);
          processed = bytes.toString(CryptoJS.enc.Utf8);
          if (!processed) { 
            processed = "Entschlüsselung fehlgeschlagen."; 
          }
        }
      } catch (err) {
        processed = "Fehler bei der Verarbeitung des Bildes.";
      }
      if (!encrypt && processed.startsWith("data:image/")) {
        const outputItem = createImageOutputItem(title, processed, "img_dec");
        cryptoImageOutputContainer.appendChild(outputItem);
      } else {
        const outputItem = createOutputItem(title, processed, encrypt ? "img_enc" : "img_dec");
        cryptoImageOutputContainer.appendChild(outputItem);
      }
    };
    // Beim Verschlüsseln: Liegt ein echtes Bild vor, als DataURL lesen, ansonsten als Text.
    if (encrypt) {
        if (file.type.startsWith("image/")) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    } else {
        // Beim Decrypten erwarten wir, dass die verschlüsselte Datei als Text vorliegt.
        reader.readAsText(file);
    }
  }
  
  encryptImageBtn.addEventListener("click", function() { processImage(true); });
  decryptImageBtn.addEventListener("click", function() { processImage(false); });
});

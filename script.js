let round = 1;
let score1 = 0;
let score2 = 0;
let currentBet = 0;
let currentPlayer = "";
let allEvents = [];
let eventQueue = [];
const maxValue = 5000;
let currentPlayerTurn = "player1"; // Start bei Spieler 1
let lastCalledValue = 0;
let lastBetter = "player1";
let lastBetAmount = 0;
let player1Points = 0;
let player2Points = 0;

function submitBet() {
  if (lastCalledValue === 0) {
    return alert("Bitte einen Bet eintragen!");
  }

  // Spielbereich verstecken, Resolve-Bereich zeigen
  document.getElementById("bettingArea").classList.add("hidden");
  document.getElementById("resolveArea").classList.remove("hidden");

  // Text und Farbe anpassen
  const betInfo = document.getElementById("betInfo");
  betInfo.innerHTML = `<span style="color: ${lastBetter === "player1" ? "lightcoral" : "lightskyblue"};">${lastBetter === "player1" ? "Spieler 1" : "Spieler 2"}</span> hat ${lastBetAmount} Punkte gesetzt!<br>Hat der Spieler den Bet bekommen?`;

  // Buttons wieder aktivierbar machen
  document.getElementById("btn100").disabled = false;
  document.getElementById("btn500").disabled = false;
  document.getElementById("btn1000").disabled = false;

  // Werte zurücksetzen
  currentBet = 0;
  lastCalledValue = 0;
  document.getElementById("valueDisplay").textContent = currentBet;
}


function submitCall() {
  const betDisplay = document.getElementById("valueDisplay");
  lastCalledValue = currentBet;
  lastBetAmount = currentBet;

  if (currentPlayerTurn === "player1") {
    betDisplay.style.color = "lightcoral";
    lastBetter = "player1";
  } else {
    betDisplay.style.color = "lightskyblue";
    lastBetter = "player2";
  }

  changePlayer();
}

function resolveBet(success) {
  // Erfolg oder Misserfolg? Nur 1 Punkt verteilen, egal wie hoch der Bet war
  if (success) {
    // Erfolgreicher Bet - Nur 1 Punkt für den Spieler, der den Bet abgegeben hat
    if (lastBetter === "player1") {
      player1Points += 1;  // Nur 1 Punkt hinzufügen
      document.getElementById("score1").textContent = player1Points + " Punkte";
    } else {
      player2Points += 1;  // Nur 1 Punkt hinzufügen
      document.getElementById("score2").textContent = player2Points + " Punkte";
    }
  } else {
    // Misserfolgreicher Bet - Der andere Spieler bekommt den Punkt
    if (lastBetter === "player1") {
      player2Points += 1;  // Nur 1 Punkt für den anderen Spieler
      document.getElementById("score2").textContent = player2Points + " Punkte";
    } else {
      player1Points += 1;  // Nur 1 Punkt für den anderen Spieler
      document.getElementById("score1").textContent = player1Points + " Punkte";
    }
  }

  // --- Jetzt das GUI zurücksetzen ---

  // 1. "Bet Auflösung" (resolveArea) ausblenden
  document.getElementById("resolveArea").classList.add("hidden");

  // 2. Normale Mitte (bettingArea) wieder einblenden
  document.getElementById("bettingArea").classList.remove("hidden");

  // 3. Werte zurücksetzen (optional, falls du mit diesen Zahlen weiterarbeiten willst)
  document.getElementById("valueDisplay").textContent = "0";  // Setzt den Wert zurück
  lastBetAmount = 0;
  lastCalledValue = 0;
  currentBet = 0;

  // 4. Runde hochzählen
  let roundElem = document.getElementById("round");
  roundElem.textContent = parseInt(roundElem.textContent) + 1;

  // 5. Optional: BlindCountryContainer oder EventContainer aufräumen
  document.getElementById("blindCountryContainer").classList.add("hidden");
  document.getElementById("eventContainer").innerHTML = "";

  // 6. Zurücksetzen der Wett-Buttons (optional)
  document.getElementById("btn100").disabled = false;
  document.getElementById("btn500").disabled = false;
  document.getElementById("btn1000").disabled = false;
}



// Funktion, um eine neue Runde zu starten
function startNewRound() {
  // Runde erhöhen
  let roundElem = document.getElementById("round");
  roundElem.textContent = parseInt(roundElem.textContent) + 1;

  // Eventrolle neu starten, Werte resetten, etc. (Hier kannst du noch eigene Funktionen einfügen)
  document.getElementById("blindCountryContainer").classList.add("hidden");
  document.getElementById("eventContainer").innerHTML = "";  // Beispiel: Event-Inhalt zurücksetzen
}


function decreaseValue(amount) {
  const newBet = currentBet - amount;
  if (newBet >= lastCalledValue) {
    currentBet = newBet;
    document.getElementById("valueDisplay").textContent = currentBet;
  } else {
    // Optional: kleine Warnung oder einfach nichts tun
    console.log("Nicht möglich, unter den letzten Bet zu gehen!");
  }
}

function updatePlayerTurn() {
  const player1Card = document.getElementById("player1Card");
  const player2Card = document.getElementById("player2Card");

  // Erst alle Animationen entfernen
  player1Card.classList.remove("active-turn-player1", "active-turn-player2");
  player2Card.classList.remove("active-turn-player1", "active-turn-player2");

  // Jetzt neuen Spieler aktivieren
  if (currentPlayerTurn === "player1") {
    player1Card.classList.add("active-turn-player1");
  } else {
    player2Card.classList.add("active-turn-player2");
  }
}


function changePlayer() {
  // Wechsel zwischen den Spielern
  currentPlayerTurn = currentPlayerTurn === "player1" ? "player2" : "player1";

  // Optional: Anzeige, welcher Spieler dran ist
  const playerDisplay = document.getElementById("playerDisplay");
  //playerDisplay.textContent = currentPlayerTurn === "player1" ? "Spieler 1 ist dran" : "Spieler 2 ist dran";
  updatePlayerTurn();
}

function assignBet() {
  const selector = document.getElementById("playerSelector");
  currentPlayer = selector.value;
  document.getElementById("resolveSection").classList.remove("hidden");
}


function highlightCurrentPlayer() {
  const player1Card = document.getElementById("player1Card");
  const player2Card = document.getElementById("player2Card");

  // Erstmal beide Spieler zurücksetzen
  player1Card.classList.remove("active-turn");
  player2Card.classList.remove("active-turn");

  player1Card.style.setProperty("--glow-color", "transparent");
  player2Card.style.setProperty("--glow-color", "transparent");

  // Dann dem aktuellen Spieler die Animation geben
  if (currentPlayerTurn === "player1") {
    player1Card.classList.add("active-turn");
    player1Card.style.setProperty("--glow-color", "lightskyblue"); // Pastellblau
  } else {
    player2Card.classList.add("active-turn");
    player2Card.style.setProperty("--glow-color", "lightcoral"); // Pastellrot
  }
}


// Event JSON laden
fetch('events.json')
  .then(response => response.json())
  .then(data => {
    allEvents = shuffleArray(data);
  });

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function startEventRoll() {
  if (allEvents.length < 5) {
    alert("Nicht genug Events zum Rollen!");
    return;
  }

  // Kopiere und shuffle Events
  eventQueue = [...shuffleArray(allEvents)];

  let displayCount = 0;
  const rollInterval = setInterval(() => {
    if (eventQueue.length < 5) {
      // Reshuffle bei Bedarf
      eventQueue = eventQueue.concat(shuffleArray(allEvents));
    }

    // 1. Lösche die vorherigen Events im Event Container
    const container = document.getElementById("eventContainer");
    container.innerHTML = ""; // Hier wird der alte Inhalt entfernt

    // 2. Hol die 5 neuen Events für die Anzeige
    const currentDisplay = eventQueue.slice(0, 5);
    renderEventDisplay(currentDisplay);
    eventQueue.push(eventQueue.shift()); // Drehe die Queue

    displayCount++;
    if (displayCount > 20) {
      clearInterval(rollInterval);
      const selectedEvent = currentDisplay[2];
      //const selectedEvent = "Blind Bet";
      console.log("Gewähltes Event:", selectedEvent);

      if (selectedEvent === "Blind Bet") {
        handleBlindBetSlot();
      } else {
        document.getElementById("blindCountryContainer").classList.add("hidden");
        document.getElementById("blindCountryContainer").innerHTML = `
              <div style="font-weight: bold; margin-bottom: 0.5rem;">🌍 Blind Bet: Land wird gewählt...</div>
              <div id="countrySlot" style="display: flex; gap: 10px; justify-content: center;"></div>
            `;
      }

    }

  }, 200);
}

function renderEventDisplay(events) {
  const container = document.getElementById("eventContainer");
  container.innerHTML = "";

  events.forEach((eventText, index) => {
    const div = document.createElement("div");
    div.classList.add("event", "card");
    if (index === 2) div.classList.add("center"); // mittleres Event
    div.textContent = eventText;
    container.appendChild(div);
  });
}

// Zufälliges Land anzeigen bei Blind Bet
function handleBlindBetSlot() {
  fetch('countries.json')
    .then(res => res.json())
    .then(countryData => {
      if (countryData.length < 5) {
        alert("Nicht genug Länder für Blind Bet!");
        return;
      }

      const shuffledCountries = shuffleArray(countryData);
      let queue = [...shuffledCountries];
      let count = 0;

      document.getElementById("blindCountryContainer").classList.remove("hidden");

      const interval = setInterval(() => {
        if (queue.length < 5) {
          queue = queue.concat(shuffleArray(countryData));
        }

        const visible = queue.slice(0, 5);
        renderCountryDisplay(visible);
        queue.push(queue.shift()); // rotate

        count++;
        if (count > 20) {
          clearInterval(interval);

          const previousResult = document.querySelector("#blindCountryContainer .result");
          if (previousResult) {
            previousResult.remove(); // Entfernt das vorherige Land
          }

          const selectedCountry = visible[2];
          console.log("🎯 Ausgewähltes Land:", selectedCountry);

          const result = document.createElement("div");
          result.style.marginTop = "1rem";
          result.style.fontWeight = "bold";
          result.style.color = "#007700";
          result.style.fontSize = "1.1em";
          result.classList.add("result"); // Klasse hinzufügen, damit es leichter entfernt werden kann
          result.textContent = `🌐 Ausgewähltes Land: ${selectedCountry}`;
          document.getElementById("blindCountryContainer").appendChild(result);
        }
      }, 200);
    })
    .catch(err => console.error("Fehler beim Laden der Länder:", err));
}

function renderCountryDisplay(countries) {
  const container = document.getElementById("countrySlot");
  container.innerHTML = "";

  countries.forEach((name, index) => {
    const div = document.createElement("div");
    div.classList.add("event", "card");
    if (index === 2) div.classList.add("center");
    div.textContent = name;
    container.appendChild(div);
  });
}

function increaseValue(amount) {
  if (currentBet + amount <= maxValue) {
    currentBet += amount;
    document.getElementById("valueDisplay").textContent = currentBet;
  }

  // Prüfen und ggf. Buttons deaktivieren
  if (currentBet >= maxValue) {
    disableButtons();
  }
}



function disableButtons() {
  document.getElementById("btn100").disabled = true;
  document.getElementById("btn500").disabled = true;
  document.getElementById("btn1000").disabled = true;
}
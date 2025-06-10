let round = 1;
let score1 = 0;
let score2 = 0;
let currentBet = 0;
let currentPlayer = "";
let allEvents = [];
let eventQueue = [];
let countries = [];
const maxValue = 5000;
let currentPlayerTurn = "player1"; // Start bei Spieler 1
let lastCalledValue = 0;
let lastBetter = "player1";
let lastBetAmount = 0;
let player1name = document.getElementById("playername1").textContent;
let player2name = document.getElementById("playername2").textContent;
let blindstart = 8;

function submitBet() {
  if (lastCalledValue === 0) {
    return alert("Bitte einen Bet eintragen!");
  }

  // Spielbereich verstecken, Resolve-Bereich zeigen
  document.getElementById("bettingArea").classList.add("hidden");
  document.getElementById("resolveArea").classList.remove("hidden");
  document.getElementById("resolveArea").classList.add("eventcard");
  document.getElementById("resolveArea").classList.add("resolve-area");
  document.getElementById("roundtitle").classList.add("hidden");

  // Text und Farbe anpassen
  const betInfo = document.getElementById("betInfo");
  betInfo.innerHTML = `<span style="color: ${lastBetter === "player1" ? "lightskyblue" : "lightcoral"};">${lastBetter === "player1" ? player1name : player2name}</span> hat ${lastBetAmount} Punkte gesetzt!<br>Hat er genug bekommen?`;

  // Buttons wieder aktivierbar machen
  document.getElementById("btn100").disabled = false;
  document.getElementById("btn500").disabled = false;
  document.getElementById("btn1000").disabled = false;

  // Werte zurücksetzen
  currentBet = 0;
  lastCalledValue = 0;
  document.getElementById("valueDisplay").textContent = currentBet;
  changePlayer();
}


function submitCall() {
  const betDisplay = document.getElementById("valueDisplay");

  if (currentBet <= lastCalledValue) {
    alert("Dein Einsatz muss höher sein als der vorherige!");
    return; // Abbrechen, nichts weiter tun
  }

  lastCalledValue = currentBet;
  lastBetAmount = currentBet;

  if (currentPlayerTurn === "player1") {
    betDisplay.style.color = "lightskyblue";
    lastBetter = "player1";
  } else {
    betDisplay.style.color = "lightcoral";
    lastBetter = "player2";
  }

  changePlayer();
}


function resolveBet(success) {
  // Erfolg oder Misserfolg? Nur 1 Punkt verteilen, egal wie hoch der Bet war
  if (success) {
    // Erfolgreicher Bet - Nur 1 Punkt für den Spieler, der den Bet abgegeben hat
    if (lastBetter === "player1") {
      score1 += 1;  // Nur 1 Punkt hinzufügen
      document.getElementById("score1").textContent = score1 + " Punkte";
    } else {
      score2 += 1;  // Nur 1 Punkt hinzufügen
      document.getElementById("score2").textContent = score2 + " Punkte";
    }
  } else {
    // Misserfolgreicher Bet - Der andere Spieler bekommt den Punkt
    if (lastBetter === "player1") {
      score2 += 1;  // Nur 1 Punkt für den anderen Spieler
      document.getElementById("score2").textContent = score2 + " Punkte";
    } else {
      score1 += 1;  // Nur 1 Punkt für den anderen Spieler
      document.getElementById("score1").textContent = score1 + " Punkte";
    }
  }

  // --- Jetzt das GUI zurücksetzen ---

  // 1. "Bet Auflösung" (resolveArea) ausblenden
  document.getElementById("resolveArea").classList.add("hidden");

  // 2. Normale Mitte (bettingArea) wieder einblenden
  document.getElementById("bettingArea").classList.remove("hidden");
  document.getElementById("roundtitle").classList.remove("hidden");

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
  if (newBet > lastCalledValue) {
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
    player1Card.style.setProperty("--glow-color", "lightcoral"); // Pastellblau
  } else {
    player2Card.classList.add("active-turn");
    player2Card.style.setProperty("--glow-color", "lightskyblue"); // Pastellrot
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

function loadCountries() {
  fetch('countries.json')
    .then(response => response.json())  // Wir parsen die JSON-Antwort
    .then(data => {
      countries = data;  // Speichern der Länder in einer Variablen
    })
    .catch(error => {
      console.error('Fehler beim Laden der Länder:', error);
    });
}

// Aufruf der Funktion zum Laden der Länder, wenn die Seite geladen wird
loadCountries();

// Die startEventRoll Funktion
function startEventRoll() {
  if (allEvents.length < 5 && countries.length < 1) {
    alert("Nicht genug Events oder Länder zum Rollen!");
    return;
  }

  // Ab Runde 8 sollen wir Länder anstatt Events rollt
  const roundElem = document.getElementById("round");
  const currentRound = parseInt(roundElem.textContent);

  // Wählen wir aus, ob wir Events oder Länder verwenden
  let itemsToDisplay = [];

  if (currentRound >= blindstart) {
    // Ab Runde 8 Blind Bet, daher landen wir auf Ländern
    document.getElementById("roundTitle").textContent = "BLIND BET COUNTRY"; // Ändere den Titel
    itemsToDisplay = shuffleArray(countries).slice(0, 5); // Mische die Länder und nimm die ersten 5
  } else {
    // Sonst, normale Events anzeigen
    itemsToDisplay = shuffleArray(allEvents).slice(0, 5); // Mische die Events und nimm die ersten 5
  }

  eventQueue = [...itemsToDisplay];  // Setze die Queue mit den passenden Items

  let displayCount = 0;
  const rollInterval = setInterval(() => {
    if (eventQueue.length < 5) {
      // Reshuffle bei Bedarf
      eventQueue = eventQueue.concat(itemsToDisplay);
    }

    const container = document.getElementById("eventContainer");
    container.innerHTML = "";

    const currentDisplay = eventQueue.slice(0, 5);

    currentDisplay.forEach((event, index) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("card");
      eventElement.textContent = event;

      if (index === 2) {
        eventElement.classList.add("center"); // Markiert die mittlere Karte
      }

      container.appendChild(eventElement);
    });

    eventQueue.push(eventQueue.shift()); // Dreht die Queue für die nächste Iteration

    displayCount++;
    if (displayCount > 20) {
      clearInterval(rollInterval);

      const selectedEvent = currentDisplay[2];
      console.log("Gewähltes Event:", selectedEvent);

      if (currentRound >= blindstart) {
        // Wenn es ein Blind Bet ist, zeige das Land an
        handleBlindBetSlot(selectedEvent);
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

  // Lösche alle alten Karten
  container.innerHTML = "";

  // Durchlaufe alle Events und rendere sie als Karte
  events.forEach((event, index) => {
    const card = document.createElement("div");
    card.classList.add("card"); // Alle Karten bekommen die Grundklasse "card"
    card.textContent = event;

    // Das mittlere Event wird mit der Klasse "center" markiert
    if (index === 2) { // Das mittlere Event (Index 2)
      card.classList.add("selected", "center"); // Markiert es als ausgewählt und zentriert
    }

    container.appendChild(card);
  });
}

// Zufälliges Land anzeigen bei Blind Bet
function handleBlindBetSlot(country) {
  // Hier kannst du dein Blind Bet mit dem Land (country) behandeln
  console.log("Blind Bet Country ausgewählt:", country);

  // Beispiel: Land im Container anzeigen
  const countrySlot = document.getElementById("countrySlot");
  countrySlot.textContent = country;

  // Optional kannst du den bet-container hier verstecken und was anderes anzeigen.
  document.getElementById("blindCountryContainer").classList.remove("hidden");
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
  const betDisplay = document.getElementById("valueDisplay");
  betDisplay.style.color = "white";
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

function selectStartingPlayer() {
  // Zufällig einen Startspieler auswählen
  const startingPlayer = Math.random() < 0.5 ? "player1" : "player2";

  // Entferne alle bisherigen Glow-Effekte
  document.getElementById("player1Card").classList.remove("active-turn-player1", "active-turn-player2");
  document.getElementById("player2Card").classList.remove("active-turn-player1", "active-turn-player2");

  // Setze den Glow nur für den zufällig ausgewählten Startspieler
  if (startingPlayer === "player1") {
    document.getElementById("player1Card").classList.add("active-turn-player1");
    document.documentElement.style.setProperty('--glow-color', 'lightskyblue');
  } else {
    document.getElementById("player2Card").classList.add("active-turn-player2");
    document.documentElement.style.setProperty('--glow-color', 'lightcoral');
  }

  // Setze den aktuellen Spieler für den Spielablauf
  currentPlayerTurn = startingPlayer;
}

// Automatisches Ausführen beim Laden der Seite
window.onload = function () {
  selectStartingPlayer(); // Startspieler auswählen, wenn die Seite geladen ist
};

function adjustScore(player, value) {
  if (player === "player1") {
    score1 += value;
    if (score1 < 0) score1 = 0; // Keine negativen Punkte
    document.getElementById("score1").textContent = score1 + " Punkte";
  } else if (player === "player2") {
    score2 += value;
    if (score2 < 0) score2 = 0;
    document.getElementById("score2").textContent = score2 + " Punkte";
  }

  // Runden nach der Punkteanpassung erhöhen
  adjustRounds();
}

function adjustRounds() {
  const totalScore = score1 + score2;
  document.getElementById("round").textContent = totalScore + 1; // Anzeige aktualisieren
  if ((totalScore + 1) < blindstart) {
    document.getElementById("roundTitle").textContent = "EVENT DIESER RUNDE";
  } else {
    document.getElementById("roundTitle").textContent = "BLIND BET COUNTRY";
  }
}

// Einstellungen-Button und Gegner-Auswahl
document.querySelector('.setting-btn').addEventListener('click', () => {
  document.body.classList.add('settings-active');
});

document.getElementById('opponentSelect').addEventListener('change', (event) => {
  const selectedOpponent = event.target.value;
  const opponentImage = document.querySelector('#player2Card img[alt="Spieler 2"]');
  const opponentName = document.getElementById('playername2');

  if (selectedOpponent === 'lennli') {
    opponentImage.src = 'sources/lennli_idle.gif';
    opponentName.textContent = 'Lennli';
  } else if (selectedOpponent === 'kodiak') {
    opponentImage.src = 'sources/kodiak_idle.gif';
    opponentName.textContent = 'Kodiak';
  } else {
    opponentImage.src = 'sources/yanek_idle.gif';
    opponentName.textContent = 'Yanek';
  }
});

document.getElementById('settingsModal').addEventListener('click', (event) => {
  if (event.target.id === 'settingsModal') {
    document.body.classList.remove('settings-active');
  }
});

document.getElementById('exitSettings').addEventListener('click', () => {
  document.body.classList.remove('settings-active');
});
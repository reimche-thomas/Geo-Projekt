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

function submitBet() {
  if (currentBet === 0) {
    return alert("Bitte einen Bet eintragen!");
  }

  document.getElementById("currentBet").textContent = currentBet + " Münzen";
  document.getElementById("betDisplay").classList.remove("hidden");

  currentBet = 0;
  document.getElementById("valueDisplay").textContent = currentBet;

  // Buttons wieder aktivieren
  document.getElementById("btn100").disabled = false;
  document.getElementById("btn500").disabled = false;
  document.getElementById("btn1000").disabled = false;
}

function submitCall() {
  // Wechsel der Spielerfarbe und Spielerstatus
  const betDisplay = document.getElementById("valueDisplay");
  lastCalledValue = currentBet;

  // Farbe des Bets je nach Spieler ändern
  if (currentPlayerTurn === "player1") {
    betDisplay.style.color = "lightcoral"; // Pastellrot für Spieler 1
  } else {
    betDisplay.style.color = "lightskyblue"; // Pastellblau für Spieler 2
  }

  // Spieler wechseln
  changePlayer();
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


function changePlayer() {
  // Wechsel zwischen den Spielern
  currentPlayerTurn = currentPlayerTurn === "player1" ? "player2" : "player1";

  // Optional: Anzeige, welcher Spieler dran ist
  const playerDisplay = document.getElementById("playerDisplay");
  playerDisplay.textContent = currentPlayerTurn === "player1" ? "Spieler 1 ist dran" : "Spieler 2 ist dran";
}

function assignBet() {
  const selector = document.getElementById("playerSelector");
  currentPlayer = selector.value;
  document.getElementById("resolveSection").classList.remove("hidden");
}

function resolveBet(success) {
  if (success) {
    if (currentPlayer === "player1") {
      score1++;
      document.getElementById("score1").textContent = score1;
    } else {
      score2++;
      document.getElementById("score2").textContent = score2;
    }
  } else {
    // Gegner bekommt den Punkt
    if (currentPlayer === "player1") {
      score2++;
      document.getElementById("score2").textContent = score2;
    } else {
      score1++;
      document.getElementById("score1").textContent = score1;
    }
  }

  round++;
  document.getElementById("round").textContent = round;
  document.getElementById("betDisplay").classList.add("hidden");
  document.getElementById("resolveSection").classList.add("hidden");
  currentBet = "";
  currentPlayer = "";
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
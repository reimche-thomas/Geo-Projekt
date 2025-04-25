let round = 1;
let score1 = 0;
let score2 = 0;
let currentBet = "";
let currentPlayer = "";
let allEvents = [];
let eventQueue = [];


function submitBet() {
  const betInput = document.getElementById("betInput");
  currentBet = betInput.value.trim();
  if (!currentBet) return alert("Bitte einen Bet eintragen!");
  document.getElementById("currentBet").textContent = currentBet;
  document.getElementById("betDisplay").classList.remove("hidden");
  betInput.value = "";
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
  
      // Hol 5 Events für Anzeige
      const currentDisplay = eventQueue.slice(0, 5);
      renderEventDisplay(currentDisplay);
      eventQueue.push(eventQueue.shift()); // Drehe die Queue
  
      displayCount++;
      if (displayCount > 20) {
        clearInterval(rollInterval);
        //const selectedEvent = currentDisplay[2];
        const selectedEvent = "Blind Bet";
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
      div.classList.add("event");
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
            const selectedCountry = visible[2];
            console.log("🎯 Ausgewähltes Land:", selectedCountry);
  
            const result = document.createElement("div");
            result.style.marginTop = "1rem";
            result.style.fontWeight = "bold";
            result.style.color = "#007700";
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
      div.classList.add("event");
      if (index === 2) div.classList.add("center");
      div.textContent = name;
      container.appendChild(div);
    });
  }
  
  
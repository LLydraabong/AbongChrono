// ----- City Data -----
const cities = [
  { city: "UTC", tz: "UTC" },
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Nairobi", tz: "Africa/Nairobi" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Sydney", tz: "Australia/Sydney" },
  // ... (you can expand this list to over 1500 cities later)
];

// ----- Render Clock Cards -----
function renderClocks(list = cities) {
  const grid = document.getElementById("clock-grid");
  grid.innerHTML = "";
  list.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "clock-card";
    div.setAttribute("data-city", item.city.toLowerCase());
    div.innerHTML = `
      <div class="clock-city">${item.city}</div>
      <div class="clock-time" id="clock-${index}">--:--:--</div>
      <div class="clock-zone">${item.tz}</div>
    `;
    grid.appendChild(div);
  });
}

// ----- Update Clock Times -----
function updateClocks() {
  const now = new Date();
  cities.forEach((item, index) => {
    let timeStr = "N/A";
    try {
      const localTime = new Date(
        now.toLocaleString("en-US", { timeZone: item.tz })
      );
      timeStr = localTime.toTimeString().split(" ")[0];
    } catch (e) {
      console.error(`Timezone error: ${item.tz}`);
    }
    const clockElem = document.getElementById(`clock-${index}`);
    if (clockElem) clockElem.textContent = timeStr;
  });
}
setInterval(updateClocks, 1000);

// ----- Search Filter -----
function filterClocks() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const filtered = cities.filter((c) => c.city.toLowerCase().includes(search));
  renderClocks(filtered);
  updateClocks();
}

// ----- Initialize -----
window.addEventListener("DOMContentLoaded", () => {
  renderClocks();
  updateClocks();
});
// ----- Toggle Dark/Light Theme -----
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("light-theme");
  if (isDark) {
    body.style.background = "#f0f0f0";
    body.style.color = "#111";
  } else {
    body.style.background = "var(--main-bg)";
    body.style.color = "#f3f8fa";
  }
}

// ----- Toggle Map Panel (for future AI/3D feature) -----
function toggleMap() {
  alert("Map View coming soon! This will show a 3D or interactive world map with cities.");
}

// ----- Toggle City Details -----
function toggleDetails() {
  alert("City photo/details panel will appear here in the next update.");
  }
// ----- Map Toggle -----
function toggleMap() {
  const mapWrapper = document.getElementById("map-wrapper");
  const isVisible = mapWrapper.style.display === "block";
  mapWrapper.style.display = isVisible ? "none" : "block";
  if (!isVisible && !window.mapLoaded) {
    initMap(); // Load map only once
    window.mapLoaded = true;
  }
}

// ----- Map Init (Basic Markers for Now) -----
function initMap() {
  const map = L.map("map").setView([20, 0], 2); // World center
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Optional sample markers — you can add hundreds here
  const sampleCities = [
    { city: "New York", lat: 40.7128, lon: -74.006 },
    { city: "London", lat: 51.5072, lon: -0.1276 },
    { city: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { city: "Nairobi", lat: -1.2921, lon: 36.8219 },
    { city: "Sydney", lat: -33.8688, lon: 151.2093 },
  ];

  sampleCities.forEach((c) => {
    L.marker([c.lat, c.lon])
      .addTo(map)
      .bindPopup(`<b>${c.city}</b>`);
  });
}
function toggleTheme() {
  document.documentElement.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("light-theme")
      ? "light"
      : "dark"
  );
}

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  }
});
// Fade-in animation
window.addEventListener("scroll", () => {
  document.querySelectorAll(".section-fade").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("visible");
    }
  });
});
// Handle city card click
document.addEventListener("click", (e) => {
  const card = e.target.closest(".clock-card");
  if (!card) return;

  const cityName = card.querySelector(".city-title").textContent;
  const tzLabel = card.querySelector(".tz-label").textContent;

  document.getElementById("city-name").textContent = cityName;
  document.getElementById("city-timezone").textContent = `Timezone: ${tzLabel}`;
  document.getElementById("city-ai-info").innerHTML = `
    <p>🌐 ${cityName} is one of the world's beautiful cities.</p>
    <p>✨ Weather, culture, economy, and AI facts coming soon!</p>
  `;
  document.getElementById("city-info-panel").classList.add("open");
});

function closeCityInfo() {
  document.getElementById("city-info-panel").classList.remove("open");
      }
// Handle city card click with real AI-powered fetch
document.addEventListener("click", (e) => {
  const card = e.target.closest(".clock-card");
  if (!card) return;

  const cityName = card.querySelector(".city-title").textContent;
  const tzLabel = card.querySelector(".tz-label").textContent;

  document.getElementById("city-name").textContent = cityName;
  document.getElementById("city-timezone").textContent = `Timezone: ${tzLabel}`;
  document.getElementById("city-ai-info").innerHTML = `<p>Loading AI info...</p>`;

  document.getElementById("city-info-panel").classList.add("open");

  fetchCityInfo(cityName);
});

// Fetch city info from Wikipedia and Unsplash
function fetchCityInfo(city) {
  const infoEl = document.getElementById("city-ai-info");
  infoEl.innerHTML = "";

  // Wikipedia API (no API key needed)
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.extract) {
        const extract = document.createElement("p");
        extract.textContent = data.extract;
        infoEl.appendChild(extract);
      } else {
        infoEl.innerHTML += `<p>No Wikipedia info found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Wikipedia data error.</p>`;
    });

  // Unsplash API – requires a free API key
  const accessKey = "YOUR_UNSPLASH_ACCESS_KEY"; // ⚠️ Replace this
  fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${accessKey}&per_page=1`)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const img = document.createElement("img");
        img.src = data.results[0].urls.small;
        img.alt = city;
        img.style = "width:100%;margin-top:1em;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.15)";
        infoEl.appendChild(img);
      } else {
        infoEl.innerHTML += `<p>No images found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Image fetch failed.</p>`;
    });
  }
function fetchWeather(city) {
  const infoEl = document.getElementById("city-ai-info");

  const weatherKey = "YOUR_OPENWEATHERMAP_KEY"; // 🔑 Replace this!
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.main && data.weather) {
        const weatherBox = document.createElement("div");
        weatherBox.style.marginTop = "1em";
        weatherBox.innerHTML = `
          <h3 style="color: var(--accent); font-size: 1.05em; margin-bottom: 0.4em;">Current Weather</h3>
          <p>🌡️ Temp: ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
          <p>🌥️ Condition: ${data.weather[0].description}</p>
        `;
        infoEl.appendChild(weatherBox);
      } else {
        infoEl.innerHTML += `<p>No weather info found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Weather data error.</p>`;
    });
}
const accessKey = "PASTE_YOUR_KEY_HERE";
fetchWeather(city);
function fetchCityInfo(city) {
  const infoEl = document.getElementById("city-ai-info");
  infoEl.innerHTML = "";

  // Wikipedia API
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.extract) {
        const extract = document.createElement("p");
        extract.textContent = data.extract;
        infoEl.appendChild(extract);
      } else {
        infoEl.innerHTML += `<p>No Wikipedia info found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Wikipedia data error.</p>`;
    });

  // Unsplash API
  const accessKey = "YOUR_UNSPLASH_ACCESS_KEY";
  fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${accessKey}&per_page=1`)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const img = document.createElement("img");
        img.src = data.results[0].urls.small;
        img.alt = city;
        img.style = "width:100%;margin-top:1em;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.15)";
        infoEl.appendChild(img);
      } else {
        infoEl.innerHTML += `<p>No images found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Image fetch failed.</p>`;
    });

  // Weather
  fetchWeather(city);
          }
function fetchCityInfo(city) {
  const infoEl = document.getElementById("city-ai-info");
  infoEl.innerHTML = "";

  // Wikipedia API
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.extract) {
        const extract = document.createElement("p");
        extract.textContent = data.extract;
        infoEl.appendChild(extract);
      } else {
        infoEl.innerHTML += `<p>No Wikipedia info found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Wikipedia data error.</p>`;
    });

  // Unsplash API
  const accessKey = "YOUR_UNSPLASH_ACCESS_KEY";
  fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${accessKey}&per_page=1`)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const img = document.createElement("img");
        img.src = data.results[0].urls.small;
        img.alt = city;
        img.style = "width:100%;margin-top:1em;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.15)";
        infoEl.appendChild(img);
      } else {
        infoEl.innerHTML += `<p>No images found.</p>`;
      }
    })
    .catch(() => {
      infoEl.innerHTML += `<p>⚠️ Image fetch failed.</p>`;
    });

  // Weather
  fetchWeather(city);
           }
// Sidebar toggle
function openSidebar(city) {
  document.getElementById("sidebar-title").textContent = city;
  document.getElementById("city-sidebar").classList.add("active");
  fetchSidebarContent(city);
}
document.getElementById("close-sidebar").onclick = () => {
  document.getElementById("city-sidebar").classList.remove("active");
};

// Tab switching
function showTab(tab) {
  document.querySelectorAll(".tab-section").forEach(sec => sec.style.display = "none");
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`tab-${tab}`).style.display = "block";
  event.target.classList.add("active");
          }
const weatherKey = "YOUR_OPENWEATHERMAP_KEY";
card.onclick = () => {
  openSidebar(entry.city);
};
function fetchSidebarContent(city) {
  // Clear tabs
  document.getElementById("tab-info").innerHTML = "Loading city info...";
  document.getElementById("tab-weather").innerHTML = "Loading weather...";
  document.getElementById("tab-map").innerHTML = `<iframe
    width="100%" height="200" frameborder="0"
    src="https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(city)}"
    style="border:1px solid var(--accent2); border-radius:8px;">
  </iframe>`;

  // Info
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("tab-info").innerHTML = data.extract || "No info found.";
    });

  // Weather (reuse OpenWeatherMap)
  const key = "YOUR_OPENWEATHERMAP_KEY";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("tab-weather").innerHTML = `
        <p><strong>🌡️ Temp:</strong> ${data.main.temp}°C (feels like ${data.main.feels_like}°C)</p>
        <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>🌥️ Condition:</strong> ${data.weather[0].description}</p>
      `;
    })
    .catch(() => {
      document.getElementById("tab-weather").innerHTML = "Weather data not found.";
    });
                            }
card.innerHTML = `
  <div class="city-title">${entry.city}</div>
  <div class="tz-label">${cityShort.replace(/_/g,' ')} (${entry.tz})</div>
  <div class="clock" id="clock-${idx}">--:--:--</div>
  <button class="fav-btn" onclick="toggleFavorite('${entry.city}', event)">⭐</button>
`;
function toggleFavorite(city, event) {
  event.stopPropagation(); // don’t open sidebar

  let favs = JSON.parse(localStorage.getItem("favCities") || "[]");
  if (favs.includes(city)) {
    favs = favs.filter(c => c !== city);
    event.target.classList.remove("saved");
    event.target.textContent = "⭐";
  } else {
    favs.push(city);
    event.target.classList.add("saved");
    event.target.textContent = "★";
  }
  localStorage.setItem("favCities", JSON.stringify(favs));
  }
// Check if this city is already saved
let favCities = JSON.parse(localStorage.getItem("favCities") || "[]");
const btn = card.querySelector('.fav-btn');
if (favCities.includes(entry.city)) {
  btn.classList.add("saved");
  btn.textContent = "★";
      }
// Show a list of favorite cities in Info tab
let favs = JSON.parse(localStorage.getItem("favCities") || "[]");
if (favs.length > 0) {
  const favList = favs.map(c => `<li onclick="openSidebar('${c}')">${c}</li>`).join('');
  document.getElementById("tab-info").innerHTML += `
    <hr>
    <strong>⭐ Favorite Cities:</strong>
    <ul style="padding-left: 1em; margin-top: 0.4em;">${favList}</ul>
  `;
}
async function fetchCityImage(city) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (err) {
    console.error("Image fetch error:", err);
  }
  return null; // fallback
    }
const UNSPLASH_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; // Replace this!
document.getElementById("tab-photos").innerHTML = `<div class="loading-img">📷 Loading image of ${city}...</div>`;
fetchCityImage(city).then(url => {
  if (url) {
    document.getElementById("tab-photos").innerHTML = `
      <img src="${url}" alt="${city}" style="width:100%;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.2);">
    `;
  } else {
    document.getElementById("tab-photos").innerHTML = `<em>No photo found.</em>`;
  }
});
document.getElementById("tab-photos").innerHTML = `📷 Loading image of ${city}...`;
// Find timezone for selected city
const match = cities.find(c => c.city.toLowerCase() === city.toLowerCase());
if (match) {
  fetchCityInfo(match.tz).then(info => {
    if (info) {
      document.getElementById("tab-info").innerHTML += `
        <hr>
        <strong>📊 Current Time:</strong> ${new Date(info.datetime).toLocaleTimeString()}<br>
        <strong>🌅 Sunrise:</strong> ${info.sunrise}<br>
        <strong>🌇 Sunset:</strong> ${info.sunset}<br>
        <strong>🌓 Day Length:</strong> ${info.day_length}
      `;
    } else {
      document.getElementById("tab-info").innerHTML += `<hr><em>No extra time data available.</em>`;
    }
  });
}
async function fetchCityInfo(cityTZ) {
  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${cityTZ}`);
    if (!response.ok) throw new Error("No data");
    const data = await response.json();
    return {
      datetime: data.datetime,
      sunrise: data.sunrise || "Unavailable",
      sunset: data.sunset || "Unavailable",
      day_length: data.day_length || "Unavailable"
    };
  } catch (err) {
    console.warn("Failed to fetch city info:", err);
    return null;
  }
}
const cityInfoCache = {};
const cityImageCache = {};
async function fetchCityInfo(cityTZ) {
  if (cityInfoCache[cityTZ]) return cityInfoCache[cityTZ];
  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${cityTZ}`);
    const data = await response.json();
    const info = {
      datetime: data.datetime,
      sunrise: data.sunrise || "Unavailable",
      sunset: data.sunset || "Unavailable",
      day_length: data.day_length || "Unavailable"
    };
    cityInfoCache[cityTZ] = info;
    return info;
  } catch (err) {
    return null;
  }
                                     }
<div id="sidebar" class="sidebar">
  <button class="close-btn" onclick="closeSidebar()">✖</button>
  <div class="tab-btns">
    <button onclick="switchTab('info')">📊 Info</button>
    <button onclick="switchTab('photos')">📷 Photos</button>
    <button onclick="switchTab('favorite')">⭐ Favorite</button>
  </div>
  <div id="tab-info" class="tab-content active"></div>
  <div id="tab-photos" class="tab-content"></div>
  <div id="tab-favorite" class="tab-content"></div>
</div>
async function fetchCityImage(city) {
  if (cityImageCache[city]) return cityImageCache[city];
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape&per_page=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const img = data.results[0].urls.regular;
      cityImageCache[city] = img;
      return img;
    }
  } catch (err) {
    console.warn("Image fetch failed:", err);
  }
  return null;
}
function loadMap(cityName) {
  // Use OpenCage Geocoder for coordinates (or mock)
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) return;

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      // Clean up any existing map
      if (window._leafletMap) {
        window._leafletMap.remove();
      }

      window._leafletMap = L.map('map').setView([lat, lon], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      }).addTo(window._leafletMap);

      L.marker([lat, lon]).addTo(window._leafletMap)
        .bindPopup(`${cityName}`)
        .openPopup();
    });
}
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
  }
async function fetchCityInfo(cityTZ, cityName) {
  if (cityInfoCache[cityTZ]) return cityInfoCache[cityTZ];

  try {
    const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
    const response = await fetch(nominatimURL);
    const data = await response.json();

    if (!data || data.length === 0) return null;

    const place = data[0];
    const info = {
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
      country: place.address?.country || "Unknown",
      country_code: place.address?.country_code || "xx"
    };

    cityInfoCache[cityTZ] = info;
    return info;

  } catch (err) {
    return null;
  }
                             }
switchTab('info'); // default
loadMap(city);     // map initialization
if (info.lat && info.lon) {
  loadMapFromCoords(info.lat, info.lon, city);
}
const infoHTML = `
  <h3>${city}</h3>
  <p><strong>Country:</strong> ${info.country} 
     <img src="https://flagcdn.com/48x36/${info.country_code}.png" 
     alt="${info.country}" 
     style="vertical-align:middle; width:28px; margin-left:6px;"></p>
  <p><strong>Latitude:</strong> ${parseFloat(info.lat).toFixed(4)}</p>
  <p><strong>Longitude:</strong> ${parseFloat(info.lon).toFixed(4)}</p>
`;
document.getElementById("tab-info").innerHTML = infoHTML;
card.innerHTML = `
  <div class="city-title">${entry.city}</div>
  <div class="tz-label">${cityShort.replace(/_/g,' ')} (${entry.tz})</div>
  <div class="clock" id="clock-${idx}">--:--:--</div>
  <button class="fav-btn" onclick="toggleFavorite('${entry.city}', '${entry.tz}')">
    ⭐
  </button>
`;
function loadMapFromCoords(lat, lon, cityName) {
  if (window._leafletMap) window._leafletMap.remove();
  window._leafletMap = L.map('map').setView([lat, lon], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(window._leafletMap);

  L.marker([lat, lon]).addTo(window._leafletMap)
    .bindPopup(`${cityName}`)
    .openPopup();
}
function updateFavoritesTab() {
  const favs = getFavorites();
  const container = document.getElementById("tab-favorite");

  if (favs.length === 0) {
    container.innerHTML = "<p>No favorite cities yet.</p>";
    return;
  }

  container.innerHTML = favs.map(fav => `
    <div class="fav-card">
      <strong>${fav.city}</strong> <small>(${fav.tz})</small>
      <button onclick="removeFavorite('${fav.city}')">❌</button>
    </div>
  `).join('');
}

function removeFavorite(city) {
  const favs = getFavorites().filter(f => f.city !== city);
  saveFavorites(favs);
  updateFavoritesTab();
    }
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function toggleFavorite(city, tz) {
  const favs = getFavorites();
  const exists = favs.find(f => f.city === city);
  let updated;

  if (exists) {
    updated = favs.filter(f => f.city !== city);
  } else {
    updated = [...favs, { city, tz }];
  }

  saveFavorites(updated);
  alert(`${city} ${exists ? "removed from" : "added to"} favorites`);
  updateFavoritesTab(); // refresh tab content
                                             }
updateFavoritesTab();
async function sendAI() {
  const input = document.getElementById("ai-input");
  const log = document.getElementById("ai-log");
  const question = input.value.trim();
  if (!question) return;

  const userMsg = document.createElement("div");
  userMsg.className = "ai-msg ai-msg-user";
  userMsg.innerText = question;
  log.appendChild(userMsg);
  input.value = "";

  const botMsg = document.createElement("div");
  botMsg.className = "ai-msg ai-msg-bot";
  botMsg.innerText = "Thinking...";
  log.appendChild(botMsg);
  log.scrollTop = log.scrollHeight;

  try {
    const reply = await fakeAIResponse(question); // Replace with real API if needed
    botMsg.innerText = reply;
  } catch (err) {
    botMsg.innerText = "Sorry, I had trouble answering that.";
  }

  log.scrollTop = log.scrollHeight;
}

async function fakeAIResponse(q) {
  // Simulated response — replace later with real API
  if (q.toLowerCase().includes("time in")) {
    const city = q.split("in ")[1];
    return `The current time in ${city} depends on your timezone. You can find it in the grid above.`;
  } else if (q.toLowerCase().includes("timezone")) {
    return "Timezones differ by region. Try searching a city for more.";
  }
  return "That's a great question! I'm still learning but can help with world clocks.";
                         }
const CACHE_NAME = "world-clock-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/style.css",
  "/script.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", () => {
  installBtn.style.display = "none";
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    if (choice.outcome === "accepted") {
      console.log("User accepted install");
    }
    deferredPrompt = null;
  });
});
function openCityPanel(cityObj) {
  document.getElementById("city-name").innerText = cityObj.city;
  document.getElementById("city-photo").src =
    `https://source.unsplash.com/400x260/?${encodeURIComponent(cityObj.city + ' city')}`;
  document.getElementById("timezone-info").innerText = `Timezone: ${cityObj.tz}`;

  // Calculate time difference
  try {
    const localTime = new Date();
    const targetTime = new Date(localTime.toLocaleString("en-US", { timeZone: cityObj.tz }));
    const diffHrs = Math.round((targetTime - localTime) / 3600000);
    document.getElementById("time-diff").innerText =
      `Time difference from your local time: ${diffHrs} hour(s)`;
  } catch {
    document.getElementById("time-diff").innerText = "Could not determine time difference.";
  }

  // Mock AI fact
  document.getElementById("city-fact").innerText = `${cityObj.city} is a vibrant city known for its diversity and culture.`;

  document.getElementById("city-detail-panel").classList.remove("hidden");
}

function closeCityPanel() {
  document.getElementById("city-detail-panel").classList.add("hidden");
    }
card.addEventListener("click", () => openCityPanel(entry));
const cities = [
  { city: "New York", tz: "America/New_York", country: "US", region: "North America" },
  { city: "London", tz: "Europe/London", country: "GB", region: "Europe" },
  { city: "Tokyo", tz: "Asia/Tokyo", country: "JP", region: "Asia" },
  { city: "Nairobi", tz: "Africa/Nairobi", country: "KE", region: "Africa" },
  // ... add to others like that
];
const cities = [
  { city: "New York", tz: "America/New_York", country: "US", region: "North America" },
  { city: "London", tz: "Europe/London", country: "GB", region: "Europe" },
  { city: "Tokyo", tz: "Asia/Tokyo", country: "JP", region: "Asia" },
  { city: "Nairobi", tz: "Africa/Nairobi", country: "KE", region: "Africa" },
  // ... add to others like that
];
container.appendChild(card);
function filterClocks() {
  filterByRegion(); // Combine both filters
  }
function filterByRegion() {
  const selectedRegion = document.getElementById("region-select").value;
  const query = document.getElementById("search").value.toLowerCase();
  let filtered = cities;

  if (selectedRegion !== "all") {
    filtered = filtered.filter(c => c.region === selectedRegion);
  }

  if (query) {
    filtered = filtered.filter(c => c.city.toLowerCase().includes(query));
  }

  renderClocks(filtered);
  updateClock();
}
<div class="city-title">
  <img src="https://flagcdn.com/24x18/${entry.country.toLowerCase()}.png" width="24" height="18" style="vertical-align:middle;margin-right:6px;border-radius:2px;" alt="${entry.country} flag"/>
  ${entry.city}
</div>
<div class="city-title">${entry.city}</div>
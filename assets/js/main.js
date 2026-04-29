function init() {
    updateClock();
    updateTimezoneLabels();
    initHoverTimezones();

    setInterval(updateClock, 1000);
    setInterval(updateTimezoneLabels, 60 * 1000);
}

function updateClock() {
  const now = new Date();

  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const utc = getUTCOffset();

const clockEl = document.getElementById("clock");

if (clockEl) {
    clockEl.textContent = `${timeString} (${utc} | ${tz} |`;
}
}

function getUTCOffset() {
  const offsetMinutes = -new Date().getTimezoneOffset(); 

  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);

  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  return minutes === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
}

function updateTimezoneLabels() {
  document.querySelectorAll(".tz").forEach(tz => {
    const baseOffset = parseInt(tz.dataset.offset);
    const label = tz.querySelector("span");

    if (!label) return;

    if (baseOffset === 0) {
      label.textContent = "UTC±0";
    } else {
      const sign = baseOffset > 0 ? "+" : "";
      label.textContent = `UTC${sign}${baseOffset}`;
    }

    const userOffset = -new Date().getTimezoneOffset() / 60;

    if (baseOffset === userOffset) {
      tz.style.background = "rgba(255, 255, 0, 0.15)";
    }
  });
}

document.addEventListener("DOMContentLoaded", init);

function initHoverTimezones() {
  const display = document.getElementById("hoverDisplay");

  document.querySelectorAll(".hover-zone").forEach(zone => {

    zone.addEventListener("mouseenter", () => {

      const rawOffset = parseInt(zone.dataset.offset);

      const offset = rawOffset + 1;

      const time = getTimeForOffset(offset);

      const cities = UTC_CITIES[offset] || ["Unknown"];

      const cityText = cities.join(" • ");

      const utcLabel =
        `UTC${offset >= 0 ? "+" : ""}${offset}`;

      display.innerHTML =
        `TIME - ${time} (${utcLabel} | ${cityText})`;
    });

    zone.addEventListener("mouseleave", () => {
      display.textContent =
        "Hover a Timezone | UTC | Cities | Add hour for daylight saving";
    });

  });
}

function initHoverTimezones() {
  const display = document.getElementById("hoverDisplay");

  document.querySelectorAll(".hover-zone").forEach(zone => {

    zone.addEventListener("mouseenter", () => {

      const rawOffset = parseInt(zone.dataset.offset);
      const offset = rawOffset;

      const time = getTimeForOffset(offset);
      const cities = UTC_CITIES[offset] || ["Unknown"];

      display.innerHTML =
        `TIME - ${time} (UTC${offset >= 0 ? "+" : ""}${offset} | ${cities.join(" • ")} |`;
      zone.classList.add("flash");

      setTimeout(() => {
        zone.classList.remove("flash");
      }, 600);
    });

    zone.addEventListener("mouseleave", () => {
      display.textContent =
        "Hover a Timezone | UTC | Cities |Add hour for daylight saving";
    });
  });
}

function getTimeForOffset(offsetHours) {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const target = new Date(utc + (offsetHours * 3600000));
  return target.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

const UTC_CITIES = {
  "-12": ["Baker Island", "Howland Island"],
  "-11": ["Niue", "American Samoa", "Midway Atoll"],
  "-10": ["Honolulu", "Hawaii", "Tahiti"],
  "-9": ["Anchorage", "Alaska", "Gambell"],
  "-8": ["Los Angeles", "Vancouver", "Tijuana"],
  "-7": ["Denver", "Phoenix", "Calgary"],
  "-6": ["Chicago", "Mexico City", "Guatemala City"],
  "-5": ["New York", "Toronto", "Bogotá"],
  "-4": ["Caracas", "Santiago", "Halifax"],
  "-3": ["Buenos Aires", "São Paulo", "Montevideo"],
  "-2": ["South Georgia", "Azores West", "Atlantic Islands"],
  "-1": ["Azores", "Cape Verde", "Reykjavik"],
  "0": ["London", "Accra", "Reykjavik"],
  "1": ["Paris", "Berlin", "Rome"],
  "2": ["Athens", "Cairo", "Johannesburg"],
  "3": ["Moscow", "Istanbul", "Nairobi"],
  "4": ["Dubai", "Baku", "Muscat"],
  "5": ["Karachi", "Tashkent", "Islamabad"],
  "6": ["Dhaka", "Almaty", "Thimphu"],
  "7": ["Bangkok", "Jakarta", "Hanoi"],
  "8": ["Beijing", "Singapore", "Perth"],
  "9": ["Tokyo", "Seoul", "Pyongyang"],
  "10": ["Sydney", "Brisbane", "Guam"],
  "11": ["Solomon Islands", "Vanuatu", "Magadan"],
  "12": ["Auckland", "Fiji", "Chatham Islands"]
};

const bgMusic = new Audio("assets/sfx/Persona-Rain.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.1;

document.addEventListener("click", () => {
  bgMusic.play().catch(err => {
    console.log("Background music blocked:", err);
  });
}, { once: true });

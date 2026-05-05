let DST_ENABLED = false;

document.addEventListener("DOMContentLoaded", init);

function init() {
  updateClock();
  updateTimezoneLabels();
  initHoverTimezones();
  initZoneClick();
  initDSTToggle();

  setInterval(updateClock, 1000);
  setInterval(updateTimezoneLabels, 60000);
}
function updateClock() {
  const now = new Date();

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utc = getUTCOffset();

  const clockEl = document.getElementById("clock");

  if (clockEl) {
    clockEl.textContent = `(${utc} | ${tz} | ${timeString}`;
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

    const displayOffset = DST_ENABLED ? baseOffset + 1 : baseOffset;

    const sign = displayOffset > 0 ? "+" : "";
    label.textContent = `UTC${sign}${displayOffset}`;

    const userOffset = -new Date().getTimezoneOffset() / 60;

    if (displayOffset === userOffset) {
      tz.style.background = "rgba(255,255,0,0.15)";
    } else {
      tz.style.background = "";
    }
  });
}

function initHoverTimezones() {
  const display = document.getElementById("hoverDisplay");

  document.querySelectorAll(".hover-zone").forEach(zone => {

    zone.addEventListener("mouseenter", () => {
      const rawOffset = parseInt(zone.dataset.offset);

      const offset = DST_ENABLED ? rawOffset + 1 : rawOffset;

      const time = getTimeForOffset(offset);
      const cities = UTC_CITIES[offset] || ["Unknown"];

      display.textContent =
        `UTC${offset >= 0 ? "+" : ""}${offset} | ${cities.join(" • ")} | ${time}`;

      zone.classList.add("flash");

      setTimeout(() => {
        zone.classList.remove("flash");
      }, 500);
    });

    zone.addEventListener("mouseleave", () => {
      display.textContent = "Hover a Timezone | UTC | Cities";
    });

  });
}

function initZoneClick() {
  document.querySelectorAll(".hover-zone").forEach(zone => {
    zone.addEventListener("click", () => {
      const offset = zone.dataset.offset;

      console.log("clicked offset:", offset);

      // Build filename directly
      const page = `tz-${offset}.html`;

      console.log("redirecting to:", page);

      window.location.href = page;
    });
  });
}

function getTimeForOffset(offsetHours) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  const target = new Date(utc + offsetHours * 3600000);

  return target.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function initDSTToggle() {
  const btn = document.getElementById("dstToggle");

  btn.addEventListener("click", () => {
    DST_ENABLED = !DST_ENABLED;

    if (DST_ENABLED) {
      btn.textContent = "Daylight Savings: ON";
      btn.classList.remove("dst-off");
      btn.classList.add("dst-on");
    } else {
      btn.textContent = "Daylight Savings: OFF";
      btn.classList.remove("dst-on");
      btn.classList.add("dst-off");
    }

    updateTimezoneLabels();
  });
}

document.getElementById('blurBtn').addEventListener('click', () => {
    document.getElementById('background-layer').classList.toggle('blurred-bg');
});

const TZ_PAGES = {
  "-12": "tz-baker.html",
  "-11": "tz-samoa.html",
  "-10": "tz-honolulu.html",
  "-9": "tz-anchorage.html",
  "-8": "tz-losangeles.html",
  "-7": "tz-denver.html",
  "-6": "tz-chicago.html",
  "-5": "tz-newyork.html",
  "-4": "tz-caracas.html",
  "-3": "tz-buenosaires.html",
  "-2": "tz-southgeorgia.html",
  "-1": "tz-azores.html",
  "0": "tz-0.html",
  "1": "tz-paris.html",
  "2": "tz-athens.html",
  "3": "tz-moscow.html",
  "4": "tz-dubai.html",
  "5": "tz-karachi.html",
  "6": "tz-dhaka.html",
  "7": "tz-bangkok.html",
  "8": "tz-beijing.html",
  "9": "tz-tokyo.html",
  "10": "tz-sydney.html",
  "11": "tz-solomon.html",
  "12": "tz-auckland.html"
};
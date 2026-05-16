let DST_ENABLED = true;

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

  const baseOffset = -now.getTimezoneOffset() / 60;

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const clockEl = document.getElementById("clock");

  if (clockEl) {
    const sign = baseOffset >= 0 ? "+" : "";
    clockEl.textContent = `(UTC${sign}${baseOffset} | ${tz} | ${timeString})`;
  }
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

function updateTimezoneLabels() {
  document.querySelectorAll(".tz").forEach(tz => {
    const baseOffset = parseInt(tz.dataset.offset);
    const label = tz.querySelector("span");

    if (!label) return;
    const displayOffset = baseOffset;

    const sign = displayOffset >= 0 ? "+" : "";
    label.textContent = `UTC${sign}${displayOffset}`;
    const userOffset = -new Date().getTimezoneOffset() / 60;
    tz.style.background =
      displayOffset === userOffset
        ? "rgba(255,255,0,0.15)"
        : "";
  });
}

function initHoverTimezones() {
  const display = document.getElementById("hoverDisplay");
  document.querySelectorAll(".hover-zone").forEach(zone => {
    zone.addEventListener("mouseenter", () => {
      const rawOffset = parseInt(zone.dataset.offset);
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const baseTarget = new Date(utc + rawOffset * 3600000);
      const finalTarget = DST_ENABLED
        ? new Date(baseTarget.getTime() + 3600000)
        : baseTarget;

      const time = finalTarget.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const displayOffset = DST_ENABLED ? rawOffset + 1 : rawOffset;
      const cities = UTC_CITIES[rawOffset] || ["Unknown"];

      display.textContent =
        `UTC${displayOffset >= 0 ? "+" : ""}${displayOffset} | ${cities.join(" • ")} | ${time}`;

      zone.classList.add("flash");

      setTimeout(() => zone.classList.remove("flash"), 500);
    });

    zone.addEventListener("mouseleave", () => {
      display.textContent = "Hover a Timezone | UTC | Cities";
    });

  });
}

function initZoneClick() {
  document.querySelectorAll(".hover-zone").forEach(zone => {
    zone.addEventListener("click", () => {
      window.location.href = `tz-${zone.dataset.offset}.html`;
    });
  });
}

function initDSTToggle() {
  const btn = document.getElementById("dstToggle");

  function render() {
    if (DST_ENABLED) {
      btn.textContent = "Daylight Savings: ON";
      btn.classList.add("dst-on");
      btn.classList.remove("dst-off");
    } else {
      btn.textContent = "Daylight Savings: OFF";
      btn.classList.add("dst-off");
      btn.classList.remove("dst-on");
    }
  }

render();
  btn.addEventListener("click", () => {
    DST_ENABLED = !DST_ENABLED;
    render();
    updateTimezoneLabels();
  });
}

function initMusic() {
  const music = document.getElementById("bgMusic");

  function startMusic() {
    music.volume = 0.3;

    music.play().catch(err => {
      console.log("Audio blocked:", err);
    });

    document.removeEventListener("click", startMusic);
    document.removeEventListener("keydown", startMusic);
  }

  document.addEventListener("click", startMusic);
  document.addEventListener("keydown", startMusic);
}

initMusic();

// Register Service Worker for PWA
let copyResetTimer;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

function calculatePace() {
  const distance = parseFloat(document.getElementById("distance").value);
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;

  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const paceEl = document.getElementById("pace");
  const copyButtonEl = document.getElementById("copy-button");

  // Reset error and result
  errorEl.classList.remove("show");
  resultEl.classList.remove("show");
  copyButtonEl.classList.remove("copied");
  copyButtonEl.textContent = "Copy result";
  clearTimeout(copyResetTimer);

  // Validation
  if (!distance || distance <= 0) {
    errorEl.textContent = "Please enter a valid distance";
    errorEl.classList.add("show");
    return;
  }

  if (minutes === 0 && seconds === 0) {
    errorEl.textContent = "Please enter a valid time";
    errorEl.classList.add("show");
    return;
  }

  if (seconds >= 60) {
    errorEl.textContent = "Seconds must be less than 60";
    errorEl.classList.add("show");
    return;
  }

  // Calculate total time in seconds
  const totalSeconds = minutes * 60 + seconds;

  // Calculate pace (seconds per km)
  const paceSeconds = totalSeconds / distance;

  // Convert to mm:ss format
  const roundedPaceSeconds = Math.round(paceSeconds);
  const paceMinutes = Math.floor(roundedPaceSeconds / 60);
  const paceSecs = roundedPaceSeconds % 60;

  // Format the result
  const formattedPace = `${paceMinutes}:${paceSecs
    .toString()
    .padStart(2, "0")}`;

  paceEl.textContent = formattedPace;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  copyButtonEl.dataset.copyText = `${distance} km · ⏱ ${formattedTime} · ${formattedPace} min/km`;
  resultEl.classList.add("show");
}

async function copyResult() {
  const copyButtonEl = document.getElementById("copy-button");
  const text = copyButtonEl.dataset.copyText;

  if (!text) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();
      if (!copied) throw new Error("Copy command failed");
    }

    copyButtonEl.classList.add("copied");
    copyButtonEl.textContent = "Copied!";
    clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyButtonEl.classList.remove("copied");
      copyButtonEl.textContent = "Copy result";
    }, 5000);
  } catch (error) {
    copyButtonEl.textContent = "Could not copy";
  }
}

// Allow Enter key to calculate
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    calculatePace();
  }
});

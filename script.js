function calculatePace() {
  const distance = parseFloat(document.getElementById("distance").value);
  const minutes = parseInt(document.getElementById("minutes").value) || 0;
  const seconds = parseInt(document.getElementById("seconds").value) || 0;

  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const paceEl = document.getElementById("pace");

  // Reset error and result
  errorEl.classList.remove("show");
  resultEl.classList.remove("show");

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
  const paceMinutes = Math.floor(paceSeconds / 60);
  const paceSecs = Math.round(paceSeconds % 60);

  // Format the result
  const formattedPace = `${paceMinutes}:${paceSecs
    .toString()
    .padStart(2, "0")}`;

  paceEl.textContent = formattedPace;
  resultEl.classList.add("show");
}

// Allow Enter key to calculate
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    calculatePace();
  }
});

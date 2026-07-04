// public/js/guest.js
// Reads the "to" query parameter (e.g. ?to=Reddo+dan+Pasangan) and displays it
// as the invited guest's name on the cover screen.

(function () {
  function getGuestNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (!raw) return null;

    // Decode and tidy up extra whitespace
    return raw.replace(/\s+/g, " ").trim();
  }

  function renderGuestName() {
    const el = document.getElementById("guest-name");
    const name = getGuestNameFromURL();
    if (el && name) {
      el.textContent = name;
    }
  }

  document.addEventListener("DOMContentLoaded", renderGuestName);
})();

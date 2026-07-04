// public/js/main.js
// Orchestrates the "Buka Undangan" transition, background music, and the
// gift account number copy-to-clipboard button.

(function () {
  function openInvitation() {
    document.getElementById("cover").classList.add("hidden");
    document.getElementById("invitation").classList.remove("hidden");

    const musicToggle = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-audio");

    musicToggle.classList.remove("hidden");
    audio.play().catch(() => {
      // Autoplay may be blocked by the browser; user can press the music toggle.
    });

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function toggleMusic() {
    const audio = document.getElementById("bg-audio");
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function copyAccountNumber() {
    const number = document.getElementById("gift-number").textContent.trim();
    navigator.clipboard
      .writeText(number)
      .then(() => {
        const btn = document.getElementById("copy-account-btn");
        const original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = original;
        }, 1500);
      })
      .catch((err) => console.error("Copy failed:", err));
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("open-invitation-btn").addEventListener("click", openInvitation);
    document.getElementById("music-toggle").addEventListener("click", toggleMusic);
    document.getElementById("copy-account-btn").addEventListener("click", copyAccountNumber);
  });
})();

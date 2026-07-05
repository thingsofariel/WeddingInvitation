(function () {
  // 1. Existing Invitation Logic
  function openInvitation() {
    document.getElementById("cover").classList.add("hidden");
    document.getElementById("invitation").classList.remove("hidden");

    const musicToggle = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-audio");

    musicToggle.classList.remove("hidden");
    audio.play().catch(() => {});
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function toggleMusic() {
    const audio = document.getElementById("bg-audio");
    audio.paused ? audio.play() : audio.pause();
  }

  // 2. Gift Modal Logic (BARU)
  function openGiftModal() {
    document.getElementById("gift-modal").classList.remove("hidden");
  }

  function closeGiftModal() {
    document.getElementById("gift-modal").classList.add("hidden");
  }

  // 3. Gift Card Copy Logic
  function copyAccountNumber(event) {
    if (event.target.classList.contains('copy-btn')) {
      const targetId = event.target.getAttribute('data-target');
      const number = document.getElementById(targetId).textContent.trim();
      
      navigator.clipboard.writeText(number).then(() => {
        const originalText = event.target.textContent;
        event.target.textContent = "Copied!";
        setTimeout(() => { event.target.textContent = originalText; }, 1500);
      });
    }
  }

  // 4. Document Setup On Load
  document.addEventListener("DOMContentLoaded", function () {
    // Tombol-tombol utama
    document.getElementById('open-invitation-btn').addEventListener('click', openInvitation);
    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
    
    // Trigger Modal
    document.getElementById('open-gift-modal').addEventListener('click', openGiftModal);
    document.querySelector('.close-modal').addEventListener('click', closeGiftModal);
    
    // Copy Rekening
    document.body.addEventListener('click', copyAccountNumber);
    
    // Scroll Reveal Animation Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(element => revealObserver.observe(element));
  }); 
})();

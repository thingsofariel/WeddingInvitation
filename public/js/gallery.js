// public/js/gallery.js
// Renders the photo gallery grid and a click-through lightbox viewer.

(function () {
  // Replace these with your actual gallery image filenames in public/images/
  const GALLERY_IMAGES = [
    "images/Cover.jpg",
    "images/Cover2.jpg",
    "images/Cover3.jpg",
    "images/Cover4.jpeg",
    "images/Cover5.jpeg",
    "images/Cover6.jpeg",
    "images/Cover7.jpeg",
    "images/Cover8.jpeg",
    "images/Cover9.jpeg",
  ];

  let currentIndex = 0;

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    grid.innerHTML = GALLERY_IMAGES.map(
      (src, i) => `<img src="${src}" data-index="${i}" alt="Wedding Gallery ${i + 1}" loading="lazy" />`
    ).join("");

    grid.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => openLightbox(Number(img.dataset.index)));
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
    lightbox.classList.remove("hidden");
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
    document.getElementById("lightbox-img").src = GALLERY_IMAGES[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    document.getElementById("lightbox-img").src = GALLERY_IMAGES[currentIndex];
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGallery();
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-next").addEventListener("click", showNext);
    document.getElementById("lightbox-prev").addEventListener("click", showPrev);
    document.getElementById("lightbox").addEventListener("click", function (e) {
      if (e.target.id === "lightbox") closeLightbox();
    });
  });
})();

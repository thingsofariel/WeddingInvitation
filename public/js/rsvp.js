// public/js/rsvp.js
// Handles RSVP form submission and rendering the paginated wishes list,
// talking to the backend API at /api/wishes.

(function () {
  const API_BASE = "/api/wishes";
  let currentPage = 1;
  const PAGE_LIMIT = 10;

  function attendanceLabel(value) {
    return value === "hadir" ? "Hadir" : "Tidak Hadir";
  }

  function renderWishes(wishes, append) {
    const list = document.getElementById("wishes-list");
    const itemsHtml = wishes
      .map(
        (w) => `
        <li class="wish-item">
          <div class="wish-item-header">
            <span>${escapeHtml(w.name)}</span>
            <span class="wish-item-tag ${w.attendance}">${attendanceLabel(w.attendance)}</span>
          </div>
          <p>${escapeHtml(w.message)}</p>
        </li>`
      )
      .join("");

    if (append) {
      list.insertAdjacentHTML("beforeend", itemsHtml);
    } else {
      list.innerHTML = itemsHtml;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadWishes(page, append) {
    try {
      const res = await fetch(`${API_BASE}?page=${page}&limit=${PAGE_LIMIT}`);
      const json = await res.json();

      renderWishes(json.data, append);

      document.getElementById("wishes-count").textContent = json.pagination.total;
      document.getElementById("summary-hadir").textContent = json.summary.hadir;
      document.getElementById("summary-tidak-hadir").textContent = json.summary.tidakHadir;

      const loadMoreBtn = document.getElementById("load-more-btn");
      if (json.pagination.page < json.pagination.totalPages) {
        loadMoreBtn.classList.remove("hidden");
      } else {
        loadMoreBtn.classList.add("hidden");
      }

      currentPage = json.pagination.page;
    } catch (err) {
      console.error("Failed to load wishes:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorEl = document.getElementById("rsvp-error");
    errorEl.classList.add("hidden");

    const payload = {
      name: form.name.value.trim(),
      attendance: form.attendance.value,
      guestCount: Number(form.guestCount.value),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Submission failed");
      }

      form.reset();
      currentPage = 1;
      loadWishes(1, false);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("rsvp-form").addEventListener("submit", handleSubmit);
    document.getElementById("load-more-btn").addEventListener("click", function () {
      loadWishes(currentPage + 1, true);
    });

    loadWishes(1, false);
  });
})();

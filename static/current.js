function openLink(url) {
  window.open(url, "_blank");
}

function go(page) {
  document.body.style.opacity = "0";

  setTimeout(() => {
    // ✅ FIX: .html remove automatically
    window.location.href = page.replace(".html", "");
  }, 200);
}

function showSection(id, el) {
  // hide all sections
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  // show selected
  document.getElementById(id).classList.remove("hidden");

  // active tab switch
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  el.classList.add("active");
}
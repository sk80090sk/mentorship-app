// navigation
function go(page) {
  // ✅ Flask-safe navigation
  window.location.href = page.replace(".html", "");
}

// welcome message
window.onload = function () {
  console.log("Dashboard loaded 🚀");

  // ✅ run after DOM load
  document.querySelectorAll(".disabled").forEach(box => {
    box.onclick = function () {
      alert("Coming Soon 🚀");
    };
  });
};
function openLink(url) {
  window.open(url, "_blank");
}

// ✅ FIX: wait for DOM
document.addEventListener("DOMContentLoaded", function () {

  // disable click
  document.querySelectorAll(".disabled").forEach(box => {
    box.onclick = function () {
      alert("AI Mentor feature coming soon 🚀");
    };
  });

});
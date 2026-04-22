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





// ai mentor gpt
async function sendMessage() {
  let input = document.getElementById("userInput");
  let message = input.value.trim();

  if (message === "") return;

  let chatBox = document.getElementById("chatContainer");

  // Show user message
  chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;

  input.value = "";

  // Scroll down
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    let response = await fetch("/chat_api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    let data = await response.json();

    // Show bot reply
    chatBox.innerHTML += `<p><b>Mentor:</b> ${data.reply}</p>`;

    // Auto scroll again
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    chatBox.innerHTML += `<p><b>Mentor:</b> Error connecting to server.</p>`;
  }
}

// Enter key support
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
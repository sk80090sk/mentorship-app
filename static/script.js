//manu bar

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const btn = document.querySelector(".menu-btn");

  menu.classList.toggle("active");

  // hide/show button
  if (menu.classList.contains("active")) {
    btn.style.display = "none";
  } else {
    btn.style.display = "block";
  }
}

function go(page) {
  window.location.href = page.replace(".html", "");
}









// ===== TOGGLE LOGIN / SIGNUP =====
function toggleForm() {
  const login = document.getElementById("loginForm");
  const signup = document.getElementById("signupForm");
  const title = document.getElementById("formTitle");

  if (login.style.display === "none") {
    login.style.display = "block";
    signup.style.display = "none";
    title.innerText = "Welcome Back 👋";
  } else {
    login.style.display = "none";
    signup.style.display = "block";
    title.innerText = "Create Account 🚀";
  }
}


// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", function () {

  const fields = [
    document.getElementById("name"),
    document.getElementById("age"),
    document.getElementById("phone"),
    document.getElementById("signupEmail"),
    document.getElementById("signupPassword")
  ];

  fields.forEach((field, index) => {
    if (!field) return;

    field.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // 🔥 MOST IMPORTANT

        if (index < fields.length - 1) {
          fields[index + 1].focus();
        } else {
          signup();
        }
      }
    });
  });

});

// ===== LOGIN =====
function login() {
  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "success") {
      window.location.href = "/dashboard";
    } else {
      alert(res.message);
    }
  });
}


// ===== SIGNUP =====
function signup() {
  let name = document.getElementById("name").value.trim();
  let age = document.getElementById("age").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let email = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value.trim();

  if (name.length < 3) return alert("Invalid Name");
  if (age < 15 || age > 60) return alert("Invalid Age");
  if (!/^[0-9]{10}$/.test(phone)) return alert("Invalid Phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Invalid Email");
  if (password.length < 6) return alert("Weak Password");

  fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, age, phone, email, password })
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "success") {
      alert("Signup successful 🚀");
      toggleForm();
    } else {
      alert(res.message);
    }
  });
}


// ===== GUEST LOGIN =====
function guestLogin() {
  localStorage.setItem("userType", "guest");
  window.location.href = "/dashboard";
}

// enter new feid
fields.forEach((field, index) => {
  if (!field) return;

  // live validation (color only)
  field.addEventListener("input", function () {
    if (validate(field)) {
      field.style.border = "2px solid green";
    } else {
      field.style.border = "2px solid red";
    }
  });

  // ENTER → ALWAYS NEXT (no block)
  field.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (index < fields.length - 1) {
        fields[index + 1].focus();
      } else {
        signup(); // last field
      }
    }
  });
});






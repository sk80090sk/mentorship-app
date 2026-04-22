// ---------------- MENU ---------------- //

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const btn = document.querySelector(".menu-btn");

  menu.classList.toggle("active");

  if (menu.classList.contains("active")) {
    btn.style.display = "none";
  } else {
    btn.style.display = "block";
  }
}

function go(page) {
  window.location.href = page.replace(".html", "");
}


// ---------------- REGISTER ---------------- //

async function register() {

    let data = {
        name: document.getElementById("name").value.trim(),
        gender: document.getElementById("gender").value.trim(),
        age: document.getElementById("age").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    };

    let confirm = document.getElementById("confirm").value;

    // ✅ validation
    if (!data.name || !data.email || !data.password) {
        document.getElementById("msg").innerText = "All fields required!";
        return;
    }

    if (data.password !== confirm) {
        document.getElementById("msg").innerText = "Password not match!";
        return;
    }

    try {
        let res = await fetch('/register_user', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        let result = await res.json();

        if (result.status === "exists") {
            document.getElementById("msg").innerText = "User already registered";
        } 
        else if (result.status === "success") {
            document.getElementById("msg").innerText = "Registration successful ✅";

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } 
        else {
            document.getElementById("msg").innerText = "Something went wrong!";
        }

    } catch (error) {
        console.log(error);
        document.getElementById("msg").innerText = "Server error!";
    }
}


// ---------------- LOGIN ---------------- //

async function login() {

    let data = {
        login: document.getElementById("login").value.trim(),
        password: document.getElementById("password").value
    };

    if (!data.login || !data.password) {
        document.getElementById("msg").innerText = "Enter login & password!";
        return;
    }

    try {
        let res = await fetch('/login_user', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        let result = await res.json();

        if (result.status === "success") {
            window.location.href = "/dashboard";
        } 
        else if (result.status === "wrong") {
            document.getElementById("msg").innerText = "Invalid credentials";
        } 
        else {
            document.getElementById("msg").innerText = "User not exist";
        }

    } catch (error) {
        console.log(error);
        document.getElementById("msg").innerText = "Server error!";
    }
}


// ---------------- FORGOT ---------------- //

async function forgot() {

    let login = prompt("Enter email or phone");
    let new_password = prompt("Enter new password");

    if (!login || !new_password) {
        alert("All fields required!");
        return;
    }

    try {
        let res = await fetch('/forgot', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({login, new_password})
        });

        let result = await res.json();

        if (result.status === "updated") {
            alert("Password updated successfully ✅");
        } else {
            alert("Error updating password");
        }

    } catch (error) {
        console.log(error);
        alert("Server error!");
    }
}
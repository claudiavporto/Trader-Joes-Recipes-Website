// ========== Login ==========
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token && data.userId) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        alert("Login successful!");
        hideAuthUI();
        showLogoutUI();
      } else {
        alert(data.error || "Login failed");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Something went wrong.");
    });
}

// ========== Register ==========
function register() {
  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token && data.userId) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        alert("Registration successful!");
        hideAuthUI();
        showLogoutUI();
      } else {
        alert(data.error || "Registration failed");
      }
    })
    .catch(err => {
      console.error("Register error:", err);
      alert("Something went wrong.");
    });
}

// ========== Logout ==========
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  alert("Logged out.");
  location.reload();
}

function hideAuthUI() {
  document.getElementById("auth-backdrop").style.display = "none";
  document.getElementById("welcome-section").style.display = "none";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("register-section").style.display = "none";
  document.getElementById("close-auth-box").style.display = "none";
  showLogoutUI();
}

function showLogoutUI() {
  document.getElementById("logout-container").style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    document.getElementById("auth-backdrop").style.display = "flex";
    document.getElementById("logout-container").style.display = "none";
  } else {
    hideAuthUI();
  }

  // Auth form toggles
  document.getElementById("show-login")?.addEventListener("click", () => {
    document.getElementById("welcome-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("register-section").style.display = "none";
  });

  document.getElementById("show-register")?.addEventListener("click", () => {
    document.getElementById("welcome-section").style.display = "none";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "block";
  });

  document.getElementById("to-register")?.addEventListener("click", () => {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "block";
  });

  document.getElementById("to-login")?.addEventListener("click", () => {
    document.getElementById("register-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
  });

  document.getElementById("close-auth-box")?.addEventListener("click", () => {
    document.getElementById("auth-backdrop").style.display = "none";
  });
});

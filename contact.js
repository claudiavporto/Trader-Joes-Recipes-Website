function setupContactForm(form) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    // Validate name
    if (name.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email.";
      isValid = false;
    }

    // Validate message
    if (message.value.trim() === "") {
      messageError.textContent = "Please enter a message.";
      isValid = false;
    }

    // If all fields valid, send form
    if (isValid) {
      fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim()
        })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message || "Message sent!");
        form.reset();
      })
      .catch(error => {
        console.error("Error sending message:", error);
        alert("There was a problem submitting your message.");
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("contact-form");
  if (form) {
    console.log("Setting up contact form");
    setupContactForm(form);
  }
});

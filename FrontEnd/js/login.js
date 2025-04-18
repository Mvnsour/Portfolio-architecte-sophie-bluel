import { checkAuth } from "./auth.js";

// Method 1: Using DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.querySelector(".error-message");

  if (!loginForm || !emailInput || !errorMessage) {
    console.error("Error: One or more elements are missing in the DOM.");
  } else {
    loginForm.addEventListener("submit", async (event) => { 
      event.preventDefault();

    const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
    const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : "";

      try {
        const data = await checkAuth(email, password);
        if (data.token) { 
          localStorage.setItem("authToken", data.token); // Store the token in localStorage
          localStorage.setItem("isLoggedIn", "true"); // Store the login state
          window.location.href = 'index.html'; // Redirection to the home page
        }
      } catch (error) {
        errorMessage.textContent = "Email ou mot de passe incorrect.";
      }
    });
  } 

});
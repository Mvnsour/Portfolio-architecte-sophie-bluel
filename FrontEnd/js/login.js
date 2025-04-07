import { checkAuth } from "./auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");

if (!loginForm || !emailInput || !passwordInput || !errorMessage) {
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
        window.location.href = 'index.html'; // Redirection vers la page principale
      }
    } catch (error) {
      console.error("Authentification error :", error);
      errorMessage.textContent = "Email ou mot de passe incorrect.";
    }
  });
} 
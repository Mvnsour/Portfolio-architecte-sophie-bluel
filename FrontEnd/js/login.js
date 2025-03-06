import { checkAuth } from "./auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email"); ;
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");

// Check if the elements exist
if (!loginForm || !emailInput || !passwordInput || !errorMessage) {
    console.error("Erreur : Un ou plusieurs éléments du formulaire sont introuvables !");
} else {
    console.log("Tous les éléments du formulaire sont bien détectés !");

    loginForm.addEventListener("submit", async(event) => {
        event.preventDefault(); // avoid the default behavior of the form
        console.log("Formulaire soumis");

        // Check if the inputs are not null before accessing their value
        // I am obliged to use the instanceof operator to avoid a type error in the console
        const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
        const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : ""; 

        console.log("Email saisi :", email);
        console.log("Mot de passe saisi :", password);

        checkAuth(email, password)
        .then(data => {
            if (data.token) { // If authentication is successful
                localStorage.setItem('authToken', data.token); // store the token in the local storage
                window.location.href = 'index.html'; // redirect to the index page
            }
        }).catch(error => {
            console.error("Erreur d'authentification :", error);
            errorMessage.textContent = "Email ou mot de passe incorrect.";
        });
        })
    }
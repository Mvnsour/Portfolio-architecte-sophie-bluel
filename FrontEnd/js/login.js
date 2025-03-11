import { checkAuth } from "./auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email"); ;
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");
const loginLink = document.getElementById("login-page"); 
const filtersContainer = document.getElementById("filters-container");
const editButton = document.getElementById("edit-btn");

// Check if the elements exist
if (!loginForm || !emailInput || !passwordInput || !errorMessage || !loginLink) {
    console.error("Erreur : Un ou plusieurs éléments du formulaire sont introuvables !");
} else {
    console.log("Tous les éléments du formulaire sont bien détectés !");

    // Fonction pour vérifier si l'utilisateur est connecté
const updateLogin = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
        if (loginLink instanceof HTMLAnchorElement) {
            loginLink.href = "#"; // Pas d'erreur
/*             loginLink.href = "login.html"; // Pas d'erreur
 */        }
            loginLink.onclick = () => {
                localStorage.removeItem("authToken");
                window.location.href = "login.html"; // Rediriger vers la page de connexion
            };
        } else {
            loginLink.textContent = "login";
            // @ts-ignore
            loginLink.href = "login.html";
            loginLink.onclick = null; // Retirer le gestionnaire de clic
        }

        // Masquer les filtres et afficher le bouton "modifier" si l'utilisateur est connecté
        if (filtersContainer) {
            filtersContainer.style.display = token ? "none" : "block";
        }

        if (editButton) {
            editButton.style.display = token ? "block" : "none";
        }
    };
  
  updateLogin();
  // Vérifier si l'utilisateur est déjà connecté au chargement de la page

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
                localStorage.setItem('isLoggedIn', "true"); // store the login status in the local storage
                window.location.href = 'index.html'; // redirect to the index page
            }
        }).catch(error => {
            console.error("Erreur d'authentification :", error);
            errorMessage.textContent = "Email ou mot de passe incorrect.";
        });
    });

}
const userLogin = "http://localhost:5678/api/users/login";
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email"); ;
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error-message");

// Check if the elements exist
if (!loginForm || !emailInput || !passwordInput || !errorMessage) {
    console.error("Erreur : Un ou plusieurs éléments du formulaire sont introuvables !");
} else {
    console.log("Tous les éléments du formulaire sont bien détectés !");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // avoid the default behavior of the form
        console.log("Formulaire soumis");

        // Check if the inputs are not null before accessing their value
        // I am obliged to use the instanceof operator to avoid a type error in the console
        const email = emailInput instanceof HTMLInputElement ? emailInput.value : "";
        const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : ""; 

        console.log("Email saisi :", email);
        console.log("Mot de passe saisi :", password);

        fetch(userLogin, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password})
        }).then(response => {
                console.log("Réponse brute du serveur :", response, response.status, response.statusText);
                console.log(response.json());
                if (!response.ok) {
                    errorMessage.innerHTML = "Erreur dans l'identifiant ou le mot de passe";
                    throw new Error(`Response status: ${response.status}`);
                }
            })
        })
    }
// Erreur dans l'idantifiant ou le mot de passe
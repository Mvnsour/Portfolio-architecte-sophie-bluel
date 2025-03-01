const userLogin = "http://localhost:5678/api/users/login";

document.getElementById("loginForm").addEventListener("submit", onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    let response = await fetch(userLogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })

    let result = await response.json();
    console.log(result);
    alert(result.message);
}

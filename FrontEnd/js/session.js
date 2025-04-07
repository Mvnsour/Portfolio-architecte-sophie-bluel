const loginLink = document.getElementById("login-link");
const filters = document.getElementById("filters");
const editButton = document.getElementById("edit-btn");
const topEditButton = document.getElementById("top-edit-btn");

export const updateUI = () => {
    const token = localStorage.getItem("authToken");
    const isOnIndexPage = window.location.pathname.includes("index.html") || window.location.pathname === "/";

    if (loginLink instanceof HTMLAnchorElement) {
        if (token) {
            loginLink.href = "#";
            if (isOnIndexPage) {
              loginLink.textContent = "logout";
            }

            loginLink.onclick = () => {
                localStorage.removeItem("authToken");
                window.location.href = "index.html";
                window.location.reload(); //
            };
        } else {
            loginLink.textContent = "login";
            loginLink.href = "login.html";
            loginLink.onclick = null;
        }
    }
    if (filters) {
        filters.style.display = token ? "none" : "flex";
    }

    if (editButton) {
        editButton.style.display = token ? "block" : "none";
    }

    if (topEditButton) {
        topEditButton.style.display = token ? "block" : "none";
    }
};

updateUI();

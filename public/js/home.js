document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.querySelector(".navbar .navbar-collapse .text-center"); 

    const usuarioLogado = sessionStorage.getItem("loggedIn");
    const username = sessionStorage.getItem("username");

    if (usuarioLogado === "true" && username) {
        renderBemVindoLogout(navbarContainer, username); 
    } else {
        renderLoginButton(navbarContainer); 
    }
});

function renderBemVindoLogout(container, username) {
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.classList.add("d-flex", "flex-column", "flex-md-row", "align-items-center", "justify-content-center");

    const welcomeMessage = document.createElement("span");
    welcomeMessage.textContent = `Bem vindo(a), ${username.split("@")[0]}!`;
    welcomeMessage.classList.add("text-dark","fw-bold", "bg-dark-subtle","rounded", "me-md-3", "mb-2", "mb-md-0");

    const logoutButton = document.createElement("button");
    logoutButton.classList.add("btn", "btn-outline-light");
    logoutButton.setAttribute("id", "logout-button");
    logoutButton.textContent = "Sair";

    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("username");

        renderLoginButton(container);
    });

    wrapper.appendChild(welcomeMessage);
    wrapper.appendChild(logoutButton);

    container.appendChild(wrapper);
}

function renderLoginButton(container) {
    container.innerHTML = "";

    const loginLink = document.createElement("a");
    loginLink.classList.add("nav-link", "active");
    loginLink.setAttribute("href", "../pages/login.html");

    const loginButton = document.createElement("button");
    loginButton.classList.add("btn", "btn-danger");
    loginButton.textContent = "Login";

    loginLink.appendChild(loginButton); 
    container.appendChild(loginLink); 
}

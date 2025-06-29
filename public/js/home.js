// ========================================
// CONTROLE DE STATUS DO USUÁRIO NA NAVBAR
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const userStatusArea = document.getElementById("user-status-area");
    
    if (!userStatusArea) {
        console.error("Área de status do usuário não encontrada na navbar");
        return;
    }

    const usuarioLogado = sessionStorage.getItem("loggedIn");
    const username = sessionStorage.getItem("username");
    const userNome = sessionStorage.getItem("userNome");

    if (usuarioLogado === "true" && username) {
        renderUsuarioLogado(userStatusArea, username, userNome); 
    } else {
        renderBotaoLogin(userStatusArea); 
    }
});

// ========================================
// USUÁRIO LOGADO - INTERFACE COMPLETA
// ========================================

function renderUsuarioLogado(container, email, nomeCompleto) {
    container.innerHTML = "";

    const userContainer = document.createElement("div");
    userContainer.classList.add("d-flex", "align-items-center", "gap-2");

    // Primeira letra do nome (ou do email se não tiver nome)
    const primeiraLetra = nomeCompleto 
        ? obterIniciais(nomeCompleto)  // Usar função que pega primeira + última
        : email.charAt(0).toUpperCase();
    
    // Mostrar primeiro nome ou parte do email
    const nomeDisplay = nomeCompleto 
        ? nomeCompleto.split(' ')[0] 
        : email.split('@')[0];

    // Avatar com primeira letra do nome
    const avatar = document.createElement("div");
    avatar.classList.add("d-flex", "align-items-center", "justify-content-center", 
                         "bg-danger", "text-white", "rounded-circle", "fw-bold");
    avatar.style.width = "40px";
    avatar.style.height = "40px";
    avatar.style.fontSize = "18px";
    avatar.textContent = primeiraLetra;

    // Informações do usuário
    const userInfo = document.createElement("div");
    userInfo.classList.add("d-flex", "flex-column", "text-light", "d-none", "d-md-block");
    
    const welcomeText = document.createElement("small");
    welcomeText.classList.add("mb-0", "opacity-75");
    welcomeText.textContent = "Bem-vindo, ";
    
    const userName = document.createElement("span");
    userName.classList.add("fw-bold", "lh-1");
    userName.style.fontSize = "14px";
    userName.textContent = nomeDisplay;
    
    userInfo.appendChild(welcomeText);
    userInfo.appendChild(userName);

    // Dropdown com informações do usuário
    const dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");
    
    const dropdownButton = document.createElement("button");
    dropdownButton.classList.add("btn", "btn-outline-light", "btn-sm", "dropdown-toggle");
    dropdownButton.setAttribute("type", "button");
    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownButton.innerHTML = '<i class="bi bi-chevron-down"></i>';
    
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu", "dropdown-menu-end");
    dropdownMenu.style.minWidth = "250px";
    
    // Informações do usuário (cabeçalho do dropdown)
    const userInfoItem = document.createElement("li");
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("dropdown-item-text", "bg-light");
    userInfoDiv.innerHTML = `
        <div class="d-flex align-items-center mb-2">
            <div class="me-3">
                <div class="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                     style="width: 50px; height: 50px; font-size: 20px;">
                    ${nomeCompleto ? obterIniciais(nomeCompleto) : email.charAt(0).toUpperCase()}
                </div>
            </div>
            <div>
                <div class="fw-bold text-dark">${nomeCompleto || nomeDisplay}</div>
                <div class="text-muted small">${email}</div>
            </div>
        </div>
    `;
    userInfoItem.appendChild(userInfoDiv);
    
    // Divisor
    const divider = document.createElement("li");
    divider.innerHTML = '<hr class="dropdown-divider">';
    
    // Opção: Sair
    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.classList.add("dropdown-item", "text-danger");
    logoutLink.href = "#";
    logoutLink.innerHTML = '<i class="bi bi-box-arrow-right me-2"></i>Sair';
    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout(container);
    });
    logoutItem.appendChild(logoutLink);
    
    dropdownMenu.appendChild(userInfoItem);
    dropdownMenu.appendChild(divider);
    dropdownMenu.appendChild(logoutItem);
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownMenu);

    // Montar interface completa
    userContainer.appendChild(avatar);
    userContainer.appendChild(userInfo);
    userContainer.appendChild(dropdown);
    
    container.appendChild(userContainer);
}

// ========================================
// BOTÃO LOGIN PADRÃO
// ========================================

function renderBotaoLogin(container) {
    container.innerHTML = "";

    const loginLink = document.createElement("a");
    loginLink.classList.add("nav-link", "active");
    loginLink.setAttribute("href", "/login");

    const loginButton = document.createElement("button");
    loginButton.classList.add("btn", "btn-danger");
    loginButton.innerHTML = '<i class="bi bi-person-circle me-1"></i>Login';

    loginLink.appendChild(loginButton); 
    container.appendChild(loginLink); 
}

// ========================================
// FUNÇÃO LOGOUT
// ========================================

function logout(container) {
    // Confirmar logout
    if (confirm("Tem certeza que deseja sair?")) {
        // Limpar dados da sessão
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userNome");

        // Mostrar feedback visual
        const toast = document.createElement("div");
        toast.classList.add("toast", "align-items-center", "text-bg-success", "border-0");
        toast.setAttribute("role", "alert");
        toast.style.position = "fixed";
        toast.style.top = "100px";
        toast.style.right = "20px";
        toast.style.zIndex = "9999";
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle me-2"></i>Logout realizado com sucesso!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Ativar toast do Bootstrap
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remover toast após alguns segundos
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 4000);

        // Voltar para botão de login
        renderBotaoLogin(container);
    }
}

// ========================================
// FUNÇÃO AUXILIAR: OBTER INICIAIS DO NOME
// ========================================

function obterIniciais(nomeCompleto) {
    if (!nomeCompleto) return "U";
    
    const nomes = nomeCompleto.trim().split(' ').filter(nome => nome.length > 0);
    
    if (nomes.length === 0) return "U";
    if (nomes.length === 1) return nomes[0].charAt(0).toUpperCase();
    
    // Primeira letra do primeiro e último nome
    const primeira = nomes[0].charAt(0).toUpperCase();
    const ultima = nomes[nomes.length - 1].charAt(0).toUpperCase();
    
    return primeira + ultima;
}
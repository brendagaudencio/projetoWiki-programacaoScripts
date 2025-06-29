// ========================================
// TOGGLE ENTRE LOGIN E CADASTRO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btn-login");
    const btnCadastro = document.getElementById("btn-cadastro");
    const loginForm = document.getElementById("login-form");
    const cadastroForm = document.getElementById("cadastro-form");

    // Verificar se elementos existem antes de adicionar listeners
    if (btnLogin && btnCadastro && loginForm && cadastroForm) {
        // Toggle para Login
        btnLogin.addEventListener("click", () => {
            btnLogin.classList.add("active");
            btnCadastro.classList.remove("active");
            loginForm.classList.remove("d-none");
            cadastroForm.classList.add("d-none");
        });

        // Toggle para Cadastro
        btnCadastro.addEventListener("click", () => {
            btnCadastro.classList.add("active");
            btnLogin.classList.remove("active");
            cadastroForm.classList.remove("d-none");
            loginForm.classList.add("d-none");
        });
    }
});

// ========================================
// FORMULÁRIO DE LOGIN - VALIDAÇÃO RIGOROSA
// ========================================

const form = document.getElementById("login-form");
const usuario = document.getElementById("inputUsuario");
const senha = document.getElementById("inputSenha");

if (form && usuario && senha) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Limpar mensagens de erro anteriores
        const elementsErrors = document.querySelectorAll(".errorForm");
        elementsErrors.forEach((element) => element.remove());
        [usuario, senha].forEach((campo) => campo.classList.remove("border-danger"));

        const usuarioValue = usuario.value.trim();
        const senhaValue = senha.value.trim();
        const mensagemSucesso = document.getElementById("login-message-success");
        let validLogin = true;

        // Validações rigorosas
        if (usuarioValue === "") {
            exibirMensagemErro(usuario, "O campo e-mail não pode estar vazio.");
            validLogin = false;
        } else if (!isValidEmail(usuarioValue)) {
            exibirMensagemErro(usuario, "E-mail inválido.");
            validLogin = false;
        }

        if (senhaValue === "") {
            exibirMensagemErro(senha, "O campo senha não pode estar vazio.");
            validLogin = false;
        } else if (senhaValue.length < 4) {
            exibirMensagemErro(senha, "Senha deve ter pelo menos 4 caracteres.");
            validLogin = false;
        }

        if (validLogin) {
            // VALIDAÇÃO RIGOROSA: Apenas credenciais específicas funcionam
            if (usuarioValue === "teste@teste.com" && senhaValue === "teste") {
                mensagemSucesso.textContent = "Login efetuado com sucesso!";
                mensagemSucesso.className = "my-3 bg-success text-white p-2 rounded";

                // Salvar dados do usuário logado no sessionStorage
                sessionStorage.setItem("loggedIn", "true");
                sessionStorage.setItem("username", usuarioValue);
                sessionStorage.setItem("userNome", "João Silva"); // Simular nome do banco

                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } else {
                // ERRO ESPECÍFICO: Credenciais não encontradas
                exibirMensagemErro(usuario, "E-mail ou senha incorretos. Use: teste@teste.com");
                exibirMensagemErro(senha, "Senha: teste");
            }
        } else {
            if (mensagemSucesso) {
                mensagemSucesso.textContent = ""; 
            }
        }
    });
}

// ========================================
// FORMULÁRIO DE CADASTRO
// ========================================

const cadastroForm = document.getElementById("cadastro-form");
const nomeCadastro = document.getElementById("inputNomeCadastro");
const emailCadastro = document.getElementById("inputEmailCadastro");
const senhaCadastro = document.getElementById("inputSenhaCadastro");
const confirmaSenha = document.getElementById("inputConfirmaSenha");

if (cadastroForm && nomeCadastro && emailCadastro && senhaCadastro && confirmaSenha) {
    cadastroForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Limpar mensagens de erro anteriores
        const elementsErrors = document.querySelectorAll(".errorForm");
        elementsErrors.forEach((element) => element.remove());
        [nomeCadastro, emailCadastro, senhaCadastro, confirmaSenha].forEach((campo) => 
            campo.classList.remove("border-danger")
        );

        const nomeValue = nomeCadastro.value.trim();
        const emailValue = emailCadastro.value.trim();
        const senhaValue = senhaCadastro.value.trim();
        const confirmaSenhaValue = confirmaSenha.value.trim();
        const mensagemSucesso = document.getElementById("cadastro-message-success");
        let validCadastro = true;

        // Validação Nome
        if (nomeValue === "") {
            exibirMensagemErro(nomeCadastro, "Nome não pode estar vazio.");
            validCadastro = false;
        } else if (nomeValue.length < 2 || nomeValue.length > 50) {
            exibirMensagemErro(nomeCadastro, "Nome deve ter entre 2 e 50 caracteres.");
            validCadastro = false;
        }

        // Validação E-mail
        if (emailValue === "") {
            exibirMensagemErro(emailCadastro, "E-mail não pode estar vazio.");
            validCadastro = false;
        } else if (!isValidEmail(emailValue)) {
            exibirMensagemErro(emailCadastro, "E-mail inválido.");
            validCadastro = false;
        }

        // Validação Senha
        if (senhaValue === "") {
            exibirMensagemErro(senhaCadastro, "Senha não pode estar vazia.");
            validCadastro = false;
        } else if (senhaValue.length < 6) {
            exibirMensagemErro(senhaCadastro, "Senha deve ter pelo menos 6 caracteres.");
            validCadastro = false;
        }

        // Validação Confirmar Senha
        if (confirmaSenhaValue !== senhaValue) {
            exibirMensagemErro(confirmaSenha, "Senhas não coincidem.");
            validCadastro = false;
        }

        if (validCadastro) {
            // SIMULAÇÃO: Salvar dados do cadastro para uso futuro
            // TODO: Quando backend estiver pronto, isso será uma requisição real
            const dadosCadastro = {
                nome: nomeValue,
                email: emailValue,
                senha: senhaValue
            };
            
            // Simular salvamento (em produção seria no banco)
            console.log("Dados do cadastro (simulação):", dadosCadastro);
            
            if (mensagemSucesso) {
                mensagemSucesso.textContent = `Conta criada com sucesso para ${nomeValue}! Agora você pode fazer login.`;
                mensagemSucesso.className = "my-3 bg-success text-white p-2 rounded";
            }
            
            // Limpar formulário
            cadastroForm.reset();
            
            // Voltar para login após sucesso
            setTimeout(() => {
                const btnLogin = document.getElementById("btn-login");
                if (btnLogin) btnLogin.click();
                
                if (mensagemSucesso) {
                    mensagemSucesso.textContent = "Agora faça login com: teste@teste.com / teste";
                }
            }, 3000);
        }
    });
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function exibirMensagemErro(elemento, mensagem) {
    if (!elemento) return;
    
    limparMensagemErro(elemento);

    elemento.classList.add("border-danger");

    const divErro = document.createElement("div");
    divErro.textContent = mensagem;
    divErro.classList.add("text-danger", "errorForm", "mt-1"); 
    elemento.insertAdjacentElement("afterend", divErro);
}

function limparMensagemErro(elemento) {
    if (!elemento) return;
    
    const erroExistente = elemento.nextElementSibling;
    if (erroExistente && erroExistente.classList.contains("errorForm")) {
        erroExistente.remove();
    }
    elemento.classList.remove("border-danger");
}

function isValidEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}
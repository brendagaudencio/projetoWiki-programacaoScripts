// ========================================
// FORMULÁRIO DE COLABORAÇÃO (Baseado no seu código + correções)
// ========================================

const form = document.getElementById("formGeral");
// CORREÇÃO: inputNome (estava inuptNome)
const nome = document.getElementById("inputNome");
const email = document.getElementById("inputEmail");
const cpf = document.getElementById("inputCPF");
const message = document.getElementById("inputMessage");

// Aplicar máscara no CPF conforme digitação (melhoria)
cpf.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    
    if (value.length <= 11) {
        // Aplica máscara: 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = value;
    }
});

formGeral.addEventListener("submit", (e) => {
    e.preventDefault();

    // Sua lógica de limpeza mantida
    const elementsErrors = document.querySelectorAll(".errorForm");
    elementsErrors.forEach((element) => element.remove());
    [nome, email, cpf, message].forEach((campo) =>
        campo.classList.remove("border-danger")
    );

    let todosValidos = true;

    // ========================================
    // VALIDAÇÃO NOME (Sua lógica melhorada)
    // ========================================
    const nomeValue = nome.value.trim();
    if (nomeValue === "") {
        exibirMensagemErro(nome, "Esse campo não pode ser vazio.");
        todosValidos = false;
    } else if (/\d/.test(nomeValue)) {
        exibirMensagemErro(nome, "Esse campo não pode conter números.");
        todosValidos = false;
    } else if (!(nomeValue.length <= 50 && nomeValue.length > 2)) {
        // MELHORIA: Aumentei limite para 50 chars
        exibirMensagemErro(nome, "Nome precisa ter entre 2 e 50 caracteres.");
        todosValidos = false;
    }

    // ========================================
    // VALIDAÇÃO EMAIL (Sua lógica mantida)
    // ========================================
    const emailValue = email.value.trim();
    if (emailValue === "") {
        exibirMensagemErro(email, "Esse campo não pode ser vazio");
        todosValidos = false;
    } else if (!isValidEmail(emailValue)) {
        exibirMensagemErro(email, "Esse email não é válido.");
        todosValidos = false;
    }

    // ========================================
    // VALIDAÇÃO CPF (Sua lógica mantida)
    // ========================================
    const cpfValue = cpf.value.trim().replace(/\D/g, ""); // Remove máscara para validação

    if (cpfValue === "") {
        exibirMensagemErro(cpf, "Esse campo não pode ser vazio.");
        todosValidos = false;
    } else if (!isValidCpf(cpfValue)) {
        exibirMensagemErro(cpf, "Esse CPF não é válido.");
        todosValidos = false;
    }

    // ========================================
    // VALIDAÇÃO MENSAGEM (Sua lógica melhorada)
    // ========================================
    const messageValue = message.value.trim();
    if (messageValue.length > 700 || messageValue.length < 10) {
        // MELHORIA: Mínimo 10 chars para mensagens mais substanciais
        exibirMensagemErro(message, "Mensagem deve ter entre 10 e 700 caracteres.");
        todosValidos = false;
    }

    // ========================================
    // RESULTADO DA VALIDAÇÃO
    // ========================================
    // CORREÇÃO: ID correto (form-message-success)
    const mensagemSucesso = document.getElementById("form-message-success");
    
    if (todosValidos) {
        mensagemSucesso.textContent = "Sua colaboração foi enviada com sucesso! Obrigado!";
        // MELHORIA: Classes Bootstrap para melhor visual
        mensagemSucesso.className = "my-3 bg-success text-white p-3 rounded";

        // Sua lógica de limpeza mantida
        nome.value = "";
        email.value = "";
        cpf.value = "";
        message.value = "";

        // TODO: Quando backend estiver implementado, enviar para /colaborar via POST
        setTimeout(() => {
            mensagemSucesso.textContent = "";
            mensagemSucesso.className = "my-3";
        }, 5000); // Aumentei tempo para 5s
    } else {
        mensagemSucesso.textContent = ""; 
        mensagemSucesso.className = "my-3";
    }
});

// ========================================
// SUAS FUNÇÕES AUXILIARES (Mantidas)
// ========================================

function exibirMensagemErro(elemento, mensagem) {
    limparMensagemErro(elemento);

    elemento.classList.add("border-danger");

    const divErro = document.createElement("div");
    divErro.textContent = mensagem;
    divErro.classList.add("text-danger", "errorForm", "mt-1"); // Adicionei mt-1
    elemento.insertAdjacentElement("afterend", divErro);
}

function limparMensagemErro(elemento) {
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

// SUA FUNÇÃO DE VALIDAÇÃO CPF (Excelente implementação!)
function isValidCpf(cpf) {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

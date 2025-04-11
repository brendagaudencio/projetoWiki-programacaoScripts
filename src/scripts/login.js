const form = document.getElementById("login-form");
const usuario = document.getElementById("inputUsuario");
const senha = document.getElementById("inputSenha");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const elementsErrors = document.querySelectorAll(".errorForm");
    elementsErrors.forEach((element) => element.remove());
    [usuario, senha].forEach((campo) => campo.classList.remove("border-danger"));

    const usuarioCorreto = "teste@teste";
    const senhaCorreta = "teste";

    const usuarioValue = usuario.value.trim();
    const senhaValue = senha.value.trim();

    const mensagemSucesso = document.getElementById("login-message-sucess");
    let validLogin = true;

    if (usuarioValue === "") {
        exibirMensagemErro(usuario, "O campo usuário não pode estar vazio.");
        validLogin = false;
    } else if (usuarioValue !== usuarioCorreto) {
        exibirMensagemErro(usuario, "Usuário incorreto.");
        validLogin = false;
    }

    if (senhaValue === "") {
        exibirMensagemErro(senha, "O campo senha não pode estar vazio.");
        validLogin = false;
    } else if (senhaValue !== senhaCorreta) {
        exibirMensagemErro(senha, "Senha incorreta.");
        validLogin = false;
    }

    if (validLogin) {
        mensagemSucesso.textContent = "Seu login foi efetuado com sucesso!";
        mensagemSucesso.className = "my-3 bg-success text-white";

        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("username", usuarioValue);

        setTimeout(() => {
            window.location.href = "../pages/home.html";
        }, 1500);
    } else {
        mensagemSucesso.textContent = ""; 
    }
});


function exibirMensagemErro(elemento, mensagem) {
    limparMensagemErro(elemento);

    elemento.classList.add("border-danger");

    const divErro = document.createElement("div");
    divErro.textContent = mensagem;
    divErro.classList.add("text-danger", "errorForm", "mt-1"); 
    elemento.insertAdjacentElement("afterend", divErro);
}

function limparMensagemErro(elemento) {
    const erroExistente = elemento.nextElementSibling;
    if (erroExistente && erroExistente.classList.contains("errorForm")) {
        erroExistente.remove();
    }
    elemento.classList.remove("border-danger");
}

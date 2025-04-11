const form = document.getElementById("formGeral");
const nome = document.getElementById("inuptNome");
const email = document.getElementById("inputEmail");
const cpf = document.getElementById("inputCPF");
const message = document.getElementById("inputMessage");

function isValidEmail(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

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

formGeral.addEventListener("submit", (e) => {
  e.preventDefault();

  const elementsErrors = document.querySelectorAll(".errorForm");
  elementsErrors.forEach((element) => element.remove());
  [nome, email, cpf, message].forEach((campo) =>
    campo.classList.remove("border-danger")
  );

  let todosValidos = true;

  const nomeValue = nome.value.trim();
  if (nomeValue === "") {
    exibirMensagemErro(nome, "Esse campo não pode ser vazio.");
    todosValidos = false;
  } else if (/\d/.test(nomeValue)) {
    exibirMensagemErro(nome, "Esse campo não pode conter números.");
    todosValidos = false;
  } else if (!(nomeValue.length < 30 && nomeValue.length > 2)) {
    exibirMensagemErro(nome, "Nome precisa ter entre 2 e 30 caracteres.");
    todosValidos = false;
  }

  const emailValue = email.value.trim();
  if (emailValue === "") {
    exibirMensagemErro(email, "Esse campo não pode ser vazio");
    todosValidos = false;
  } else if (!isValidEmail(emailValue)) {
    exibirMensagemErro(email, "Esse email não é válido.");
    todosValidos = false;
  }

  const cpfValue = cpf.value.trim();

  if (cpfValue === "") {
    exibirMensagemErro(cpf, "Esse campo não pode ser vazio.");
    todosValidos = false;
  } else if (!isValidCpf(cpfValue)) {
    exibirMensagemErro(cpf, "Esse CPF não é válido.");
    todosValidos = false;
  }

  const messageValue = message.value.trim();
  if (messageValue.length > 700 || messageValue.length < 2) {
    exibirMensagemErro(message, "Mensagem deve ter entre 2 e 700 caracteres.");
    todosValidos = false;
  }

  const mensagemSucesso = document.getElementById("form-message-sucess");
  if (todosValidos) {
    mensagemSucesso.textContent = "Formulário enviado com sucesso!";
    mensagemSucesso.classList.add("text-success");

    nome.value = "";
    email.value = "";
    cpf.value = "";
    message.value = "";
  } else {
    mensagemSucesso.textContent = "";
  }
});

function exibirMensagemErro(elemento, mensagem) {
  limparMensagemErro(elemento);

  elemento.classList.add("border-danger");

  const divErro = document.createElement("div");
  divErro.textContent = mensagem;
  divErro.classList.add("text-danger", "errorForm");
  elemento.insertAdjacentElement("afterend", divErro);
}

function limparMensagemErro(elemento) {
  const erroExistente = elemento.nextElementSibling;
  if (erroExistente && erroExistente.classList.contains("errorForm")) {
    erroExistente.remove();
  }
  elemento.classList.remove("border-danger");
}

document.addEventListener('DOMContentLoaded', function() {
    const btnLogin = document.getElementById('btn-login');
    const btnCadastro = document.getElementById('btn-cadastro');
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');

    // Toggle entre formulários
    btnLogin.addEventListener('click', function() {
        btnLogin.classList.add('active');
        btnCadastro.classList.remove('active');
        loginForm.classList.remove('d-none');
        cadastroForm.classList.add('d-none');
    });

    btnCadastro.addEventListener('click', function() {
        btnCadastro.classList.add('active');
        btnLogin.classList.remove('active');
        cadastroForm.classList.remove('d-none');
        loginForm.classList.add('d-none');
    });

    // Validação de confirmação de senha
    const cadastroFormElement = document.getElementById('cadastro-form');
    const senhaInput = document.getElementById('inputSenhaCadastro');
    const confirmaSenhaInput = document.getElementById('inputConfirmaSenha');

    function validarSenhas() {
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;
        
        confirmaSenhaInput.classList.remove('is-valid', 'is-invalid');
        
        if (confirmaSenha === '') {
            return;
        }
        
        if (senha === confirmaSenha) {
            confirmaSenhaInput.classList.add('is-valid');
            return true;
        } else {
            confirmaSenhaInput.classList.add('is-invalid');
            return false;
        }
    }

    // Validar enquanto digita
    confirmaSenhaInput.addEventListener('input', validarSenhas);
    senhaInput.addEventListener('input', validarSenhas);

    // Validação no submit
    cadastroFormElement.addEventListener('submit', function(e) {
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;
        
        if (senha !== confirmaSenha) {
            e.preventDefault();
            
            confirmaSenhaInput.classList.add('is-invalid');
            
            let errorDiv = document.querySelector('.senha-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger senha-error mt-2';
                confirmaSenhaInput.parentNode.appendChild(errorDiv);
            }
            errorDiv.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>As senhas não coincidem!';
            
            confirmaSenhaInput.focus();
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
            
            return false;
        }
        
        const errorDiv = document.querySelector('.senha-error');
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
        
        return true;
    });
});
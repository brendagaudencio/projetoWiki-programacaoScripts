document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formGeral');
    const cpfInput = document.getElementById('cpf');
    const mensagemInput = document.getElementById('mensagem');
    const contador = document.getElementById('contador');

    // Contador de caracteres
    mensagemInput.addEventListener('input', function() {
        const length = this.value.length;
        contador.textContent = `${length}/500`;
        
        if (length < 10) {
            contador.className = 'text-warning fw-bold';
        } else if (length > 450) {
            contador.className = 'text-danger fw-bold';
        } else {
            contador.className = 'text-success fw-bold';
        }
    });

    // Máscara e validação de CPF
    cpfInput.addEventListener('input', function() {
        // Aplicar máscara
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = value;

        // Validar CPF
        const cpfLimpo = value.replace(/\D/g, '');
        if (cpfLimpo.length === 11) {
            if (isValidCPF(cpfLimpo)) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        } else {
            this.classList.remove('is-valid', 'is-invalid');
        }
    });

    // Validação do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

        // Validar CPF
        const cpfValue = cpfInput.value.replace(/\D/g, '');
        if (!cpfValue || cpfValue.length !== 11 || !isValidCPF(cpfValue)) {
            cpfInput.classList.add('is-invalid');
            isValid = false;
        } else {
            cpfInput.classList.remove('is-invalid');
            cpfInput.classList.add('is-valid');
        }

        // Validar mensagem
        const mensagemValue = mensagemInput.value.trim();
        if (mensagemValue.length < 10 || mensagemValue.length > 500) {
            mensagemInput.classList.add('is-invalid');
            isValid = false;
        } else {
            mensagemInput.classList.remove('is-invalid');
            mensagemInput.classList.add('is-valid');
        }

        form.classList.add('was-validated');

        if (isValid && form.checkValidity()) {
            // Loading no botão
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
            submitBtn.disabled = true;

            form.submit();
        } else {
            // Scroll para primeiro campo inválido
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });

    // Função de validação de CPF
    function isValidCPF(cpf) {
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }

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

    // Inicialização
    if (mensagemInput.value) {
        mensagemInput.dispatchEvent(new Event('input'));
    }

    cpfInput.focus();
});

// Função global para erro de CPF
window.showCPFError = function(message) {
    const cpfInput = document.getElementById('cpf');
    const feedback = cpfInput.nextElementSibling;
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
    
    cpfInput.classList.add('is-invalid');
    cpfInput.focus();
};
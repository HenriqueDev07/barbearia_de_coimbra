// ===== MENU MOBILE =====
const hamburger = document. querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList. remove('active');
    });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(13, 13, 13, 0.98)';
        header.style. boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(13, 13, 13, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this. getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== MÁSCARA DE TELEFONE =====
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value. replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value. replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target. value = value;
});

// ===== DATA MÍNIMA (HOJE) =====
const dataInput = document.getElementById('data');
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const dia = String(hoje.getDate()).padStart(2, '0');
dataInput.min = `${ano}-${mes}-${dia}`;

// ===== FORMULÁRIO DE AGENDAMENTO =====
const formAgendamento = document.getElementById('form-agendamento');

formAgendamento.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Pegar valores do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').options[document.getElementById('servico').selectedIndex].text;
    const barbeiro = document.getElementById('barbeiro').options[document.getElementById('barbeiro').selectedIndex].text;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    
    // Formatar data para exibição
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    
    // Criar mensagem para WhatsApp
    const mensagem = `🪒 *NOVO AGENDAMENTO - Barbearia de Coimbra*

👤 *Nome:* ${nome}
📱 *Telefone:* ${telefone}
✂️ *Serviço: * ${servico}
💈 *Barbeiro:* ${barbeiro}
📅 *Data:* ${dataFormatada}
🕐 *Horário:* ${horario}

_Aguardo confirmação do agendamento! _`;

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Número do WhatsApp (substitua pelo número real)
    const numeroWhatsApp = '351915234567';
    
    // Criar modal de confirmação
    showModal(nome, dataFormatada, horario, servico, barbeiro, numeroWhatsApp, mensagemCodificada);
});

// ===== MODAL DE CONFIRMAÇÃO =====
function showModal(nome, data, horario, servico, barbeiro, numero, mensagem) {
    // Criar elemento do modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <i class="fas fa-check-circle"></i>
            <h3>Confirmar Agendamento? </h3>
            <p><strong>${nome}</strong></p>
            <p>${servico} com ${barbeiro}</p>
            <p>📅 ${data} às ${horario}</p>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" id="confirmar-whatsapp" style="flex: 1;">
                    <i class="fab fa-whatsapp"></i> Confirmar
                </button>
                <button class="btn" id="cancelar-modal" style="flex: 1; background: #ccc; color: #333;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Botão confirmar - abre WhatsApp
    document.getElementById('confirmar-whatsapp').addEventListener('click', () => {
        window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
        modal.remove();
        formAgendamento.reset();
    });
    
    // Botão cancelar
    document.getElementById('cancelar-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e. target === modal) {
            modal.remove();
        }
    });
}

// ===== ANIMAÇÃO AO SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry. target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos cards
document.querySelectorAll('.servico-card, .depoimento-card, .galeria-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== VALIDAÇÃO DE DIA DA SEMANA =====
dataInput.addEventListener('change', (e) => {
    const dataSelecionada = new Date(e.target.value + 'T00:00:00');
    const diaSemana = dataSelecionada. getDay();
    
    // 0 = Domingo
    if (diaSemana === 0) {
        alert('Desculpe, não funcionamos aos domingos.  Por favor, escolha outro dia.');
        e.target.value = '';
    }
    
    // Ajustar horários disponíveis para sábado
    const horarioSelect = document.getElementById('horario');
    if (diaSemana === 6) {
        // Sábado - até 18:00
        Array.from(horarioSelect.options).forEach(option => {
            const hora = parseInt(option.value);
            if (hora >= 18 && option.value !== '') {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    } else {
        // Outros dias - todos os horários
        Array.from(horarioSelect.options).forEach(option => {
            option.disabled = false;
        });
    }
});

// ===== CONTADOR ANIMADO =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// Observar seção de estatísticas
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const value = parseInt(stat.textContent);
                if (! isNaN(value)) {
                    stat.textContent = '0';
                    animateCounter(stat, value);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== LOADING DA PÁGINA =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
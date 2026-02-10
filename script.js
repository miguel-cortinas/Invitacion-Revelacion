// Variables globales
let countdownInterval = null;
// FECHA CORREGIDA: 28 de Febrero de 2026, 3:00 PM
const eventDate = new Date("February 28, 2026 15:00:00").getTime();

// Inicialización cuando la página carga
window.addEventListener('load', function() {
    initializeApp();
});

function initializeApp() {
    setupLetterOpening();
    setupNavigation();
    setupScrollAnimations();
    setupCountdown();
    setupGallery(); // Nueva función de galería
}

// =================================== 
// APERTURA DE CARTA (CORREGIDO)
// ===================================

function setupLetterOpening() {
    const openBtn = document.getElementById('open-letter-btn');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const letterOpening = document.getElementById('letter-opening');
    const mainContent = document.getElementById('main-content');
    const navbar = document.getElementById('navbar');

    if (!openBtn || !envelopeWrapper) return;

    openBtn.addEventListener('click', function() {
        // Abrir el sobre
        envelopeWrapper.classList.add('open');
        
        // Esperamos a que salga la carta para desvanecer el overlay
        setTimeout(() => {
            letterOpening.classList.add('opening');
            
            // Mostrar confeti
            createConfetti();
            
            setTimeout(() => {
                letterOpening.style.display = 'none';
                mainContent.classList.add('show');
                navbar.classList.add('show');
                document.body.style.overflow = 'auto';
            }, 2000);
        }, 1500);
    });
}

// Crear efecto de confeti (BALANCEADO: Azul y Rosa por igual)
function createConfetti() {
    // 3 tonos de azul, 3 tonos de rosa para balance perfecto
    const colors = [
        '#89CFF0', '#5B9BD5', '#87CEEB', // Azules
        '#FF69B4', '#FFB6C1', '#FF1493'  // Rosas
    ];
    const confettiCount = 120; // Un poco más de confeti
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3000 + 2000;
            const rotation = Math.random() * 360;
            
            confetti.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 1 
                },
                { 
                    transform: `translateY(100vh) rotate(${rotation}deg)`,
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), duration);
        }, i * 20);
    }
}

// =================================== 
// NAVEGACIÓN
// ===================================

function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// =================================== 
// GALERÍA / CARRUSEL
// ===================================

function setupGallery() {
    const track = document.getElementById('carousel-track');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;

    // Crear indicadores
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
        
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.children);

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }

    // Auto Play
    let autoPlayInterval = setInterval(nextSlide, 4000);

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
}

// =================================== 
// ANIMACIONES AL HACER SCROLL
// ===================================

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =================================== 
// CONTADOR REGRESIVO
// ===================================

function setupCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = `
            <div class="countdown-message">
                <h3>¡El gran día ha llegado!</h3>
            </div>
        `;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// =================================== 
// UTILIDADES
// ===================================

document.body.style.overflow = 'hidden';

console.log('🎉 Invitación actualizada: Balance de color y Galería añadidos');
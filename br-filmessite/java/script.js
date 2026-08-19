// ==========================================
// BR-FILMES
// JAVASCRIPT PRINCIPAL
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVBAR (sombra ao rolar)
    // ==========================================

    const navbar = document.querySelector('#navbar');

    function atualizarNavbar() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 35);
    }

    window.addEventListener('scroll', atualizarNavbar, { passive: true });
    atualizarNavbar();


    // ==========================================
    // 2. MODO ESCURO / CLARO
    // ==========================================
    // Um único estado de tema, refletido nos dois interruptores
    // (o do dropdown desktop e o da gaveta mobile).

    const trilhos = [
        document.getElementById('trilho'),
        document.getElementById('trilho-mobile')
    ].filter(Boolean);

    function aplicarTema(tema) {
        document.documentElement.classList.toggle('dark', tema === 'dark');
        trilhos.forEach(t => t.classList.toggle('dark', tema === 'dark'));
    }

    function alternarTema() {
        const novoTema = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        aplicarTema(novoTema);
        localStorage.setItem('tema', novoTema);
    }

    trilhos.forEach(trilho => trilho.addEventListener('click', alternarTema));

    // Sincroniza o estado visual dos interruptores com o que já foi
    // aplicado pelo script inline no <head> (evita flash de tela clara).
    aplicarTema(localStorage.getItem('tema') === 'dark' ? 'dark' : 'light');


    // ==========================================
    // 3. MENU MOBILE (gaveta de navegação + gaveta de conta)
    // ==========================================

    const menuBtn = document.querySelector('#menu-btn');
    const dropdown = document.querySelector('#dropdown');

    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileUserBtn = document.querySelector('#mobile-user-btn');
    const mobileDrawer = document.querySelector('#mobile-drawer');
    const mobileUserDrawer = document.querySelector('#mobile-user-drawer');
    const overlay = document.querySelector('#mobile-drawer-overlay');

    // Dropdown de tema no desktop
    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        dropdown?.classList.toggle('aberto');
    });

    document.addEventListener('click', (event) => {
        if (!dropdown || !menuBtn) return;
        if (!dropdown.contains(event.target) && !menuBtn.contains(event.target)) {
            dropdown.classList.remove('aberto');
            menuBtn.classList.remove('open');
        }
    });

    function fecharGavetas() {
        mobileDrawer?.classList.remove('aberto');
        mobileUserDrawer?.classList.remove('aberto');
        overlay?.classList.remove('aberto');
        document.body.style.overflow = '';
    }

    function abrirGaveta(gaveta) {
        fecharGavetas();
        gaveta?.classList.add('aberto');
        overlay?.classList.add('aberto');
        document.body.style.overflow = 'hidden';
    }

    mobileMenuBtn?.addEventListener('click', () => abrirGaveta(mobileDrawer));
    mobileUserBtn?.addEventListener('click', () => abrirGaveta(mobileUserDrawer));
    overlay?.addEventListener('click', fecharGavetas);

    document.querySelectorAll('#mobile-drawer .drawer-link').forEach(link => {
        link.addEventListener('click', fecharGavetas);
    });


    // ==========================================
    // 4. CARROSSEL PRINCIPAL (hero) COM SWIPE E DOTS
    // ==========================================

    let carrosselIndex = 0;
    const slidesEl = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slides img').length;
    let carrosselAuto;
    let touchStartX = 0;
    let touchDeltaX = 0;
    let isDraggingCarrossel = false;

    const dotsContainer = document.getElementById('carousel-dots');

    if (dotsContainer && totalSlides > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('ativo');
            dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            dot.addEventListener('click', () => irParaSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function atualizarDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('ativo', i === carrosselIndex);
        });
    }

    function irParaSlide(n, animado = true) {
        if (!slidesEl || totalSlides === 0) return;

        carrosselIndex = (n + totalSlides) % totalSlides;

        slidesEl.style.transition = animado
            ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)'
            : 'none';

        slidesEl.style.transform = `translateX(-${carrosselIndex * 100}%)`;

        atualizarDots();
        reiniciarAuto();
    }

    function reiniciarAuto() {
        clearInterval(carrosselAuto);
        carrosselAuto = setInterval(() => irParaSlide(carrosselIndex + 1), 7000);
    }

    document.querySelector('.next')?.addEventListener('click', () => irParaSlide(carrosselIndex + 1));
    document.querySelector('.prev')?.addEventListener('click', () => irParaSlide(carrosselIndex - 1));

    const carrosselEl = document.querySelector('.carousel');

    if (carrosselEl) {

        carrosselEl.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDraggingCarrossel = true;
            slidesEl.style.transition = 'none';
        }, { passive: true });

        carrosselEl.addEventListener('touchmove', (e) => {
            if (!isDraggingCarrossel) return;
            touchDeltaX = e.touches[0].clientX - touchStartX;
            const base = -carrosselIndex * 100;
            slidesEl.style.transform = `translateX(calc(${base}% + ${touchDeltaX}px))`;
        }, { passive: true });

        carrosselEl.addEventListener('touchend', () => {
            isDraggingCarrossel = false;
            if (touchDeltaX < -50) irParaSlide(carrosselIndex + 1);
            else if (touchDeltaX > 50) irParaSlide(carrosselIndex - 1);
            else irParaSlide(carrosselIndex);
            touchDeltaX = 0;
        });
    }

    if (totalSlides > 0) reiniciarAuto();


    // ==========================================
    // 5. CARROSSEL DE FILMES (fileiras de cards)
    // ==========================================

    document.querySelectorAll('.movie-carousel').forEach(carrossel => {

        const lista = carrossel.querySelector('.movie-list');
        const anterior = carrossel.querySelector('.prev-movie');
        const proximo = carrossel.querySelector('.next-movie');

        if (!lista) return;

        proximo?.addEventListener('click', () => {
            lista.scrollBy({ left: lista.clientWidth * 0.9, behavior: 'smooth' });
        });

        anterior?.addEventListener('click', () => {
            lista.scrollBy({ left: -lista.clientWidth * 0.9, behavior: 'smooth' });
        });

    });


    // ==========================================
    // 6. LIGHTBOX DOS FILMES
    // ==========================================

    const lightbox = document.querySelector('#lightbox');
    const lightboxImg = document.querySelector('#lightbox-img');
    const btnFecharLightbox = document.querySelector('#fechar-lightbox');
    const filmes = document.querySelectorAll('.movie-card img');

    let filmeAtual = 0;

    function abrirLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        filmeAtual = index;
        lightboxImg.src = filmes[filmeAtual].src;
        lightboxImg.alt = filmes[filmeAtual].alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function fecharLightbox() {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    function proximoFilme() {
        if (filmes.length === 0) return;
        filmeAtual = (filmeAtual + 1) % filmes.length;
        lightboxImg.src = filmes[filmeAtual].src;
    }

    function filmeAnterior() {
        if (filmes.length === 0) return;
        filmeAtual = (filmeAtual - 1 + filmes.length) % filmes.length;
        lightboxImg.src = filmes[filmeAtual].src;
    }

    filmes.forEach((filme, index) => {
        filme.addEventListener('click', (e) => {
            e.preventDefault();
            abrirLightbox(index);
        });
    });

    btnFecharLightbox?.addEventListener('click', fecharLightbox);

    document.querySelector('.next-img')?.addEventListener('click', proximoFilme);
    document.querySelector('.prev-img')?.addEventListener('click', filmeAnterior);

    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox) fecharLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            fecharLightbox();
            fecharGavetas();
        }
        if (lightbox && lightbox.style.display === 'flex') {
            if (event.key === 'ArrowRight') proximoFilme();
            if (event.key === 'ArrowLeft') filmeAnterior();
        }
    });


    // ==========================================
    // 7. SCROLL REVEAL
    // ==========================================

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach(elemento => {
        revealObserver.observe(elemento);
    });

}); // fim DOMContentLoaded
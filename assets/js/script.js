// JavaScript personnalisé pour le portfolio

// Gestion des animations de présentation
function initAnimatedPresentation() {
    const titleElement = document.getElementById('animatedTitle');
    const descriptionElement = document.getElementById('animatedDescription');
    
    if (!titleElement || !descriptionElement) return;
    
    const originalTitle = titleElement.textContent;
    const originalDescription = descriptionElement.textContent;
    
    // Vider les éléments au départ
    titleElement.textContent = '';
    descriptionElement.textContent = '';
    
    // Début après 2.5s (fin du loading)
    let startDelay = 2500;
    
    // Animer le titre
    setTimeout(() => {
        typeWriter(titleElement, originalTitle, 50, () => {
            // Animer la description après le titre
            setTimeout(() => {
                typeWriter(descriptionElement, originalDescription, 20);
            }, 500);
        });
    }, startDelay);
}

function typeWriter(element, text, speed = 50, callback = null) {
    let index = 0;
    element.style.opacity = '1';
    element.style.borderRight = '3px solid rgba(255, 255, 255, 0.8)';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            element.style.borderRight = 'none';
            if (callback) callback();
        }
    }
    
    type();
}

// Gestion du Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Masquer le loading screen après 2.5 secondes
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2500);
    
    // Alternative : masquer au moment où tout est vraiment chargé
    window.addEventListener('load', function() {
        // S'assurer que le loading est masqué
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    });
}

// Gestion du changement de thème
function initThemeManager() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const themeSelectorToggle = document.getElementById('themeSelectorToggle');
    const themeSelectorMenu = document.getElementById('themeSelectorMenu');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'blue';
    
    // Appliquer le thème sauvegardé au chargement
    applyTheme(savedTheme);
    updateThemeButtonState(savedTheme);
    
    // Gestion du toggle du menu de thème
    if (themeSelectorToggle && themeSelectorMenu) {
        themeSelectorToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            themeSelectorMenu.classList.toggle('show');
        });
        
        // Fermer le menu au clic sur un thème
        themeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                localStorage.setItem('portfolio-theme', theme);
                updateThemeButtonState(theme);
                themeSelectorMenu.classList.remove('show');
            });
        });
        
        // Fermer le menu au clic en dehors
        document.addEventListener('click', function(e) {
            if (!themeSelectorToggle.contains(e.target) && !themeSelectorMenu.contains(e.target)) {
                themeSelectorMenu.classList.remove('show');
            }
        });
    } else {
        // Fallback si les éléments ne sont pas trouvés
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                localStorage.setItem('portfolio-theme', theme);
                updateThemeButtonState(theme);
            });
        });
    }
}

function applyTheme(theme) {
    const body = document.body;
    
    // Supprimer tous les thèmes
    body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-black');
    
    // Ajouter le thème sélectionné
    if (theme !== 'blue') {
        body.classList.add(`theme-${theme}`);
    }
}

function updateThemeButtonState(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le loading screen
    initLoadingScreen();
    // Initialiser les animations de présentation
    initAnimatedPresentation();
    // Initialiser le gestionnaire de thème
    initThemeManager();
    
    // Smooth scrolling pour la navigation
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ne pas prévenir le comportement par défaut pour les liens de thème
            if (!this.getAttribute('href').startsWith('#')) return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Ajustement pour la navbar fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Fermer le menu mobile si ouvert
                const navbarToggle = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggle.click();
                }
            }
        });
    });
    
    // Détection de la section active lors du scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Mettre à jour les liens actifs
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observer les cartes pour l'animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        observer.observe(card);
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci pour votre message ! Je vous répondrai bientôt.');
            this.reset();
        });
    }
});
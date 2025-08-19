// Main Application Entry Point
class App {
    constructor() {
        this.threeManager = new ThreeJSManager();
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupResponsive();
        this.startApp();
    }

    setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        const loader = document.querySelector('.loader');

        // Simulate loading
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoaded = true;
                this.init3DExperience();
            }, 500);
        }, 2000);
    }

    init3DExperience() {
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            this.threeManager.init('three-container');
            this.threeManager.createHumanModel();
            this.threeManager.createParticleSystem();
            this.threeManager.createGrid();
            this.threeManager.animate();
        }

        const demoCanvas = document.getElementById('demo-canvas');
        if (demoCanvas) {
            this.threeManager.init('demo-canvas');
            this.threeManager.createHumanModel();
            this.threeManager.animate();
        }
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            if (this.isLoaded) {
                const threeContainer = document.getElementById('three-container');
                const demoCanvas = document.getElementById('demo-canvas');
                
                if (threeContainer) {
                    this.threeManager.onWindowResize(threeContainer);
                }
                if (demoCanvas) {
                    this.threeManager.onWindowResize(demoCanvas);
                }
            }
        });
    }

    startApp() {
        console.log('3D Body Language Decoder App Started');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

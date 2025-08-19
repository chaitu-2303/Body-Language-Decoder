// Advanced Animation System
class AnimationManager {
    constructor(threeManager) {
        this.threeManager = threeManager;
        this.animations = new Map();
        this.timeline = gsap.timeline();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupGestureAnimations();
        this.setupParticleAnimations();
    }

    setupScrollAnimations() {
        const scrollTrigger = (element, animation) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animation(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(element);
        };

        // Animate feature cards
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            scrollTrigger(card, (element) => {
                gsap.fromTo(element, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, delay: index * 0.1, ease: "power2.out" }
                );
            });
        });

        // Animate section titles
        document.querySelectorAll('.section-title').forEach(title => {
            scrollTrigger(title, (element) => {
                gsap.fromTo(element,
                    { y: -30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
                );
            });
        });
    }

    setupHoverEffects() {
        // 3D hover effect for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -10,
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    scale: 1,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    ease: "power2.out"
                });
            });
        });

        // Button hover effects
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    x: 5,
                    backgroundColor: "#6366f1",
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.2,
                    x: 0,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    ease: "power2.out"
                });
            });
        });
    }

    setupGestureAnimations() {
        document.addEventListener('gestureDetected', (event) => {
            const { gesture } = event.detail;
            this.playGestureAnimation(gesture);
        });
    }

    playGestureAnimation(gestureType) {
        const humanModel = this.threeManager.meshes.find(mesh => mesh.type === 'Group');
        if (!humanModel) return;

        switch(gestureType) {
            case 'wave':
                this.animateWave(humanModel);
                break;
            case 'point':
                this.animatePoint(humanModel);
                break;
            case 'thumbsUp':
                this.animateThumbsUp(humanModel);
                break;
            case 'peace':
                this.animatePeace(humanModel);
                break;
        }
    }

    animateWave(model) {
        const rightArm = model.children.find(child => 
            child.position.x > 0 && child.geometry.type === 'CapsuleGeometry'
        );

        if (rightArm) {
            gsap.timeline()
                .to(rightArm.rotation, { z: -Math.PI / 3, duration: 0.5, ease: "power2.inOut" })
                .to(rightArm.rotation, { z: 0, duration: 0.5, ease: "power2.inOut" })
                .to(rightArm.rotation, { z: -Math.PI / 3, duration: 0.5, ease: "power2.inOut" })
                .to(rightArm.rotation, { z: 0, duration: 0.5, ease: "power2.inOut" });
        }
    }

    animatePoint(model) {
        const rightArm = model.children.find(child => 
            child.position.x > 0 && child.geometry.type === 'CapsuleGeometry'
        );

        if (rightArm) {
            gsap.to(rightArm.rotation, {
                z: -Math.PI / 2,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }

    animateThumbsUp(model) {
        // Create thumbs up animation
        const leftArm = model.children.find(child => 
            child.position.x < 0 && child.geometry.type === 'CapsuleGeometry'
        );

        if (leftArm) {
            gsap.to(leftArm.rotation, {
                z: Math.PI / 2,
                duration: 0.6,
                ease: "back.out(1.7)"
            });
        }
    }

    animatePeace(model) {
        // Create peace sign animation
        const bothArms = model.children.filter(child => 
            child.geometry.type === 'CapsuleGeometry' && 
            Math.abs(child.position.x) > 0.5
        );

        bothArms.forEach((arm, index) => {
            const direction = arm.position.x > 0 ? -1 : 1;
            gsap.to(arm.rotation, {
                z: direction * Math.PI / 3,
                duration: 0.7,
                delay: index * 0.1,
                ease: "elastic.out(1, 0.5)"
            });
        });
    }

    setupParticleAnimations() {
        // Create floating particles
        this.createFloatingParticles();
        
        // Create background animation
        this.createBackgroundAnimation();
    }

    createFloatingParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            gsap.to(particle, {
                y: -window.innerHeight - 100,
                x: "random(-100, 100)",
                duration: "random(10, 20)",
                delay: index * 0.1,
                repeat: -1,
                ease: "none"
            });
        });
    }

    createBackgroundAnimation() {
        // Animate background gradient
        gsap.to('body', {
            backgroundPosition: "200% 200%",
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    }

    animateIn(element, animationType = 'fadeInUp') {
        const animations = {
            fadeInUp: {
                from: { y: 50, opacity: 0 },
                to: { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            },
            slideInLeft: {
                from: { x: -100, opacity: 0 },
                to: { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            },
            slideInRight: {
                from: { x: 100, opacity: 0 },
                to: { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            },
            zoomIn: {
                from: { scale: 0.5, opacity: 0 },
                to: { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
            }
        };

        const config = animations[animationType] || animations.fadeInUp;
        gsap.fromTo(element, config.from, config.to);
    }

    animateOut(element, animationType = 'fadeOutDown') {
        const animations = {
            fadeOutDown: {
                to: { y: 50, opacity: 0, duration: 0.4, ease: "power2.in" }
            },
            slideOutLeft: {
                to: { x: -100, opacity: 0, duration: 0.4, ease: "power2.in" }
            },
            slideOutRight: {
                to: { x: 100, opacity: 0, duration: 0.4, ease: "power2.in" }
            },
            zoomOut: {
                to: { scale: 0.5, opacity: 0, duration: 0.4, ease: "power2.in" }
            }
        };

        const config = animations[animationType] || animations.fadeOutDown;
        gsap.to(element, config.to);
    }

    createTimeline() {
        return gsap.timeline();
    }

    addAnimation(name, animation) {
        this.animations.set(name, animation);
    }

    playAnimation(name, ...args) {
        const animation = this.animations.get(name);
        if (animation) {
            animation(...args);
        }
    }

    stopAllAnimations() {
        gsap.killTweensOf('*');
    }

    destroy() {
        this.stopAllAnimations();
        this.animations.clear();
    }
}

// Export for use in other modules
window.AnimationManager = AnimationManager;

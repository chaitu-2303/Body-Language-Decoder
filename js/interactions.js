// User Interactions and Controls
class InteractionManager {
    constructor(threeManager) {
        this.threeManager = threeManager;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isMouseDown = false;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
        this.setupGestureControls();
    }

    setupMouseEvents() {
        const canvas = this.threeManager.renderer.domElement;

        canvas.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });

        canvas.addEventListener('mousedown', (event) => {
            this.onMouseDown(event);
        });

        canvas.addEventListener('mouseup', (event) => {
            this.onMouseUp(event);
        });

        canvas.addEventListener('wheel', (event) => {
            this.onMouseWheel(event);
        });

        canvas.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
    }

    setupTouchEvents() {
        const canvas = this.threeManager.renderer.domElement;

        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.onTouchStart(event);
        });

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            this.onTouchMove(event);
        });

        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.onTouchEnd(event);
        });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event);
        });

        document.addEventListener('keyup', (event) => {
            this.onKeyUp(event);
        });
    }

    setupGestureControls() {
        // Gesture recognition for body language simulation
        this.gestures = {
            wave: false,
            point: false,
            thumbsUp: false,
            peace: false
        };
    }

    onMouseMove(event) {
        const rect = event.target.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (this.isDragging) {
            this.handleDrag(event);
        }

        this.updateRaycaster();
    }

    onMouseDown(event) {
        this.isMouseDown = true;
        this.isDragging = false;
        this.dragStart = { x: event.clientX, y: event.clientY };
    }

    onMouseUp(event) {
        this.isMouseDown = false;
        if (!this.isDragging) {
            this.handleClick(event);
        }
        this.isDragging = false;
    }

    onMouseWheel(event) {
        event.preventDefault();
        const delta = event.deltaY * 0.01;
        this.threeManager.camera.position.z += delta;
        this.threeManager.camera.position.z = Math.max(2, Math.min(10, this.threeManager.camera.position.z));
    }

    onMouseClick(event) {
        this.handleClick(event);
    }

    onTouchStart(event) {
        const touch = event.touches[0];
        this.isMouseDown = true;
        this.dragStart = { x: touch.clientX, y: touch.clientY };
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        if (this.isMouseDown) {
            const deltaX = touch.clientX - this.dragStart.x;
            const deltaY = touch.clientY - this.dragStart.y;
            
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                this.isDragging = true;
                this.handleDrag({ clientX: touch.clientX, clientY: touch.clientY });
            }
        }
    }

    onTouchEnd(event) {
        this.isMouseDown = false;
        this.isDragging = false;
    }

    onKeyDown(event) {
        const moveSpeed = 0.1;
        const rotateSpeed = 0.05;

        switch(event.key) {
            case 'ArrowUp':
                this.threeManager.camera.position.y += moveSpeed;
                break;
            case 'ArrowDown':
                this.threeManager.camera.position.y -= moveSpeed;
                break;
            case 'ArrowLeft':
                this.threeManager.camera.position.x -= moveSpeed;
                break;
            case 'ArrowRight':
                this.threeManager.camera.position.x += moveSpeed;
                break;
            case 'w':
                this.threeManager.camera.rotation.x -= rotateSpeed;
                break;
            case 's':
                this.threeManager.camera.rotation.x += rotateSpeed;
                break;
            case 'a':
                this.threeManager.camera.rotation.y -= rotateSpeed;
                break;
            case 'd':
                this.threeManager.camera.rotation.y += rotateSpeed;
                break;
            case ' ':
                event.preventDefault();
                this.resetCamera();
                break;
        }
    }

    onKeyUp(event) {
        // Handle key release if needed
    }

    handleDrag(event) {
        const deltaX = event.clientX - this.dragStart.x;
        const deltaY = event.clientY - this.dragStart.y;

        this.threeManager.camera.rotation.y += deltaX * 0.01;
        this.threeManager.camera.rotation.x += deltaY * 0.01;

        this.dragStart = { x: event.clientX, y: event.clientY };
    }

    handleClick(event) {
        this.updateRaycaster();
        
        const intersects = this.raycaster.intersectObjects(this.threeManager.meshes, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.handleObjectClick(object);
        }
    }

    updateRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.threeManager.camera);
    }

    handleObjectClick(object) {
        // Add click effects
        const originalColor = object.material.color.getHex();
        object.material.color.setHex(0xff0000);
        
        setTimeout(() => {
            object.material.color.setHex(originalColor);
        }, 200);

        // Trigger gesture recognition
        this.triggerGestureAnimation('wave');
    }

    resetCamera() {
        this.threeManager.camera.position.set(0, 0, 5);
        this.threeManager.camera.rotation.set(0, 0, 0);
    }

    triggerGestureAnimation(gestureType) {
        const event = new CustomEvent('gestureDetected', {
            detail: { gesture: gestureType }
        });
        document.dispatchEvent(event);
    }

    simulateGesture(gestureType) {
        switch(gestureType) {
            case 'wave':
                this.animateWave();
                break;
            case 'point':
                this.animatePoint();
                break;
            case 'thumbsUp':
                this.animateThumbsUp();
                break;
            case 'peace':
                this.animatePeace();
                break;
        }
    }

    animateWave() {
        const humanModel = this.threeManager.meshes.find(mesh => mesh.type === 'Group');
        if (humanModel) {
            const rightArm = humanModel.children.find(child => 
                child.position.x > 0 && child.geometry.type === 'CapsuleGeometry'
            );
            
            if (rightArm) {
                gsap.to(rightArm.rotation, {
                    duration: 0.5,
                    z: -Math.PI / 3,
                    yoyo: true,
                    repeat: 3,
                    ease: "power2.inOut"
                });
            }
        }
    }

    animatePoint() {
        const humanModel = this.threeManager.meshes.find(mesh => mesh.type === 'Group');
        if (humanModel) {
            const rightArm = humanModel.children.find(child => 
                child.position.x > 0 && child.geometry.type === 'CapsuleGeometry'
            );
            
            if (rightArm) {
                gsap.to(rightArm.rotation, {
                    duration: 0.8,
                    z: -Math.PI / 2,
                    ease: "power2.out"
                });
            }
        }
    }

    animateThumbsUp() {
        // Similar animation for thumbs up gesture
        console.log('Thumbs up gesture simulated');
    }

    animatePeace() {
        // Similar animation for peace gesture
        console.log('Peace gesture simulated');
    }
}

// Export for use in other modules
window.InteractionManager = InteractionManager;

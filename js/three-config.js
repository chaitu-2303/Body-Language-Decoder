// Three.js Configuration and Setup
class ThreeJSManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.meshes = [];
        this.animationId = null;
        this.isInitialized = false;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add renderer to DOM
        container.appendChild(this.renderer.domElement);

        // Lighting setup
        this.setupLighting();

        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize(container));

        this.isInitialized = true;
        console.log('Three.js initialized successfully');
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light
        const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    }

    createHumanModel() {
        // Create a simplified human figure
        const group = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 2, 8, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x6366f1,
            transparent: true,
            opacity: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffdbac,
            transparent: true,
            opacity: 0.9
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.3;
        head.castShadow = true;
        group.add(head);

        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.15, 1.2, 8, 16);
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffdbac,
            transparent: true,
            opacity: 0.8
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.7, 0.2, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.7, 0.2, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        group.add(rightArm);

        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.2, 1.5, 8, 16);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2d3748,
            transparent: true,
            opacity: 0.8
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, -1.5, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, -1.5, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        group.position.y = 1;
        this.scene.add(group);
        this.meshes.push(group);

        return group;
    }

    createParticleSystem() {
        const particles = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            colors[i * 3] = Math.random();
            colors[i * 3 + 1] = Math.random();
            colors[i * 3 + 2] = Math.random();
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        return particleSystem;
    }

    createGrid() {
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        gridHelper.position.y = -2;
        this.scene.add(gridHelper);
    }

    animate() {
        if (!this.isInitialized) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Rotate human model
        this.meshes.forEach(mesh => {
            if (mesh.rotation) {
                mesh.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(container) {
        if (!this.isInitialized) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.meshes.forEach(mesh => {
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Export for use in other modules
window.ThreeJSManager = ThreeJSManager;

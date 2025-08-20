// 3D visualization for training page
class ThreeTraining {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.trainingModel = null;
        this.lossCurve = null;
        this.accuracyCurve = null;
        this.neuralNetwork = null;
        this.dataParticles = [];
        this.init();
    }

    init() {
        this.setupScene();
        this.createTrainingVisualization();
        this.animate();
    }

    setupScene() {
        const container = document.getElementById('training-3d-model');
        if (!container) return;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Grid
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        this.scene.add(gridHelper);
    }

    createTrainingVisualization() {
        // Create neural network visualization
        this.createNeuralNetwork();
        this.createMetricsVisualization();
        this.createDataFlowVisualization();
    }

    createNeuralNetwork() {
        const networkGroup = new THREE.Group();
        
        // Input layer
        const inputLayer = this.createLayer(3, 0xff0000, -2, 0);
        networkGroup.add(inputLayer);
        
        // Hidden layers
        const hiddenLayer1 = this.createLayer(5, 0x00ff00, 0, 0);
        networkGroup.add(hiddenLayer1);
        
        const hiddenLayer2 = this.createLayer(4, 0x0000ff, 1, 0);
        networkGroup.add(hiddenLayer2);
        
        // Output layer
        const outputLayer = this.createLayer(2, 0xffff00, 2, 0);
        networkGroup.add(outputLayer);
        
        // Create connections
        this.createConnections(inputLayer, hiddenLayer1);
        this.createConnections(hiddenLayer1, hiddenLayer2);
        this.createConnections(hiddenLayer2, outputLayer);
        
        this.scene.add(networkGroup);
        this.neuralNetwork = networkGroup;
    }

    createLayer(nodeCount, color, x, y) {
        const layer = new THREE.Group();
        for (let i = 0; i < nodeCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 16, 16);
            const material = new THREE.MeshPhongMaterial({ color: color });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(x, y + (i - nodeCount/2) * 0.3, 0);
            layer.add(sphere);
        }
        return layer;
    }

    createConnections(fromLayer, toLayer) {
        const connections = new THREE.Group();
        fromLayer.children.forEach(fromNode => {
            toLayer.children.forEach(toNode => {
                const points = [
                    fromNode.position,
                    toNode.position
                ];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.3 });
                const line = new THREE.Line(geometry, material);
                connections.add(line);
            });
        });
        this.scene.add(connections);
    }

    createMetricsVisualization() {
        // Create loss curve
        const lossGeometry = new THREE.BufferGeometry();
        const lossPositions = [];
        for (let i = 0; i < 100; i++) {
            const x = (i / 100) * 4 - 2;
            const y = Math.exp(-x * x) * 2;
            lossPositions.push(x, y, 0);
        }
        
        const lossMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.lossCurve = new THREE.Line(lossGeometry, lossMaterial);
        this.lossCurve.position.set(-3, 2, 0);
        this.scene.add(this.lossCurve);

        // Create accuracy curve
        const accuracyGeometry = new THREE.BufferGeometry();
        const accuracyPositions = [];
        for (let i = 0; i < 100; i++) {
            const x = (i / 100) * 4 - 2;
            const y = 1 - Math.exp(-x * x);
            accuracyPositions.push(x, y * 2, 0);
        }
        
        const accuracyMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.accuracyCurve = new THREE.Line(accuracyGeometry, accuracyMaterial);
        this.accuracyCurve.position.set(-3, 0, 0);
        this.scene.add(this.accuracyCurve);
    }

    createDataFlowVisualization() {
        // Create data particles
        const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        
        this.dataParticles = [];
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2
            );
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                )
            };
            this.scene.add(particle);
            this.dataParticles.push(particle);
        }
    }

    updateTrainingProgress(epoch, loss, accuracy) {
        if (!this.neuralNetwork) return;
        
        // Update neural network visualization
        this.neuralNetwork.children.forEach(layer => {
            layer.children.forEach(node => {
                if (node.userData.type === 'neuron') {
                    const scale = 0.1 + (loss * 0.1);
                    gsap.to(node.scale, {
                        x: scale,
                        y: scale,
                        z: scale,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        });
        
        // Update metrics curves
        this.updateMetricsCurves(epoch, loss, accuracy);
    }

    updateMetricsCurves(epoch, loss, accuracy) {
        if (!this.lossCurve || !this.accuracyCurve) return;
        
        // Update loss curve
        const lossPositions = [];
        for (let i = 0; i <= epoch; i++) {
            const x = (i / 50) * 4 - 2;
            const y = Math.max(0.01, loss * (1 - i / 50)) * 2;
            lossPositions.push(x, y, 0);
        }
        
        const lossGeometry = new THREE.BufferGeometry();
        lossGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lossPositions, 3));
        this.lossCurve.geometry.dispose();
        this.lossCurve.geometry = lossGeometry;
        
        // Update accuracy curve
        const accuracyPositions = [];
        for (let i = 0; i <= epoch; i++) {
            const x = (i / 50) * 4 - 2;
            const y = Math.min(0.99, accuracy * (i / 50)) * 2;
            accuracyPositions.push(x, y, 0);
        }
        
        const accuracyGeometry = new THREE.BufferGeometry();
        accuracyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(accuracyPositions, 3));
        this.accuracyCurve.geometry.dispose();
        this.accuracyCurve.geometry = accuracyGeometry;
    }

    setupControls() {
        let mouseX = 0;
        let mouseY = 0;

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            gsap.to(this.camera.position, {
                x: mouseX * 3,
                y: mouseY * 3 + 2,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        // Touch controls for mobile
        this.renderer.domElement.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            gsap.to(this.camera.position, {
                x: mouseX * 3,
                y: mouseY * 3 + 2,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate data particles
        this.dataParticles.forEach(particle => {
            particle.position.add(particle.userData.velocity);
            
            // Bounce off boundaries
            if (Math.abs(particle.position.x) > 2) {
                particle.userData.velocity.x *= -1;
            }
            if (Math.abs(particle.position.y) > 2) {
                particle.userData.velocity.y *= -1;
            }
            if (Math.abs(particle.position.z) > 2) {
                particle.userData.velocity.z *= -1;
            }
        });
        
        // Rotate the neural network
        if (this.neuralNetwork) {
            this.neuralNetwork.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const container = document.getElementById('training-3d-model');
        if (container && this.renderer) {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
}

// Initialize 3D training when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.threeTraining = new ThreeTraining();
});

window.addEventListener('resize', () => {
    if (window.threeTraining) {
        window.threeTraining.resize();
    }
});

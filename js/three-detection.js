// 3D visualization for detection page
class ThreeDetection {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.poseModel = null;
        this.bones = [];
        this.init();
    }

    init() {
        this.setupScene();
        this.createPoseModel();
        this.animate();
    }

    setupScene() {
        const container = document.getElementById('pose-3d-model');
        if (!container) return;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1, 3);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Controls
        this.setupControls();
    }

    createPoseModel() {
        // Create a simple humanoid figure
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

        // Key joints
        const joints = [
            { name: 'nose', position: [0, 1.7, 0] },
            { name: 'left_shoulder', position: [-0.3, 1.5, 0] },
            { name: 'right_shoulder', position: [0.3, 1.5, 0] },
            { name: 'left_elbow', position: [-0.5, 1.2, 0] },
            { name: 'right_elbow', position: [0.5, 1.2, 0] },
            { name: 'left_wrist', position: [-0.7, 0.9, 0] },
            { name: 'right_wrist', position: [0.7, 0.9, 0] },
            { name: 'left_hip', position: [-0.2, 1.0, 0] },
            { name: 'right_hip', position: [0.2, 1.0, 0] },
            { name: 'left_knee', position: [-0.2, 0.5, 0] },
            { name: 'right_knee', position: [0.2, 0.5, 0] },
            { name: 'left_ankle', position: [-0.2, 0.1, 0] },
            { name: 'right_ankle', position: [0.2, 0.1, 0] }
        ];

        this.bones = [];
        joints.forEach(joint => {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(...joint.position);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            sphere.name = joint.name;
            this.scene.add(sphere);
            this.bones.push(sphere);
        });

        // Create connecting lines
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
        const connections = [
            ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
            ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
            ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
            ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
            ['left_hip', 'right_hip'], ['left_hip', 'left_knee'],
            ['left_knee', 'left_ankle'], ['right_hip', 'right_knee'],
            ['right_knee', 'right_ankle']
        ];

        connections.forEach(([from, to]) => {
            const fromJoint = this.bones.find(b => b.name === from);
            const toJoint = this.bones.find(b => b.name === to);
            
            if (fromJoint && toJoint) {
                const points = [fromJoint.position, toJoint.position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                line.name = `${from}-${to}`;
                this.scene.add(line);
            }
        });
    }

    updatePose(poseData) {
        if (!poseData || !poseData.keypoints) return;

        // Map pose detection keypoints to 3D positions
        const keypointMap = {
            'nose': poseData.keypoints.find(kp => kp.name === 'nose'),
            'left_shoulder': poseData.keypoints.find(kp => kp.name === 'left_shoulder'),
            'right_shoulder': poseData.keypoints.find(kp => kp.name === 'right_shoulder'),
            'left_elbow': poseData.keypoints.find(kp => kp.name === 'left_elbow'),
            'right_elbow': poseData.keypoints.find(kp => kp.name === 'right_elbow'),
            'left_wrist': poseData.keypoints.find(kp => kp.name === 'left_wrist'),
            'right_wrist': poseData.keypoints.find(kp => kp.name === 'right_wrist'),
            'left_hip': poseData.keypoints.find(kp => kp.name === 'left_hip'),
            'right_hip': poseData.keypoints.find(kp => kp.name === 'right_hip'),
            'left_knee': poseData.keypoints.find(kp => kp.name === 'left_knee'),
            'right_knee': poseData.keypoints.find(kp => kp.name === 'right_knee'),
            'left_ankle': poseData.keypoints.find(kp => kp.name === 'left_ankle'),
            'right_ankle': poseData.keypoints.find(kp => kp.name === 'right_ankle')
        };

        // Update 3D positions based on 2D keypoints
        Object.entries(keypointMap).forEach(([name, keypoint]) => {
            if (keypoint && keypoint.score > 0.3) {
                const bone = this.bones.find(b => b.name === name);
                if (bone) {
                    // Convert 2D coordinates to 3D (simplified mapping)
                    const x = (keypoint.x - 320) / 100;
                    const y = (240 - keypoint.y) / 100 + 1;
                    const z = 0;
                    
                    // Smooth transition
                    gsap.to(bone.position, {
                        x: x,
                        y: y,
                        z: z,
                        duration: 0.1,
                        ease: "power2.out"
                    });
                }
            }
        });

        // Update connecting lines
        this.updateConnectingLines();
    }

    updateConnectingLines() {
        const connections = this.scene.children.filter(child => child.type === 'Line');
        connections.forEach(line => {
            const [from, to] = line.name.split('-');
            const fromJoint = this.bones.find(b => b.name === from);
            const toJoint = this.bones.find(b => b.name === to);
            
            if (fromJoint && toJoint) {
                const points = [fromJoint.position, toJoint.position];
                line.geometry.setFromPoints(points);
                line.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    setupControls() {
        let mouseX = 0;
        let mouseY = 0;

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            gsap.to(this.camera.position, {
                x: mouseX * 2,
                y: mouseY * 2 + 1,
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
                y: mouseY * 3 + 1,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate the entire scene slightly
        this.scene.rotation.y += 0.005;
        
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const container = document.getElementById('pose-3d-model');
        if (container && this.renderer) {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
}

// Initialize 3D detection when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.threeDetection = new ThreeDetection();
});

window.addEventListener('resize', () => {
    if (window.threeDetection) {
        window.threeDetection.resize();
    }
});

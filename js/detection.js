// Detection page specific functionality
class DetectionManager {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.detector = null;
        this.isDetecting = false;
        this.poseData = [];
        this.init();
    }

    async init() {
        this.setupElements();
        this.setupEventListeners();
        await this.loadPoseDetector();
    }

    setupElements() {
        this.video = document.getElementById('webcam');
        this.canvas = document.getElementById('pose-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        document.getElementById('start-camera').addEventListener('click', () => this.startCamera());
        document.getElementById('stop-camera').addEventListener('click', () => this.stopCamera());
        document.getElementById('toggle-3d').addEventListener('click', () => this.toggle3DView());
        document.getElementById('save-pose').addEventListener('click', () => this.savePose());
        
        // Settings
        document.getElementById('confidence-threshold').addEventListener('input', (e) => {
            document.getElementById('confidence-value').textContent = Math.round(e.target.value * 100) + '%';
        });
    }

    async loadPoseDetector() {
        try {
            const model = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableSmoothing: true,
                minPoseScore: 0.3
            };
            this.detector = await poseDetection.createDetector(model, detectorConfig);
            console.log('Pose detector loaded successfully');
        } catch (error) {
            console.error('Error loading pose detector:', error);
        }
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            this.video.srcObject = stream;
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.startDetection();
            };
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please check permissions.');
        }
    }

    stopCamera() {
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.isDetecting = false;
            this.updateStatus('Stopped');
        }
    }

    async startDetection() {
        this.isDetecting = true;
        this.updateStatus('Detecting...');
        
        while (this.isDetecting) {
            await this.detectPose();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async detectPose() {
        if (!this.detector || !this.video) return;

        try {
            const poses = await this.detector.estimatePoses(this.video);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.video, 0, 0);
            
            if (poses.length > 0) {
                const pose = poses[0];
                this.drawPose(pose);
                this.updatePoseInfo(pose);
                this.update3DModel(pose);
            }
        } catch (error) {
            console.error('Error detecting pose:', error);
        }
    }

    drawPose(pose) {
        const keypoints = pose.keypoints;
        const threshold = parseFloat(document.getElementById('confidence-threshold').value);
        
        // Draw skeleton
        if (document.getElementById('show-skeleton').checked) {
            this.drawSkeleton(keypoints, threshold);
        }
        
        // Draw landmarks
        if (document.getElementById('show-landmarks').checked) {
            this.drawLandmarks(keypoints, threshold);
        }
    }

    drawSkeleton(keypoints, threshold) {
        const connections = [
            ['left_shoulder', 'right_shoulder'],
            ['left_shoulder', 'left_elbow'],
            ['left_elbow', 'left_wrist'],
            ['right_shoulder', 'right_elbow'],
            ['right_elbow', 'right_wrist'],
            ['left_shoulder', 'left_hip'],
            ['right_shoulder', 'right_hip'],
            ['left_hip', 'right_hip'],
            ['left_hip', 'left_knee'],
            ['left_knee', 'left_ankle'],
            ['right_hip', 'right_knee'],
            ['right_knee', 'right_ankle']
        ];

        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;

        connections.forEach(([from, to]) => {
            const fromPoint = keypoints.find(kp => kp.name === from);
            const toPoint = keypoints.find(kp => kp.name === to);
            
            if (fromPoint && toPoint && fromPoint.score > threshold && toPoint.score > threshold) {
                this.ctx.beginPath();
                this.ctx.moveTo(fromPoint.x, fromPoint.y);
                this.ctx.lineTo(toPoint.x, toPoint.y);
                this.ctx.stroke();
            }
        });
    }

    drawLandmarks(keypoints, threshold) {
        this.ctx.fillStyle = '#ff0000';
        
        keypoints.forEach(keypoint => {
            if (keypoint.score > threshold) {
                this.ctx.beginPath();
                this.ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
    }

    updatePoseInfo(pose) {
        const avgConfidence = pose.keypoints.reduce((sum, kp) => sum + kp.score, 0) / pose.keypoints.length;
        
        document.getElementById('pose-confidence').textContent = (avgConfidence * 100).toFixed(1) + '%';
        document.getElementById('key-points-count').textContent = pose.keypoints.filter(kp => kp.score > 0.3).length;
    }

    update3DModel(pose) {
        // This will be handled by three-detection.js
        if (window.threeDetection) {
            window.threeDetection.updatePose(pose);
        }
    }

    toggle3DView() {
        const container3d = document.getElementById('detection-3d-container');
        container3d.style.display = container3d.style.display === 'none' ? 'block' : 'none';
    }

    savePose() {
        if (this.poseData.length > 0) {
            const pose = this.poseData[this.poseData.length - 1];
            const dataStr = JSON.stringify(pose, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `pose-${Date.now()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        }
    }

    updateStatus(status) {
        document.getElementById('detection-status').textContent = status;
    }
}

// Initialize detection when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DetectionManager();
});

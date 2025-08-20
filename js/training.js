// Training page specific functionality
class TrainingManager {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.trainingData = [];
        this.model = null;
        this.isTraining = false;
        this.trainingProgress = 0;
        this.currentEpoch = 0;
        this.totalEpochs = 50;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupChart();
    }

    setupElements() {
        this.video = document.getElementById('training-webcam');
        this.canvas = document.getElementById('training-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        document.getElementById('start-training').addEventListener('click', () => this.startTraining());
        document.getElementById('pause-training').addEventListener('click', () => this.pauseTraining());
        document.getElementById('reset-model').addEventListener('click', () => this.resetModel());
        document.getElementById('save-model').addEventListener('click', () => this.saveModel());
        
        document.getElementById('start-capture').addEventListener('click', () => this.startCapture());
        document.getElementById('stop-capture').addEventListener('click', () => this.stopCapture());
        
        // Settings
        document.getElementById('learning-rate').addEventListener('input', (e) => {
            document.getElementById('learning-rate-value').textContent = e.target.value;
        });
        
        document.getElementById('batch-size').addEventListener('input', (e) => {
            document.getElementById('batch-size-value').textContent = e.target.value;
        });
        
        document.getElementById('epochs').addEventListener('input', (e) => {
            this.totalEpochs = parseInt(e.target.value);
            document.getElementById('epochs-value').textContent = e.target.value;
            document.getElementById('total-epochs').textContent = e.target.value;
        });
        
        // File upload
        document.getElementById('training-data-upload').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
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
            };
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera. Please check permissions.');
        }
    }

    async startCapture() {
        await this.startCamera();
        this.isCapturing = true;
        this.capturePoses();
    }

    stopCapture() {
        this.isCapturing = false;
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    async capturePoses() {
        // This would integrate with pose detection
        // For now, we'll simulate pose capture
        while (this.isCapturing) {
            const poseData = {
                timestamp: Date.now(),
                pose: this.generateRandomPose(),
                label: 'training-pose'
            };
            
            this.trainingData.push(poseData);
            this.updateTrainingDataDisplay();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    generateRandomPose() {
        // Simulate pose data
        return {
            keypoints: Array.from({ length: 17 }, (_, i) => ({
                x: Math.random() * 640,
                y: Math.random() * 480,
                score: Math.random(),
                name: `keypoint-${i}`
            }))
        };
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.trainingData = this.trainingData.concat(data);
                    this.updateTrainingDataDisplay();
                } catch (error) {
                    console.error('Error parsing file:', error);
                }
            };
            reader.readAsText(file);
        });
    }

    updateTrainingDataDisplay() {
        const container = document.getElementById('uploaded-files-list');
        container.innerHTML = `
            <p>Total training samples: ${this.trainingData.length}</p>
            <button onclick="trainingManager.exportTrainingData()">Export Training Data</button>
        `;
    }

    async startTraining() {
        if (this.trainingData.length === 0) {
            alert('Please add training data first');
            return;
        }

        this.isTraining = true;
        this.currentEpoch = 0;
        this.trainingProgress = 0;
        
        // Simulate training process
        this.simulateTraining();
    }

    simulateTraining() {
        const interval = setInterval(() => {
            if (this.currentEpoch >= this.totalEpochs || !this.isTraining) {
                clearInterval(interval);
                this.isTraining = false;
                return;
            }

            this.currentEpoch++;
            this.trainingProgress = (this.currentEpoch / this.totalEpochs) * 100;
            
            // Simulate loss and accuracy
            const loss = Math.max(0.1, 1 - (this.currentEpoch / this.totalEpochs) * 0.9);
            const accuracy = Math.min(0.95, (this.currentEpoch / this.totalEpochs) * 0.9);
            
            this.updateTrainingProgress(loss, accuracy);
            this.updateChart(loss, accuracy);
            
            // Update 3D visualization
            if (window.threeTraining) {
                window.threeTraining.updateTrainingProgress(this.currentEpoch, loss, accuracy);
            }
        }, 500);
    }

    pauseTraining() {
        this.isTraining = false;
    }

    resetModel() {
        this.trainingData = [];
        this.currentEpoch = 0;
        this.trainingProgress = 0;
        this.updateTrainingProgress(0, 0);
        this.updateTrainingDataDisplay();
    }

    saveModel() {
        const modelData = {
            trainingData: this.trainingData,
            modelConfig: {
                learningRate: document.getElementById('learning-rate').value,
                batchSize: document.getElementById('batch-size').value,
                epochs: this.totalEpochs
            },
            trainingResults: {
                finalLoss: document.getElementById('current-loss').textContent,
                finalAccuracy: document.getElementById('current-accuracy').textContent
            }
        };

        const dataStr = JSON.stringify(modelData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `model-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    updateTrainingProgress(loss, accuracy) {
        document.getElementById('current-epoch').textContent = this.currentEpoch;
        document.getElementById('current-loss').textContent = loss.toFixed(4);
        document.getElementById('current-accuracy').textContent = (accuracy * 100).toFixed(1) + '%';
        
        const progressBar = document.getElementById('training-progress-bar');
        progressBar.style.width = this.trainingProgress + '%';
    }

    setupChart() {
        const canvas = document.getElementById('training-chart');
        const ctx = canvas.getContext('2d');
        
        // Simple chart setup
        canvas.width = 400;
        canvas.height = 200;
        
        this.chartCtx = ctx;
        this.chartData = {
            loss: [],
            accuracy: []
        };
    }

    updateChart(loss, accuracy) {
        if (!this.chartCtx) return;
        
        this.chartData.loss.push(loss);
        this.chartData.accuracy.push(accuracy);
        
        // Keep only last 50 data points
        if (this.chartData.loss.length > 50) {
            this.chartData.loss.shift();
            this.chartData.accuracy.shift();
        }
        
        this.drawChart();
    }

    drawChart() {
        const ctx = this.chartCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.moveTo(40, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.moveTo(40, 20);
        ctx.lineTo(40, height - 20);
        ctx.stroke();
        
        // Draw loss curve
        if (this.chartData.loss.length > 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            this.chartData.loss.forEach((loss, i) => {
                const x = 40 + (i / (this.chartData.loss.length - 1)) * (width - 60);
                const y = height - 20 - (loss * (height - 40));
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
        
        // Draw accuracy curve
        if (this.chartData.accuracy.length > 1) {
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            this.chartData.accuracy.forEach((acc, i) => {
                const x = 40 + (i / (this.chartData.accuracy.length - 1)) * (width - 60);
                const y = height - 20 - (acc * (height - 40));
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
    }

    exportTrainingData() {
        const dataStr = JSON.stringify(this.trainingData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-data-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize training when page loads
let trainingManager;
document.addEventListener('DOMContentLoaded', () => {
    trainingManager = new TrainingManager();
});

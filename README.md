# 3D Body Language Decoder Website

A dynamic and responsive 3D website for body language analysis and visualization, built with modern web technologies.

## 🚀 Features

- **Interactive 3D Models**: Real-time 3D human pose visualization
- **Gesture Recognition**: Simulated gesture detection and analysis
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Advanced CSS and JavaScript animations
- **Modern UI**: Clean, modern interface with glassmorphism effects
- **Touch & Mouse Support**: Full interaction support for all input methods

## 🏗️ Project Structure

```
3d-website/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main styles and layout
│   └── animations.css      # Advanced CSS animations
├── js/
│   ├── main.js            # Main application entry point
│   ├── three-config.js    # Three.js configuration and 3D setup
│   ├── interactions.js    # User interaction handling
│   └── animations.js      # Advanced animation system
└── README.md              # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **Three.js**: 3D graphics and rendering
- **GSAP**: Advanced animations and timeline control
- **WebGL**: Hardware-accelerated 3D graphics

## 🎯 Getting Started

1. **Clone or download** the project files
2. **Open** `3d-website/index.html` in your web browser
3. **No build process required** - runs directly in the browser

## 🎮 Usage

### Navigation
- Use the **navigation bar** to jump between sections
- **Hamburger menu** on mobile devices
- **Smooth scrolling** between sections

### 3D Interaction
- **Mouse**: Click and drag to rotate the 3D model
- **Touch**: Swipe gestures on mobile devices
- **Keyboard**: Arrow keys to move camera, WASD to rotate
- **Scroll**: Mouse wheel to zoom in/out

### Gesture Simulation
- **Wave**: Click the "Wave Detection" button
- **Point**: Click the "Pose Analysis" button
- **Thumbs Up**: Click the "Emotion Recognition" button

## 📱 Responsive Design

The website is fully responsive and works on:
- **Desktop computers** (1920px+)
- **Laptops** (1024px - 1920px)
- **Tablets** (768px - 1024px)
- **Mobile phones** (320px - 768px)

## 🎨 Animation Features

### CSS Animations
- **Loading screen** with 3D cube rotation
- **Hover effects** on cards and buttons
- **Scroll-triggered** animations
- **Floating particles** background
- **Smooth transitions** between states

### JavaScript Animations
- **3D model rotation** and interaction
- **Gesture animations** (wave, point, etc.)
- **Camera movements** and transitions
- **Particle system** effects
- **Timeline-based** complex animations

## 🔧 Customization

### Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    /* ... more variables */
}
```

### 3D Models
Modify the human model creation in `three-config.js`:
```javascript
createHumanModel() {
    // Customize model geometry, materials, etc.
}
```

### Animations
Adjust animation timings in `animations.js`:
```javascript
gsap.to(element, {
    duration: 0.8,
    delay: index * 0.1,
    // ... animation properties
});
```

## 🌐 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+
- **Mobile browsers** with WebGL support

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions or support, please open an issue on the project repository.

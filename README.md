# Collimation Circles Web

🔭 **[Try it live at GitHub Pages!](https://beshanoe.github.io/CollimationCircles/)**

A modern web-based telescope collimation assistance application built with Svelte 5+ and TypeScript. This is a complete rewrite of the original [CollimationCircles desktop application](https://github.com/simon-sandner/CollimationCircles) by Simon Šander, bringing all the essential telescope collimation features to your web browser with webcam integration.

## Features

- **Collimation Shapes**: Circle, Screw, Primary Clip, Spider, and Bahtinov Mask patterns
- **Live Camera Feed**: WebRTC webcam integration with customizable resolution and exposure controls
- **Interactive Controls**: Adjustable color, size, thickness, opacity, rotation, and positioning
- **Transform Settings**: Global scale, rotation, and offset controls
- **Multiple Themes**: Light, Dark, and Night vision modes
- **Profile Management**: Save/load configurations as JSON files
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Full keyboard control for precise adjustments

## Technology Stack

- **Svelte 5** with runes for reactive state management
- **TypeScript** for type safety
- **Vite** for fast development and builds
- **WebRTC** for camera access
- **HTML5 Canvas** for shape rendering

## Development

### Prerequisites
- Node.js 18+
- Modern web browser with webcam support

### Quick Start
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## Usage

1. Access the application at [GitHub Pages](https://user.github.io/CollimationCircles)
2. Select your camera from the Tools tab and click Play
3. Add collimation shapes using the toolbar in the Shapes tab
4. Customize shapes by selecting them and adjusting properties
5. Use Transform settings to scale and position the overlay
6. Save/load configurations using the toolbar buttons

## Browser Support

- **Chrome/Edge**: Full support with advanced camera controls
- **Firefox**: Core functionality supported  
- **Safari**: WebRTC support varies by version
- **Mobile**: Touch-friendly responsive interface

## License

Same license as the original [CollimationCircles desktop application](https://github.com/simon-sandner/CollimationCircles) by Simon Šander.

## Acknowledgments

Based on the original CollimationCircles desktop application by Simon Šander, inspired by Mire De Collimation and Al's Collimation Aid.

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { DrawingService } from '../services/DrawingService.js';
  import { shapesStore } from '../stores/shapesStore.svelte.js';
  import { settingsStore } from '../stores/settingsStore.svelte.js';
  
  let canvasElement: HTMLCanvasElement;
  let containerElement: HTMLDivElement;
  let drawingService: DrawingService;
  let animationId: number;
  
  // Reactive declarations using Svelte 5 runes
  let shapes = $derived(shapesStore.shapes);
  let selectedShapeId = $derived(shapesStore.selectedShapeId);
  let globalSettings = $derived(settingsStore.globalSettings);
  
  onMount(() => {
    drawingService = new DrawingService(canvasElement);
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerElement);
    
    // Initial resize
    handleResize();
    
    // Start animation loop
    animate();
    
    return () => {
      resizeObserver.disconnect();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
  
  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
  
  function handleResize() {
    if (!containerElement || !drawingService) return;
    
    const rect = containerElement.getBoundingClientRect();
    drawingService.resize(rect.width, rect.height);
    
    // Redraw after resize
    draw();
  }
  
  function animate() {
    draw();
    animationId = requestAnimationFrame(animate);
  }
  
  function draw() {
    if (!drawingService) return;
    
    drawingService.setOpacity(globalSettings.mainWindowOpacity);
    drawingService.draw(shapes, globalSettings, selectedShapeId);
  }
  
  function handleCanvasClick(event: MouseEvent) {
    if (!drawingService) return;
    
    const rect = canvasElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked shape
    const centerX = (canvasElement.width / 2) + globalSettings.globalOffsetX;
    const centerY = (canvasElement.height / 2) + globalSettings.globalOffsetY;
    
    // Check shapes in reverse order (top to bottom)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (!shape.isVisible) continue;
      
      if (drawingService.isPointNearShape(
        x, y, shape, centerX, centerY, 
        globalSettings.scale, globalSettings.globalRotation, 15
      )) {
        shapesStore.selectShape(shape.id);
        break;
      }
    }
  }
  
  async function exportImage() {
    if (!drawingService) return;
    
    try {
      // Create a new canvas for the combined image
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasElement.width;
      exportCanvas.height = canvasElement.height;
      const exportCtx = exportCanvas.getContext('2d');
      
      if (!exportCtx) return;
      
      // First, try to draw the video frame
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
        // Draw the video frame to fill the canvas
        exportCtx.drawImage(
          videoElement, 
          0, 0, 
          exportCanvas.width, 
          exportCanvas.height
        );
      } else {
        // Fill with black background if no video
        exportCtx.fillStyle = '#000000';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }
      
      // Then draw the shapes overlay on top
      const overlayCanvas = drawingService.getCanvas();
      exportCtx.drawImage(overlayCanvas, 0, 0);
      
      // Export the combined image
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'collimation-with-video.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image with video:', error);
      
      // Fallback to shapes-only export
      const dataUrl = drawingService.exportAsImage();
      const link = document.createElement('a');
      link.download = 'collimation-overlay.png';
      link.href = dataUrl;
      link.click();
    }
  }
</script>

<div class="canvas-container" bind:this={containerElement}>
  <canvas
    bind:this={canvasElement}
    onclick={handleCanvasClick}
    class="collimation-canvas"
  ></canvas>
  
  <div class="canvas-controls">
    <button onclick={exportImage} title="Export as image">
      📷 Export
    </button>
  </div>
</div>

<style>
  .canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .collimation-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    pointer-events: auto;
  }
  
  .canvas-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
  
  .canvas-controls button {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .canvas-controls button:hover {
    background: rgba(0, 0, 0, 0.9);
  }
</style>
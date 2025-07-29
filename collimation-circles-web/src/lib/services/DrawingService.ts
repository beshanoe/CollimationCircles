import type { CollimationHelper } from '../models/CollimationHelper.js';
import type { GlobalSettings } from '../types/index.js';

export class DrawingService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get 2D rendering context');
    }
    this.ctx = ctx;
  }

  draw(
    shapes: CollimationHelper[], 
    globalSettings: GlobalSettings, 
    _selectedShapeId: string | null
  ): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set canvas data attributes for shapes to read
    this.canvas.dataset.showLabels = globalSettings.showLabels.toString();
    this.canvas.dataset.labelSize = globalSettings.labelSize.toString();

    // Calculate center point with global offsets
    const centerX = (this.canvas.width / 2) + globalSettings.globalOffsetX;
    const centerY = (this.canvas.height / 2) + globalSettings.globalOffsetY;

    // Draw all visible shapes
    shapes.forEach(shape => {
      if (shape.isVisible) {
        shape.draw(
          this.ctx, 
          centerX, 
          centerY, 
          globalSettings.scale, 
          globalSettings.globalRotation
        );
      }
    });

    // Selection marker removed per user request

  }



  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  setOpacity(opacity: number): void {
    this.canvas.style.opacity = opacity.toString();
  }

  // Utility method to convert screen coordinates to canvas coordinates
  screenToCanvas(screenX: number, screenY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: screenX - rect.left,
      y: screenY - rect.top
    };
  }

  // Utility method to check if a point is near a shape (for selection)
  isPointNearShape(
    x: number, 
    y: number, 
    shape: CollimationHelper, 
    centerX: number, 
    centerY: number, 
    scale: number, 
    globalRotation: number,
    tolerance: number = 10
  ): boolean {
    // Transform point to shape's coordinate system
    const dx = x - centerX;
    const dy = y - centerY;
    
    // Inverse transform
    const cos = Math.cos(-(globalRotation + shape.rotationAngle) * Math.PI / 180);
    const sin = Math.sin(-(globalRotation + shape.rotationAngle) * Math.PI / 180);
    
    const transformedX = (dx * cos - dy * sin) / scale;
    const transformedY = (dx * sin + dy * cos) / scale;
    
    // Check distance from shape's radius
    const distance = Math.sqrt(transformedX * transformedX + transformedY * transformedY);
    return Math.abs(distance - shape.radius) <= tolerance;
  }

  exportAsImage(): string {
    return this.canvas.toDataURL('image/png');
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
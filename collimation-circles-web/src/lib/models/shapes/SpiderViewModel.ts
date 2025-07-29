import { CollimationHelper } from '../CollimationHelper.js';
import type { ICollimationHelper } from '../../types/index.js';
import { COLORS } from '../../types/index.js';

export class SpiderViewModel extends CollimationHelper {
  constructor(defaults: Partial<ICollimationHelper> = {}) {
    super('spider', {
      itemColor: COLORS[0], // Red
      radius: 250,
      thickness: 1,
      count: 4,
      maxCount: 10,
      rotationAngle: 45,
      size: 5,
      isRotatable: true,
      isSizeable: true,
      isCountable: true,
      label: 'Spider',
      ...defaults
    });
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, globalRotation: number): void {
    if (!this.isVisible) return;

    ctx.save();
    
    // Set drawing properties
    ctx.strokeStyle = this.itemColor;
    ctx.lineWidth = this.size; // Size controls thickness of spider vanes
    ctx.globalAlpha = this.opacity;
    
    // Apply transformations
    ctx.translate(centerX, centerY);
    ctx.rotate((globalRotation + this.rotationAngle) * Math.PI / 180);
    ctx.scale(scale, scale);

    // Draw spider vanes
    const angleStep = (2 * Math.PI) / this.count;
    for (let i = 0; i < this.count; i++) {
      const angle = i * angleStep;
      const x1 = Math.cos(angle) * 10; // Inner radius (close to center)
      const y1 = Math.sin(angle) * 10;
      const x2 = Math.cos(angle) * this.radius;
      const y2 = Math.sin(angle) * this.radius;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw label if enabled
    if (this.label && ctx.canvas.dataset.showLabels === 'true') {
      ctx.fillStyle = this.itemColor;
      ctx.font = `${ctx.canvas.dataset.labelSize || 16}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(this.label, 0, -this.radius - 20);
    }
    
    ctx.restore();
  }
}
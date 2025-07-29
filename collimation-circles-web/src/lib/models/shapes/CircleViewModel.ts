import { CollimationHelper } from '../CollimationHelper.js';
import type { ICollimationHelper } from '../../types/index.js';
import { COLORS } from '../../types/index.js';

export class CircleViewModel extends CollimationHelper {
  constructor(defaults: Partial<ICollimationHelper> = {}) {
    super('circle', {
      itemColor: COLORS[0], // Red
      radius: 300,
      thickness: 1,
      label: 'Circle',
      ...defaults
    });
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, globalRotation: number): void {
    if (!this.isVisible) return;

    ctx.save();
    
    // Set drawing properties
    ctx.strokeStyle = this.itemColor;
    ctx.lineWidth = this.thickness;
    ctx.globalAlpha = this.opacity;
    
    // Apply transformations
    ctx.translate(centerX, centerY);
    ctx.rotate((globalRotation + this.rotationAngle) * Math.PI / 180);
    ctx.scale(scale, scale);

    // Draw circle
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw label if enabled
    if (this.label && ctx.canvas.dataset.showLabels === 'true') {
      ctx.fillStyle = this.itemColor;
      ctx.font = `${ctx.canvas.dataset.labelSize || 16}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(this.label, 0, -this.radius - 10);
    }
    
    ctx.restore();
  }
}
import { CollimationHelper } from '../CollimationHelper.js';
import type { ICollimationHelper } from '../../types/index.js';
import { COLORS } from '../../types/index.js';

export class ScrewViewModel extends CollimationHelper {
  constructor(defaults: Partial<ICollimationHelper> = {}) {
    super('screw', {
      itemColor: COLORS[1], // Lime
      radius: 230,
      thickness: 1,
      count: 3,
      maxCount: 10,
      rotationAngle: 60,
      size: 10,
      isRotatable: true,
      isSizeable: true,
      isCountable: true,
      label: 'Screw',
      ...defaults
    });
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, globalRotation: number): void {
    if (!this.isVisible) return;

    ctx.save();
    
    // Set drawing properties
    ctx.strokeStyle = this.itemColor;
    ctx.fillStyle = this.itemColor;
    ctx.lineWidth = this.thickness;
    ctx.globalAlpha = this.opacity;
    
    // Apply transformations
    ctx.translate(centerX, centerY);
    ctx.rotate((globalRotation + this.rotationAngle) * Math.PI / 180);
    ctx.scale(scale, scale);

    // Draw screws
    const angleStep = (2 * Math.PI) / this.count;
    for (let i = 0; i < this.count; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;
      
      // Draw screw as small circle
      ctx.beginPath();
      ctx.arc(x, y, this.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw screw slot
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-this.size / 3, 0);
      ctx.lineTo(this.size / 3, 0);
      ctx.strokeStyle = ctx.canvas.style.backgroundColor || '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
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
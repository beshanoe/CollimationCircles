import { CollimationHelper } from '../CollimationHelper.js';
import type { ICollimationHelper } from '../../types/index.js';
import { COLORS } from '../../types/index.js';

export class PrimaryClipViewModel extends CollimationHelper {
  constructor(defaults: Partial<ICollimationHelper> = {}) {
    super('primaryClip', {
      itemColor: COLORS[6], // White
      radius: 268,
      thickness: 1,
      count: 3,
      maxCount: 10,
      rotationAngle: 30,
      size: 50,
      isRotatable: true,
      isSizeable: true,
      isCountable: true,
      label: 'Primary Clip',
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

    // Draw clips
    const angleStep = (2 * Math.PI) / this.count;
    for (let i = 0; i < this.count; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Draw clip as small rectangle
      const clipWidth = this.size;
      const clipHeight = this.size / 3;
      
      ctx.beginPath();
      ctx.rect(-clipWidth / 2, -clipHeight / 2, clipWidth, clipHeight);
      ctx.fill();
      
      // Draw clip spring lines
      ctx.strokeStyle = this.itemColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-clipWidth / 4, -clipHeight / 2);
      ctx.lineTo(-clipWidth / 4, clipHeight / 2);
      ctx.moveTo(clipWidth / 4, -clipHeight / 2);
      ctx.lineTo(clipWidth / 4, clipHeight / 2);
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
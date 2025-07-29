import type { ShapeType, ICollimationHelper } from '../types/index.js';
import { CollimationHelper } from './CollimationHelper.js';
import { CircleViewModel } from './shapes/CircleViewModel.js';
import { ScrewViewModel } from './shapes/ScrewViewModel.js';
import { PrimaryClipViewModel } from './shapes/PrimaryClipViewModel.js';
import { SpiderViewModel } from './shapes/SpiderViewModel.js';

export class ShapeFactory {
  static createShape(shapeType: ShapeType, defaults?: Partial<ICollimationHelper>): CollimationHelper {
    switch (shapeType) {
      case 'circle':
        return new CircleViewModel(defaults);
      case 'screw':
        return new ScrewViewModel(defaults);
      case 'primaryClip':
        return new PrimaryClipViewModel(defaults);
      case 'spider':
        return new SpiderViewModel(defaults);
      default:
        throw new Error(`Unknown shape type: ${shapeType}`);
    }
  }

  static createDefaultShapes(): CollimationHelper[] {
    return [];
  }

  static fromJSON(data: any): CollimationHelper {
    const shape = this.createShape(data.shapeType, data);
    
    // Copy all properties from JSON data
    Object.keys(data).forEach(key => {
      if (key !== 'shapeType' && key in shape) {
        (shape as any)[key] = data[key];
      }
    });
    
    return shape;
  }

  static getShapeDisplayName(shapeType: ShapeType): string {
    switch (shapeType) {
      case 'circle':
        return 'Circle';
      case 'screw':
        return 'Screw';
      case 'primaryClip':
        return 'Primary Clip';
      case 'spider':
        return 'Spider';
      default:
        return 'Unknown';
    }
  }

  static getShapeIcon(shapeType: ShapeType): string {
    switch (shapeType) {
      case 'circle':
        return '⭕';
      case 'screw':
        return '🔩';
      case 'primaryClip':
        return '📎';
      case 'spider':
        return '🕷️';
      default:
        return '❓';
    }
  }
}
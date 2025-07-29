import type { ICollimationHelper, ShapeType } from '../types/index.js';
import { CONSTRAINTS, COLORS } from '../types/index.js';

export abstract class CollimationHelper implements ICollimationHelper {
  id: string;
  itemColor: string;
  label?: string;
  thickness: number;
  radius: number;
  rotationIncrement: number;
  inclinationIncrement: number;
  isVisible: boolean;
  isRotatable: boolean;
  isInclinatable: boolean;
  isSizeable: boolean;
  isEditable: boolean;
  isCountable: boolean;
  rotationAngle: number;
  inclinationAngle: number;
  size: number;
  count: number;
  maxCount: number;
  opacity: number;

  constructor(
    protected shapeType: ShapeType,
    defaults: Partial<ICollimationHelper> = {}
  ) {
    this.id = crypto.randomUUID();
    this.itemColor = defaults.itemColor ?? COLORS[0];
    this.label = defaults.label;
    this.thickness = defaults.thickness ?? 1;
    this.radius = defaults.radius ?? 300;
    this.rotationIncrement = defaults.rotationIncrement ?? 1;
    this.inclinationIncrement = defaults.inclinationIncrement ?? 0.1;
    this.isVisible = defaults.isVisible ?? true;
    this.isRotatable = defaults.isRotatable ?? false;
    this.isInclinatable = defaults.isInclinatable ?? false;
    this.isSizeable = defaults.isSizeable ?? false;
    this.isEditable = defaults.isEditable ?? true;
    this.isCountable = defaults.isCountable ?? false;
    this.rotationAngle = defaults.rotationAngle ?? 0;
    this.inclinationAngle = defaults.inclinationAngle ?? 0;
    this.size = defaults.size ?? 10;
    this.count = defaults.count ?? 1;
    this.maxCount = defaults.maxCount ?? 10;
    this.opacity = defaults.opacity ?? 1;
  }

  getShapeType(): ShapeType {
    return this.shapeType;
  }

  validateProperty(property: keyof ICollimationHelper, value: any): boolean {
    switch (property) {
      case 'thickness':
        return value >= CONSTRAINTS.ThicknessMin && value <= CONSTRAINTS.ThicknessMax;
      case 'radius':
        return value >= CONSTRAINTS.RadiusMin && value <= CONSTRAINTS.RadiusMax;
      case 'rotationAngle':
        return value >= CONSTRAINTS.RotationAngleMin && value <= CONSTRAINTS.RotationAngleMax;
      case 'inclinationAngle':
        return value >= CONSTRAINTS.InclinationAngleMin && value <= CONSTRAINTS.InclinationAngleMax;
      case 'size':
        return value >= CONSTRAINTS.SizeMin && value <= CONSTRAINTS.SizeMax;
      case 'count':
        return value >= CONSTRAINTS.CountMin && value <= Math.min(CONSTRAINTS.CountMax, this.maxCount);
      case 'opacity':
        return value >= CONSTRAINTS.OpacityMin && value <= CONSTRAINTS.OpacityMax;
      default:
        return true;
    }
  }

  clone(sameId = false): CollimationHelper {
    const cloned = Object.create(Object.getPrototypeOf(this));
    Object.assign(cloned, this);
    if (!sameId) {
      cloned.id = crypto.randomUUID();
      cloned.label = this.label ? `${this.label} Copy` : undefined;
    }
    return cloned;
  }

  toJSON(): any {
    return {
      shapeType: this.shapeType,
      id: this.id,
      itemColor: this.itemColor,
      label: this.label,
      thickness: this.thickness,
      radius: this.radius,
      rotationIncrement: this.rotationIncrement,
      inclinationIncrement: this.inclinationIncrement,
      isVisible: this.isVisible,
      isRotatable: this.isRotatable,
      isInclinatable: this.isInclinatable,
      isSizeable: this.isSizeable,
      isEditable: this.isEditable,
      isCountable: this.isCountable,
      rotationAngle: this.rotationAngle,
      inclinationAngle: this.inclinationAngle,
      size: this.size,
      count: this.count,
      maxCount: this.maxCount,
      opacity: this.opacity
    };
  }

  abstract draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, globalRotation: number): void;
}
import { CollimationHelper } from '../models/CollimationHelper.js';
import { ShapeFactory } from '../models/ShapeFactory.js';
import type { ShapeType } from '../types/index.js';

class ShapesStore {
  private _shapes = $state<CollimationHelper[]>([]);
  private _selectedShapeId = $state<string | null>(null);

  constructor() {
    // Initialize with no shapes
    this._shapes = ShapeFactory.createDefaultShapes();
    this._selectedShapeId = null;
  }

  get shapes(): CollimationHelper[] {
    return this._shapes;
  }

  get selectedShapeId(): string | null {
    return this._selectedShapeId;
  }

  get selectedShape(): CollimationHelper | null {
    if (!this._selectedShapeId) return null;
    return this._shapes.find(shape => shape.id === this._selectedShapeId) || null;
  }

  addShape(shapeType: ShapeType): void {
    const newShape = ShapeFactory.createShape(shapeType);
    this._shapes.push(newShape);
    this._selectedShapeId = newShape.id;
  }

  removeShape(id: string): void {
    const index = this._shapes.findIndex(shape => shape.id === id);
    if (index === -1) return;

    this._shapes.splice(index, 1);
    
    // Update selection
    if (this._selectedShapeId === id) {
      if (this._shapes.length > 0) {
        // Select the previous shape, or the first one if we removed the first
        const newIndex = Math.max(0, index - 1);
        this._selectedShapeId = this._shapes[newIndex]?.id || null;
      } else {
        this._selectedShapeId = null;
      }
    }
  }

  duplicateShape(id: string): void {
    const shape = this._shapes.find(s => s.id === id);
    if (!shape) return;

    const cloned = shape.clone();
    this._shapes.push(cloned);
    this._selectedShapeId = cloned.id;
  }

  selectShape(id: string): void {
    if (this._shapes.some(shape => shape.id === id)) {
      this._selectedShapeId = id;
    }
  }

  updateShape(id: string, updates: Partial<CollimationHelper>): void {
    const shapeIndex = this._shapes.findIndex(s => s.id === id);
    if (shapeIndex === -1) return;

    const shape = this._shapes[shapeIndex].clone(true);
    
    // Apply updates with validation
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (shape.validateProperty(key as any, value)) {
        (shape as any)[key] = value;
      }
    });
    
    // Trigger reactivity by reassigning the array
    this._shapes[shapeIndex] = shape;
  }

  resetToDefaults(): void {
    this._shapes = ShapeFactory.createDefaultShapes();
    this._selectedShapeId = this._shapes.length > 0 ? this._shapes[0].id : null;
  }

  exportShapes(): string {
    return JSON.stringify({
      version: '1.0',
      shapes: this._shapes.map(shape => shape.toJSON()),
      selectedShapeId: this._selectedShapeId
    }, null, 2);
  }

  importShapes(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.shapes || !Array.isArray(data.shapes)) {
        throw new Error('Invalid shapes data');
      }

      const importedShapes = data.shapes.map((shapeData: any) => 
        ShapeFactory.fromJSON(shapeData)
      );

      this._shapes = importedShapes;
      this._selectedShapeId = data.selectedShapeId && 
        importedShapes.some((s: any) => s.id === data.selectedShapeId) 
          ? data.selectedShapeId 
          : (importedShapes.length > 0 ? importedShapes[0].id : null);

      return true;
    } catch (error) {
      console.error('Failed to import shapes:', error);
      return false;
    }
  }

  moveShape(fromIndex: number, toIndex: number): void {
    if (fromIndex < 0 || fromIndex >= this._shapes.length || 
        toIndex < 0 || toIndex >= this._shapes.length) {
      return;
    }

    const [movedShape] = this._shapes.splice(fromIndex, 1);
    this._shapes.splice(toIndex, 0, movedShape);
  }

  getVisibleShapes(): CollimationHelper[] {
    return this._shapes.filter(shape => shape.isVisible);
  }
}

export const shapesStore = new ShapesStore();
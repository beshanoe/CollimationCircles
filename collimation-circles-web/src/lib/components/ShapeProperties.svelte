<script lang="ts">
  import { shapesStore } from '../stores/shapesStore.svelte.js';
  import { COLORS, CONSTRAINTS } from '../types/index.js';
  
  // Reactive declarations using Svelte 5 runes
  let selectedShape = $derived(shapesStore.selectedShape);
  
  function updateProperty(property: string, value: any) {
    if (!selectedShape) return;
    shapesStore.updateShape(selectedShape.id, { [property]: value });
  }
  
  function handleColorChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    updateProperty('itemColor', target.value);
  }
  
  function handleNumberInput(property: string) {
    return (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = parseFloat(target.value);
      if (!isNaN(value)) {
        updateProperty(property, value);
      }
    };
  }
  
  function handleTextInput(property: string) {
    return (event: Event) => {
      const target = event.target as HTMLInputElement;
      updateProperty(property, target.value);
    };
  }
  
</script>

<div class="shape-properties">
  <div class="properties-header">
    <h3>Properties</h3>
  </div>
  
  {#if selectedShape}
    <div class="properties-content">
      <!-- Basic Properties -->
      <div class="property-group">
        <h4>Basic</h4>
        
        <div class="property-item">
          <label for="label">Label:</label>
          <input
            id="label"
            type="text"
            value={selectedShape.label || ''}
            oninput={handleTextInput('label')}
            maxlength="20"
          />
        </div>
        
        <div class="property-item">
          <label for="color">Color:</label>
          <select
            id="color"
            value={selectedShape.itemColor}
            onchange={handleColorChange}
          >
            {#each COLORS as color}
              <option value={color} style="background-color: {color};">
                {color}
              </option>
            {/each}
          </select>
          <div class="color-preview" style="background-color: {selectedShape.itemColor}"></div>
        </div>
        
        <div class="property-item">
          <label for="radius">Radius:</label>
          <input
            id="radius"
            type="range"
            min={CONSTRAINTS.RadiusMin}
            max={CONSTRAINTS.RadiusMax}
            value={selectedShape.radius}
            oninput={handleNumberInput('radius')}
          />
          <input
            type="number"
            min={CONSTRAINTS.RadiusMin}
            max={CONSTRAINTS.RadiusMax}
            value={selectedShape.radius}
            oninput={handleNumberInput('radius')}
            class="number-input"
          />
        </div>
        
        <div class="property-item">
          <label for="thickness">Thickness:</label>
          <input
            id="thickness"
            type="range"
            min={CONSTRAINTS.ThicknessMin}
            max={CONSTRAINTS.ThicknessMax}
            value={selectedShape.thickness}
            oninput={handleNumberInput('thickness')}
          />
          <input
            type="number"
            min={CONSTRAINTS.ThicknessMin}
            max={CONSTRAINTS.ThicknessMax}
            value={selectedShape.thickness}
            oninput={handleNumberInput('thickness')}
            class="number-input"
          />
        </div>
        
        <div class="property-item">
          <label for="opacity">Opacity:</label>
          <input
            id="opacity"
            type="range"
            min={CONSTRAINTS.OpacityMin}
            max={CONSTRAINTS.OpacityMax}
            step="0.1"
            value={selectedShape.opacity}
            oninput={handleNumberInput('opacity')}
          />
          <input
            type="number"
            min={CONSTRAINTS.OpacityMin}
            max={CONSTRAINTS.OpacityMax}
            step="0.1"
            value={selectedShape.opacity}
            oninput={handleNumberInput('opacity')}
            class="number-input"
          />
        </div>
        
      </div>
      
      <!-- Rotation -->
      {#if selectedShape.isRotatable}
        <div class="property-group">
          <h4>Rotation</h4>
          
          <div class="property-item">
            <label for="rotation">Angle (°):</label>
            <input
              id="rotation"
              type="range"
              min={CONSTRAINTS.RotationAngleMin}
              max={CONSTRAINTS.RotationAngleMax}
              value={selectedShape.rotationAngle}
              oninput={handleNumberInput('rotationAngle')}
            />
            <input
              type="number"
              min={CONSTRAINTS.RotationAngleMin}
              max={CONSTRAINTS.RotationAngleMax}
              value={selectedShape.rotationAngle}
              oninput={handleNumberInput('rotationAngle')}
              class="number-input"
            />
          </div>
          
          <div class="property-item">
            <label for="rotationIncrement">Increment:</label>
            <input
              id="rotationIncrement"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={selectedShape.rotationIncrement}
              oninput={handleNumberInput('rotationIncrement')}
              class="number-input"
            />
          </div>
        </div>
      {/if}
      
      <!-- Inclination -->
      {#if selectedShape.isInclinatable}
        <div class="property-group">
          <h4>Inclination</h4>
          
          <div class="property-item">
            <label for="inclination">Angle (°):</label>
            <input
              id="inclination"
              type="range"
              min={CONSTRAINTS.InclinationAngleMin}
              max={CONSTRAINTS.InclinationAngleMax}
              value={selectedShape.inclinationAngle}
              oninput={handleNumberInput('inclinationAngle')}
            />
            <input
              type="number"
              min={CONSTRAINTS.InclinationAngleMin}
              max={CONSTRAINTS.InclinationAngleMax}
              value={selectedShape.inclinationAngle}
              oninput={handleNumberInput('inclinationAngle')}
              class="number-input"
            />
          </div>
          
          <div class="property-item">
            <label for="inclinationIncrement">Increment:</label>
            <input
              id="inclinationIncrement"
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={selectedShape.inclinationIncrement}
              oninput={handleNumberInput('inclinationIncrement')}
              class="number-input"
            />
          </div>
        </div>
      {/if}
      
      <!-- Size/Spacing -->
      {#if selectedShape.isSizeable}
        <div class="property-group">
          <h4>Size</h4>
          
          <div class="property-item">
            <label for="size">Size/Spacing:</label>
            <input
              id="size"
              type="range"
              min={CONSTRAINTS.SizeMin}
              max={CONSTRAINTS.SizeMax}
              value={selectedShape.size}
              oninput={handleNumberInput('size')}
            />
            <input
              type="number"
              min={CONSTRAINTS.SizeMin}
              max={CONSTRAINTS.SizeMax}
              value={selectedShape.size}
              oninput={handleNumberInput('size')}
              class="number-input"
            />
          </div>
        </div>
      {/if}
      
      <!-- Count -->
      {#if selectedShape.isCountable}
        <div class="property-group">
          <h4>Count</h4>
          
          <div class="property-item">
            <label for="count">Count:</label>
            <input
              id="count"
              type="range"
              min={CONSTRAINTS.CountMin}
              max={Math.min(CONSTRAINTS.CountMax, selectedShape.maxCount)}
              value={selectedShape.count}
              oninput={handleNumberInput('count')}
            />
            <input
              type="number"
              min={CONSTRAINTS.CountMin}
              max={Math.min(CONSTRAINTS.CountMax, selectedShape.maxCount)}
              value={selectedShape.count}
              oninput={handleNumberInput('count')}
              class="number-input"
            />
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="no-selection">
      <p>No shape selected</p>
      <p>Click on a shape to edit its properties</p>
    </div>
  {/if}
</div>

<style>
  .shape-properties {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .properties-header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }
  
  .properties-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .properties-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .property-group {
    margin-bottom: 1.5rem;
  }
  
  .property-group h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
  }
  
  .property-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .property-item.checkbox-item {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }
  
  .property-item label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .property-item input[type="range"] {
    flex: 1;
  }
  
  .number-input {
    width: 60px;
    padding: 0.25rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
  }
  
  .property-item input[type="text"] {
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
    grid-column: 2 / -1;
  }
  
  .property-item select {
    display: flex;
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
  }
  
  .color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }
  
  .property-item input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
  
  .no-selection {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem;
  }
  
  .no-selection p {
    margin: 0.5rem 0;
  }
  
  /* Input styling */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: var(--bg-primary);
    border-radius: 3px;
    outline: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
</style>
<script lang="ts">
  import { shapesStore } from '../stores/shapesStore.svelte.js';
  import { ShapeFactory } from '../models/ShapeFactory.js';
  
  // Reactive declarations using Svelte 5 runes
  let shapes = $derived(shapesStore.shapes);
  let selectedShapeId = $derived(shapesStore.selectedShapeId);
  
  function handleShapeSelect(id: string) {
    shapesStore.selectShape(id);
  }
  
  function handleVisibilityToggle(id: string) {
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      shapesStore.updateShape(id, { isVisible: !shape.isVisible });
    }
  }
  
  function handleRemoveShape(id: string) {
    shapesStore.removeShape(id);
  }
  
  function handleDuplicateShape(id: string) {
    shapesStore.duplicateShape(id);
  }
  
  // Drag and drop functionality
  let draggedIndex: number | null = null;
  
  function handleDragStart(event: DragEvent, index: number) {
    draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
  
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }
  
  function handleDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      shapesStore.moveShape(draggedIndex, dropIndex);
    }
    draggedIndex = null;
  }
</script>

<div class="shapes-list">
  <div class="list-header">
    <h3>Shapes</h3>
    {#if shapes.length > 0}
      <div class="header-actions">
        <button onclick={() => shapesStore.resetToDefaults()} title="Clear all shapes">
          🗑️
        </button>
      </div>
    {/if}
  </div>
  
  <div class="shapes-container">
    {#if shapes.length === 0}
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h4>No shapes added yet</h4>
        <p>Use the toolbar on the left to add collimation shapes like circles, screws, and spiders.</p>
        <p><strong>Tip:</strong> Start with adding a circle for your telescope's secondary mirror!</p>
      </div>
    {:else}
    {#each shapes as shape, index (shape.id)}
      <div
        class="shape-item"
        class:selected={selectedShapeId === shape.id}
        class:hidden={!shape.isVisible}
        draggable="true"
        ondragstart={(e) => handleDragStart(e, index)}
        ondragover={handleDragOver}
        ondrop={(e) => handleDrop(e, index)}
      >
        <div class="shape-info" onclick={() => handleShapeSelect(shape.id)}>
          <span class="shape-icon">
            {ShapeFactory.getShapeIcon(shape.getShapeType())}
          </span>
          <div class="shape-details">
            <div class="shape-name">
              {shape.label || ShapeFactory.getShapeDisplayName(shape.getShapeType())}
            </div>
            <div class="shape-props">
              R:{shape.radius} T:{shape.thickness}
              {#if shape.isCountable && shape.count > 1}
                C:{shape.count}
              {/if}
            </div>
          </div>
          <div class="shape-color" style="background-color: {shape.itemColor}"></div>
        </div>
        
        <div class="shape-actions">
          <button
            onclick={() => handleVisibilityToggle(shape.id)}
            class="action-btn"
            class:visibility-hidden={!shape.isVisible}
            title={shape.isVisible ? 'Hide' : 'Show'}
          >
            {shape.isVisible ? '👁️' : '🙈'}
          </button>
          
          <button
            onclick={() => handleDuplicateShape(shape.id)}
            class="action-btn"
            title="Duplicate"
          >
            📋
          </button>
          
          <button
            onclick={() => handleRemoveShape(shape.id)}
            class="action-btn remove-btn"
            title="Remove"
          >
            🗑️
          </button>
        </div>
      </div>
    {/each}
    {/if}
  </div>
</div>

<style>
  .shapes-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }
  
  .list-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .header-actions button {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .header-actions button:hover {
    background: var(--bg-hover);
  }
  
  .shapes-container {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }
  
  .shape-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: var(--bg-primary);
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .shape-item:hover {
    background: var(--bg-hover);
  }
  
  .shape-item.selected {
    border-color: var(--accent-color);
    background: var(--bg-selected);
  }
  
  .shape-item.hidden {
    opacity: 0.5;
  }
  
  .shape-info {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 0.75rem;
  }
  
  .shape-icon {
    font-size: 1.25rem;
    width: 1.5rem;
    text-align: center;
  }
  
  .shape-details {
    flex: 1;
  }
  
  .shape-name {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.875rem;
  }
  
  .shape-props {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.125rem;
  }
  
  .shape-color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1px solid var(--border-color);
  }
  
  .shape-actions {
    display: flex;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }
  
  .action-btn {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 3px;
    font-size: 0.875rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  .action-btn:hover {
    opacity: 1;
    background: var(--bg-hover);
  }
  
  .action-btn.visibility-hidden {
    opacity: 0.4;
  }
  
  .action-btn.remove-btn:hover {
    background: var(--error-color);
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--text-secondary);
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  .empty-state h4 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.1rem;
  }
  
  .empty-state p {
    margin: 0.75rem 0;
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  .empty-state p:last-child {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    opacity: 0.8;
  }
  
  /* CSS Variables (to be defined in global styles) */
  :root {
    --bg-primary: #2a2a2a;
    --bg-secondary: #1e1e1e;
    --bg-tertiary: #333333;
    --bg-hover: #404040;
    --bg-selected: #1a4b8c;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --border-color: #444444;
    --accent-color: #4dabf7;
    --error-color: #ff6b6b;
  }
</style>
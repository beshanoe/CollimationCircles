<script lang="ts">
  import { shapesStore } from '../stores/shapesStore.svelte.js';
  import type { ShapeType } from '../types/index.js';
  
  let fileInput: HTMLInputElement;
  
  function addShape(shapeType: ShapeType) {
    shapesStore.addShape(shapeType);
  }
  
  
  function resetShapes() {
    if (confirm('Reset all shapes to defaults? This will remove all current shapes.')) {
      shapesStore.resetToDefaults();
    }
  }
  
  function saveProfile() {
    const data = shapesStore.exportShapes();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'collimation-profile.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  function loadProfile() {
    fileInput.click();
  }
  
  function handleFileLoad(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = shapesStore.importShapes(content);
      
      if (!success) {
        alert('Failed to load profile. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    target.value = '';
  }
  
  // Shape type definitions for toolbar buttons
  const shapeButtons: Array<{ type: ShapeType; icon: string; label: string }> = [
    { type: 'circle', icon: '⭕', label: 'Circle' },
    { type: 'screw', icon: '🔩', label: 'Screw' },
    { type: 'primaryClip', icon: '📎', label: 'Primary Clip' },
    { type: 'spider', icon: '🕷️', label: 'Spider' }
  ];
</script>

<div class="toolbar">
  <div class="toolbar-section">
    <h4>Add Shapes</h4>
    <div class="button-group">
      {#each shapeButtons as button}
        <button
          onclick={() => addShape(button.type)}
          class="shape-btn"
          title="Add {button.label}"
        >
          <span class="btn-icon">{button.icon}</span>
          <span class="btn-label">{button.label}</span>
        </button>
      {/each}
    </div>
  </div>
  
  
  <div class="toolbar-section">
    <h4>Profile</h4>
    <div class="button-group horizontal">
      <button
        onclick={saveProfile}
        class="action-btn compact"
        title="Save current configuration"
      >
        <span class="btn-icon">💾</span>
      </button>
      
      <button
        onclick={loadProfile}
        class="action-btn compact"
        title="Load configuration from file"
      >
        <span class="btn-icon">📁</span>
      </button>
      
      <button
        onclick={resetShapes}
        class="action-btn compact"
        title="Clear all shapes"
      >
        <span class="btn-icon">🗑️</span>
      </button>
    </div>
  </div>
  
  <!-- Hidden file input for loading profiles -->
  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    onchange={handleFileLoad}
    style="display: none;"
  />
</div>

<style>
  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    min-height: 100%;
  }
  
  .toolbar-section h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .button-group.horizontal {
    flex-direction: row;
    gap: 0.25rem;
  }
  
  .shape-btn, .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    min-height: 44px;
  }
  
  .shape-btn:hover, .action-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  .shape-btn:active, .action-btn:active {
    transform: translateY(1px);
  }
  
  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .action-btn.remove:hover {
    background: var(--error-color);
    border-color: var(--error-color);
  }
  
  .action-btn.compact {
    min-width: auto;
    padding: 0.5rem;
    flex: 1;
  }
  
  .action-btn.compact .btn-label {
    display: none;
  }
  
  .btn-icon {
    font-size: 1.25rem;
    min-width: 1.5rem;
    display: flex;
    justify-content: center;
  }
  
  .btn-label {
    flex: 1;
    text-align: left;
    font-weight: 500;
  }
  
  .toolbar-divider {
    height: 1px;
    background: var(--border-color);
    margin: 0.5rem 0;
  }
  
  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    .toolbar {
      padding: 0.75rem;
    }
    
    .button-group {
      gap: 0.375rem;
    }
    
    .shape-btn, .action-btn {
      padding: 0.5rem;
      min-height: 40px;
    }
    
    .btn-label {
      font-size: 0.8125rem;
    }
  }
</style>
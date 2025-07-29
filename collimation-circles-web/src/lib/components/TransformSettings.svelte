<script lang="ts">
  import { settingsStore } from '../stores/settingsStore.svelte.js';
  import { CONSTRAINTS } from '../types/index.js';
  
  // Reactive declarations using Svelte 5 runes
  let globalSettings = $derived(settingsStore.globalSettings);
  
  function updateSetting(key: string) {
    return (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = parseFloat(target.value);
      if (!isNaN(value)) {
        settingsStore.updateGlobalSetting(key as any, value);
      }
    };
  }
</script>

<div class="transform-settings">
  <div class="settings-header">
    <h3>Transform</h3>
  </div>
  
  <div class="settings-content">
    <div class="setting-item">
      <label for="scale">Scale:</label>
      <input
        id="scale"
        type="range"
        min={CONSTRAINTS.ScaleMin}
        max={CONSTRAINTS.ScaleMax}
        step="0.1"
        value={globalSettings.scale}
        oninput={updateSetting('scale')}
      />
      <input
        type="number"
        min={CONSTRAINTS.ScaleMin}
        max={CONSTRAINTS.ScaleMax}
        step="0.1"
        value={globalSettings.scale}
        oninput={updateSetting('scale')}
        class="number-input"
      />
    </div>
    
    <div class="setting-item">
      <label for="globalRotation">Rotation (°):</label>
      <input
        id="globalRotation"
        type="range"
        min={CONSTRAINTS.RotationAngleMin}
        max={CONSTRAINTS.RotationAngleMax}
        value={globalSettings.globalRotation}
        oninput={updateSetting('globalRotation')}
      />
      <input
        type="number"
        min={CONSTRAINTS.RotationAngleMin}
        max={CONSTRAINTS.RotationAngleMax}
        value={globalSettings.globalRotation}
        oninput={updateSetting('globalRotation')}
        class="number-input"
      />
    </div>
    
    <div class="setting-item">
      <label for="globalOffsetX">Offset X:</label>
      <input
        id="globalOffsetX"
        type="range"
        min={CONSTRAINTS.OffsetMin}
        max={CONSTRAINTS.OffsetMax}
        value={globalSettings.globalOffsetX}
        oninput={updateSetting('globalOffsetX')}
      />
      <input
        type="number"
        min={CONSTRAINTS.OffsetMin}
        max={CONSTRAINTS.OffsetMax}
        value={globalSettings.globalOffsetX}
        oninput={updateSetting('globalOffsetX')}
        class="number-input"
      />
    </div>
    
    <div class="setting-item">
      <label for="globalOffsetY">Offset Y:</label>
      <input
        id="globalOffsetY"
        type="range"
        min={CONSTRAINTS.OffsetMin}
        max={CONSTRAINTS.OffsetMax}
        value={globalSettings.globalOffsetY}
        oninput={updateSetting('globalOffsetY')}
      />
      <input
        type="number"
        min={CONSTRAINTS.OffsetMin}
        max={CONSTRAINTS.OffsetMax}
        value={globalSettings.globalOffsetY}
        oninput={updateSetting('globalOffsetY')}
        class="number-input"
      />
    </div>
  </div>
</div>

<style>
  .transform-settings {
    display: flex;
    flex-direction: column;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .settings-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }
  
  .settings-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .settings-content {
    padding: 0.75rem 1rem;
  }
  
  .setting-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .setting-item:last-child {
    margin-bottom: 0;
  }
  
  .setting-item label {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
  
  .number-input {
    width: 50px;
    padding: 0.25rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.75rem;
  }
  
  /* Range input styling */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    background: var(--bg-primary);
    border-radius: 2px;
    outline: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
</style>
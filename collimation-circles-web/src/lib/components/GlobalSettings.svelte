<script lang="ts">
  import { settingsStore } from '../stores/settingsStore.svelte.js';
  import { CONSTRAINTS } from '../types/index.js';
  
  // Reactive declarations using Svelte 5 runes
  let globalSettings = $derived(settingsStore.globalSettings);
  
  function updateSetting(key: string) {
    return (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      let value: any = target.value;
      
      // Convert to appropriate type
      if (target.type === 'number' || target.type === 'range') {
        value = parseFloat(value);
      } else if (target.type === 'checkbox') {
        value = (target as HTMLInputElement).checked;
      }
      
      settingsStore.updateGlobalSetting(key as any, value);
    };
  }
  
  function resetGlobalSettings() {
    if (confirm('Reset all global settings to defaults?')) {
      settingsStore.resetGlobalSettings();
    }
  }
  
  function exportSettings() {
    const data = settingsStore.exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'collimation-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  let fileInput: HTMLInputElement;
  
  function importSettings() {
    fileInput.click();
  }
  
  function handleSettingsImport(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = settingsStore.importSettings(content);
      
      if (!success) {
        alert('Failed to import settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    target.value = '';
  }
</script>

<div class="global-settings">
  <div class="settings-header">
    <h3>Global Settings</h3>
    <div class="header-actions">
      <button onclick={exportSettings} title="Export settings">💾</button>
      <button onclick={importSettings} title="Import settings">📁</button>
      <button onclick={resetGlobalSettings} title="Reset to defaults">🔄</button>
    </div>
  </div>
  
  <div class="settings-content">
    <!-- Display Settings -->
    <div class="setting-group">
      <h4>Display</h4>
      
      <div class="setting-item">
        <label for="mainWindowOpacity">Window Opacity:</label>
        <input
          id="mainWindowOpacity"
          type="range"
          min={CONSTRAINTS.OpacityMin}
          max={CONSTRAINTS.OpacityMax}
          step="0.1"
          value={globalSettings.mainWindowOpacity}
          oninput={updateSetting('mainWindowOpacity')}
        />
        <input
          type="number"
          min={CONSTRAINTS.OpacityMin}
          max={CONSTRAINTS.OpacityMax}
          step="0.1"
          value={globalSettings.mainWindowOpacity}
          oninput={updateSetting('mainWindowOpacity')}
          class="number-input"
        />
      </div>
      
      <div class="setting-item checkbox-item">
        <input
          id="showLabels"
          type="checkbox"
          checked={globalSettings.showLabels}
          onchange={updateSetting('showLabels')}
        />
        <label for="showLabels">Show Labels</label>
      </div>
      
      <div class="setting-item">
        <label for="labelSize">Label Size:</label>
        <input
          id="labelSize"
          type="range"
          min={CONSTRAINTS.LabelSizeMin}
          max="100"
          value={globalSettings.labelSize}
          oninput={updateSetting('labelSize')}
        />
        <input
          type="number"
          min={CONSTRAINTS.LabelSizeMin}
          max="100"
          value={globalSettings.labelSize}
          oninput={updateSetting('labelSize')}
          class="number-input"
        />
      </div>
    </div>
    
    <!-- Appearance -->
    <div class="setting-group">
      <h4>Appearance</h4>
      
      <div class="setting-item">
        <label for="theme">Theme:</label>
        <select
          id="theme"
          value={globalSettings.theme}
          onchange={updateSetting('theme')}
          class="theme-select"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="night">Night</option>
        </select>
      </div>
    </div>
  </div>
  
  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    onchange={handleSettingsImport}
    style="display: none;"
  />
</div>

<style>
  .global-settings {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }
  
  .settings-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .header-actions {
    display: flex;
    gap: 0.25rem;
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
  
  .settings-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .setting-group {
    margin-bottom: 1.5rem;
  }
  
  .setting-group h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
  }
  
  .setting-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .setting-item.checkbox-item {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
  }
  
  .setting-item label {
    color: var(--text-secondary);
    font-size: 0.875rem;
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
  
  .theme-select, .language-select {
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
    grid-column: 2 / -1;
  }
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
  
  /* Range input styling */
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
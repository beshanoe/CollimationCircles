<script lang="ts">
  import { cameraStore } from '../stores/cameraStore.svelte.js';
  import type { ExtendedMediaTrackCapabilities } from '../types/index.js';
  import { RESOLUTIONS } from '../types/index.js';
  import { settingsStore } from '../stores/settingsStore.svelte.js';
  
  // Reactive declarations using Svelte 5 runes
  let cameras = $derived(cameraStore.cameras);
  let selectedCamera = $derived(cameraStore.selectedCamera);
  let isStreaming = $derived(cameraStore.isStreaming);
  let error = $derived(cameraStore.error);
  let cameraSettings = $derived(settingsStore.cameraSettings);
  let capabilities = $derived(cameraStore.getCameraCapabilities() as ExtendedMediaTrackCapabilities | null);
  
  function handleCameraSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const camera = cameras.find(c => c.id === target.value);
    if (camera) {
      cameraStore.selectCamera(camera);
    }
  }
  
  async function toggleStream() {
    if (isStreaming) {
      cameraStore.stopStream();
    } else {
      await cameraStore.startStream();
    }
  }
  
  async function refreshCameras() {
    await cameraStore.refreshCameras();
  }
  
  function updateCameraSetting(setting: string) {
    return async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = parseFloat(target.value);
      if (!isNaN(value)) {
        settingsStore.updateCameraSetting(setting as any, value);
        await cameraStore.applyCameraSetting(setting, value);
      }
    };
  }
  
  function resetCameraSettings() {
    if (confirm('Reset all camera settings to defaults?')) {
      settingsStore.resetCameraSettings();
    }
  }
  
  // Get camera control definitions based on actual capabilities
  function getCameraControls() {
    if (!capabilities) return [];
    
    const controls = [];
    
    // Brightness
    if (capabilities.brightness) {
      controls.push({
        key: 'brightness',
        label: 'Brightness',
        min: capabilities.brightness.min || 0,
        max: capabilities.brightness.max || 1,
        step: 0.01
      });
    }
    
    // Contrast
    if (capabilities.contrast) {
      controls.push({
        key: 'contrast',
        label: 'Contrast',
        min: capabilities.contrast.min || 0,
        max: capabilities.contrast.max || 1,
        step: 0.01
      });
    }
    
    // Saturation
    if (capabilities.saturation) {
      controls.push({
        key: 'saturation',
        label: 'Saturation',
        min: capabilities.saturation.min || 0,
        max: capabilities.saturation.max || 1,
        step: 0.01
      });
    }
    
    // Sharpness
    if (capabilities.sharpness) {
      controls.push({
        key: 'sharpness',
        label: 'Sharpness',
        min: capabilities.sharpness.min || 0,
        max: capabilities.sharpness.max || 1,
        step: 0.01
      });
    }
    
    // Zoom
    if (capabilities.zoom) {
      controls.push({
        key: 'zoom',
        label: 'Zoom',
        min: capabilities.zoom.min || 1,
        max: capabilities.zoom.max || 4,
        step: 0.1
      });
    }
    
    // Focus Distance
    if (capabilities.focusDistance) {
      controls.push({
        key: 'focus',
        label: 'Manual Focus',
        min: capabilities.focusDistance.min || 0,
        max: capabilities.focusDistance.max || 1,
        step: 0.01
      });
    }
    
    // Exposure Time (only when in manual mode)
    if (capabilities.exposureTime && cameraSettings.exposureMode === 'manual') {
      controls.push({
        key: 'exposure',
        label: 'Exposure Time',
        min: capabilities.exposureTime.min || 1,
        max: capabilities.exposureTime.max || 1000,
        step: 1
      });
    }

    // Exposure Compensation
    if (capabilities.exposureCompensation) {
      controls.push({
        key: 'exposureCompensation',
        label: 'Exposure Compensation',
        min: capabilities.exposureCompensation.min || 1,
        max: capabilities.exposureCompensation.max || 64,
        step: 1
      });
    }

    // Color Temperature (only when white balance is in manual mode)
    if (capabilities.colorTemperature && cameraSettings.whiteBalanceMode === 'manual') {
      controls.push({
        key: 'colorTemperature',
        label: 'Color Temperature',
        min: capabilities.colorTemperature.min || 2000,
        max: capabilities.colorTemperature.max || 10000,
        step: 100
      });
    }
    
    return controls;
  }
  
  let cameraControls = $derived(getCameraControls());
  
  // Autofocus state from settings
  let autofocusEnabled = $derived(cameraSettings.autofocusEnabled ?? true);
  
  async function toggleAutofocus() {
    const newState = !autofocusEnabled;
    settingsStore.updateCameraSetting('autofocusEnabled', newState);
    await cameraStore.toggleAutofocus(newState);
  }
  
  function handleResolutionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    settingsStore.updateCameraSetting('resolution', target.value);
    // Restart stream with new resolution
    if (isStreaming) {
      cameraStore.stopStream();
      setTimeout(() => cameraStore.startStream(), 100);
    }
  }
  
  async function handleExposureModeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const mode = target.value as 'continuous' | 'manual';
    settingsStore.updateCameraSetting('exposureMode', mode);
    await cameraStore.setExposureMode(mode);
  }

  async function handleWhiteBalanceModeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const mode = target.value as 'continuous' | 'manual';
    settingsStore.updateCameraSetting('whiteBalanceMode', mode);
    await cameraStore.setWhiteBalanceMode(mode);
  }
</script>

<div class="camera-controls">
  <div class="controls-header">
    <h3>Camera</h3>
    <button
      onclick={refreshCameras}
      class="refresh-btn"
      title="Refresh camera list"
    >
      🔄
    </button>
  </div>
  
  <!-- Camera Selection -->
  <div class="control-section">
    <h4>Camera Selection</h4>
    
    <div class="control-item">
      <label for="camera-select">Camera:</label>
      <select
        id="camera-select"
        value={selectedCamera?.id || ''}
        onchange={handleCameraSelect}
        disabled={cameras.length === 0}
      >
        <option value="">Select Camera</option>
        {#each cameras as camera}
          <option value={camera.id}>
            {camera.name} ({camera.apiType})
          </option>
        {/each}
      </select>
    </div>
    
    <div class="control-item">
      <label for="resolution-select">Resolution:</label>
      <select
        id="resolution-select"
        value={cameraSettings.resolution || '1280x720'}
        onchange={handleResolutionChange}
      >
        {#each RESOLUTIONS as resolution}
          <option value={resolution.value}>
            {resolution.label}
          </option>
        {/each}
      </select>
    </div>
    
    <div class="control-item">
      <button
        onclick={toggleStream}
        class="stream-btn"
        class:streaming={isStreaming}
        disabled={!selectedCamera}
      >
        {isStreaming ? '⏹️ Stop' : '▶️ Play'}
      </button>
    </div>
    
    {#if error}
      <div class="error-message">
        <p>{error}</p>
      </div>
    {/if}
  </div>
  
  
  <!-- Camera Controls (only show when streaming) -->
  {#if isStreaming && capabilities}
    <div class="control-section">
      <div class="section-header">
        <h4>Camera Controls</h4>
        <button
          onclick={resetCameraSettings}
          class="reset-btn"
          title="Reset to defaults"
        >
          Reset
        </button>
      </div>
      
      <!-- Autofocus Toggle -->
      {#if capabilities.focusMode}
        <div class="control-item">
          <label for="autofocus">Autofocus:</label>
          <button
            id="autofocus"
            onclick={toggleAutofocus}
            class="toggle-btn"
            class:active={autofocusEnabled}
          >
            {autofocusEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      {/if}
      
      <!-- Exposure Mode -->
      {#if capabilities.exposureMode}
        <div class="control-item">
          <label for="exposure-mode">Exposure Mode:</label>
          <select
            id="exposure-mode"
            value={cameraSettings.exposureMode || 'continuous'}
            onchange={handleExposureModeChange}
          >
            <option value="continuous">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      {/if}

      <!-- White Balance Mode -->
      {#if capabilities.whiteBalanceMode}
        <div class="control-item">
          <label for="white-balance-mode">White Balance:</label>
          <select
            id="white-balance-mode"
            value={cameraSettings.whiteBalanceMode || 'continuous'}
            onchange={handleWhiteBalanceModeChange}
          >
            <option value="continuous">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      {/if}
      
      {#each cameraControls as control}
        <div class="control-item">
          <label for={control.key}>{control.label}:</label>
          <input
            id={control.key}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step}
            value={cameraSettings[control.key] ?? control.min}
            oninput={updateCameraSetting(control.key)}
            disabled={control.key === 'focus' && autofocusEnabled}
          />
          <input
            type="number"
            min={control.min}
            max={control.max}
            step={control.step}
            value={cameraSettings[control.key] ?? control.min}
            oninput={updateCameraSetting(control.key)}
            class="number-input"
            disabled={control.key === 'focus' && autofocusEnabled}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .camera-controls {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-secondary);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }
  
  .controls-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .refresh-btn {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .refresh-btn:hover {
    background: var(--bg-hover);
  }
  
  .control-section {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .control-section:last-child {
    border-bottom: none;
    flex: 1;
    overflow-y: auto;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .control-section h4 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .reset-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
  }
  
  .reset-btn:hover {
    background: var(--bg-hover);
  }
  
  .toggle-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    min-width: 50px;
    grid-column: 2 / -1;
  }
  
  .toggle-btn:hover {
    background: var(--bg-hover);
  }
  
  .toggle-btn.active {
    background: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
  
  .control-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .control-item label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .control-item select {
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
    grid-column: 2 / -1;
  }
  
  .control-item input[type="number"] {
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.875rem;
    grid-column: 2 / -1;
  }
  
  .number-input {
    width: 60px;
  }
  
  .stream-btn {
    padding: 0.75rem 1rem;
    background: var(--accent-color);
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    font-size: 0.875rem;
    grid-column: 1 / -1;
    transition: background-color 0.2s ease;
  }
  
  .stream-btn:hover {
    background: var(--accent-color-hover, #339af0);
  }
  
  .stream-btn.streaming {
    background: var(--error-color);
  }
  
  .stream-btn.streaming:hover {
    background: var(--error-color-hover, #ff5252);
  }
  
  .stream-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-message {
    grid-column: 1 / -1;
    padding: 0.5rem;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid var(--error-color);
    border-radius: 4px;
    color: var(--error-color);
    font-size: 0.875rem;
  }
  
  .error-message p {
    margin: 0;
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
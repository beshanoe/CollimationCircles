<script lang="ts">
  import { onMount } from 'svelte';
  import VideoStream from '$lib/components/VideoStream.svelte';
  import CollimationCanvas from '$lib/components/CollimationCanvas.svelte';
  import ShapesList from '$lib/components/ShapesList.svelte';
  import ShapeProperties from '$lib/components/ShapeProperties.svelte';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import CameraControls from '$lib/components/CameraControls.svelte';
  import GlobalSettings from '$lib/components/GlobalSettings.svelte';
  import TransformSettings from '$lib/components/TransformSettings.svelte';
  import { settingsStore } from '$lib/stores/settingsStore.svelte.js';
  import { shapesStore } from '$lib/stores/shapesStore.svelte.js';
  
  // Reactive declarations using Svelte 5 runes
  let globalSettings = $derived(settingsStore.globalSettings);
  let dockedInMainWindow = $derived(globalSettings.dockedInMainWindow);
  let shapes = $derived(shapesStore.shapes);
  let hasShapes = $derived(shapes.length > 0);
  
  let activeTab = $state<'shapes' | 'tools' | 'settings'>('shapes');
  
  onMount(() => {
    // Apply initial theme
    applyTheme(globalSettings.theme);
  });
  
  // Apply theme changes
  $effect(() => {
    applyTheme(globalSettings.theme);
  });
  
  function applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  
  function setActiveTab(tab: 'shapes' | 'tools' | 'settings') {
    activeTab = tab;
  }
</script>

<svelte:head>
  <title>Collimation Circles - Web</title>
  <meta name="description" content="Telescope collimation assistance web application" />
</svelte:head>

<div class="app" class:docked={dockedInMainWindow}>
  <!-- Main content area with video and overlay -->
  <div class="main-content">
    <div class="video-overlay-container">
      <!-- Video stream background -->
      <div class="video-background">
        <VideoStream />
      </div>
      
      <!-- Collimation overlay -->
      <div class="overlay-layer" class:has-shapes={hasShapes}>
        <CollimationCanvas />
      </div>
    </div>
  </div>
  
  <!-- Settings panel -->
  <div class="settings-panel" class:docked={dockedInMainWindow}>
    {#if dockedInMainWindow}
      <!-- Tabbed interface for docked mode -->
      <div class="tab-header">
        <button
          class="tab-button"
          class:active={activeTab === 'shapes'}
          onclick={() => setActiveTab('shapes')}
        >
          🔵 Shapes
        </button>
        <button
          class="tab-button"
          class:active={activeTab === 'tools'}
          onclick={() => setActiveTab('tools')}
        >
          🎥 Tools
        </button>
        <button
          class="tab-button"
          class:active={activeTab === 'settings'}
          onclick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div class="tab-content">
        {#if activeTab === 'shapes'}
          <div class="tab-panel shapes-panel">
            <div class="panel-section">
              <Toolbar />
            </div>
            <div class="panel-section">
              <TransformSettings />
            </div>
            <div class="panel-section">
              <ShapesList />
            </div>
            <div class="panel-section">
              <ShapeProperties />
            </div>
          </div>
        {:else if activeTab === 'tools'}
          <div class="tab-panel tools-panel">
            <div class="panel-section">
              <CameraControls />
            </div>
          </div>
        {:else if activeTab === 'settings'}
          <div class="tab-panel settings-panel-content">
            <div class="panel-section">
              <GlobalSettings />
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Floating panels for undocked mode -->
      <div class="floating-panels">
        <div class="floating-panel">
          <Toolbar />
        </div>
        <div class="floating-panel">
          <TransformSettings />
        </div>
        <div class="floating-panel">
          <ShapesList />
        </div>
        <div class="floating-panel">
          <ShapeProperties />
        </div>
        <div class="floating-panel">
          <CameraControls />
        </div>
        <div class="floating-panel">
          <GlobalSettings />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(:root) {
    /* Light theme */
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-tertiary: #e9ecef;
    --bg-hover: #e2e6ea;
    --bg-selected: #d4edda;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --border-color: #dee2e6;
    --accent-color: #007bff;
    --accent-color-hover: #0056b3;
    --error-color: #dc3545;
    --error-color-hover: #c82333;
  }
  
  :global([data-theme="dark"]) {
    --bg-primary: #2d3748;
    --bg-secondary: #1a202c;
    --bg-tertiary: #4a5568;
    --bg-hover: #4a5568;
    --bg-selected: #2b6cb0;
    --text-primary: #ffffff;
    --text-secondary: #cbd5e0;
    --border-color: #4a5568;
    --accent-color: #4299e1;
    --accent-color-hover: #3182ce;
    --error-color: #f56565;
    --error-color-hover: #e53e3e;
  }
  
  :global([data-theme="night"]) {
    --bg-primary: #1a1a1a;
    --bg-secondary: #0d0d0d;
    --bg-tertiary: #2d2d2d;
    --bg-hover: #404040;
    --bg-selected: #8b0000;
    --text-primary: #ff0000;
    --text-secondary: #cc0000;
    --border-color: #404040;
    --accent-color: #ff4444;
    --accent-color-hover: #cc0000;
    --error-color: #ff6666;
    --error-color-hover: #ff4444;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
  }
  
  .app {
    display: flex;
    height: 100vh;
    width: 100vw;
  }
  
  .main-content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .video-overlay-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .overlay-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }
  
  .overlay-layer.has-shapes {
    pointer-events: auto;
  }
  
  .settings-panel.docked {
    width: 350px;
    height: 100vh;
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }
  
  .tab-header {
    display: flex;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .tab-button {
    flex: 1;
    padding: 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .tab-button:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .tab-button.active {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-bottom: 2px solid var(--accent-color);
  }
  
  .tab-content {
    flex: 1;
    overflow: hidden;
  }
  
  .tab-panel {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .shapes-panel {
    gap: 1rem;
    padding: 1rem;
  }
  
  .shapes-panel .panel-section:nth-child(1) {
    flex: 0 0 auto;
  }
  
  .shapes-panel .panel-section:nth-child(2) {
    flex: 0 0 auto;
  }
  
  .shapes-panel .panel-section:nth-child(3) {
    flex: 1;
    min-height: 150px;
  }
  
  .shapes-panel .panel-section:nth-child(4) {
    flex: 1;
    min-height: 150px;
  }
  
  .tools-panel, .settings-panel-content {
    padding: 1rem;
  }
  
  .panel-section {
    overflow: hidden;
  }
  
  .floating-panels {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 1000;
    pointer-events: none;
  }
  
  .floating-panel {
    width: 300px;
    max-height: 80vh;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    pointer-events: auto;
    overflow: hidden;
  }
  
  /* Responsive design */
  @media (max-width: 1024px) {
    .app.docked {
      flex-direction: column;
    }
    
    .settings-panel.docked {
      width: 100%;
      height: 300px;
      border-left: none;
      border-top: 1px solid var(--border-color);
    }
  }
  
  @media (max-width: 768px) {
    .floating-panels {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      flex-direction: row;
      overflow-x: auto;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .floating-panel {
      width: 280px;
      flex-shrink: 0;
    }
  }
</style>

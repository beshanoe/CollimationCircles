<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { cameraStore } from '../stores/cameraStore.svelte.js';
  
  let videoElement = $state<HTMLVideoElement>();
  
  // Reactive declarations using Svelte 5 runes
  let stream = $derived(cameraStore.stream);
  let isStreaming = $derived(cameraStore.isStreaming);
  let error = $derived(cameraStore.error);
  
  // Update video element when stream changes
  $effect(() => {
    console.log('VideoStream effect triggered:', { 
      hasVideoElement: !!videoElement, 
      hasStream: !!stream, 
      isStreaming, 
      streamActive: stream?.active 
    });
    
    // Early return if no video element
    if (!videoElement) {
      console.log('No video element available yet');
      return;
    }
    
    if (stream && stream.active) {
      console.log('Setting video stream:', stream);
      videoElement.srcObject = stream;
      
      // Ensure video plays after setting the stream
      videoElement.play().then(() => {
        console.log('video.play() succeeded');
      }).catch(err => {
        console.error('Failed to play video:', err);
      });
    } else {
      console.log('Clearing video stream (no stream or inactive)');
      videoElement.srcObject = null;
    }
  });
  
  onMount(() => {
    console.log('VideoStream component mounted');
    // Auto-detect cameras on mount
    cameraStore.detectCameras();
  });
  
  onDestroy(() => {
    // Clean up stream when component is destroyed
    cameraStore.stopStream();
  });
  
  function handleVideoError(event: Event) {
    console.error('Video error:', event);
  }
</script>

<div class="video-container">
  {#if error}
    <div class="error-message">
      <p>Camera Error: {error}</p>
      <button onclick={() => cameraStore.detectCameras()}>
        Retry
      </button>
    </div>
  {:else if isStreaming && stream}
    <video
      bind:this={videoElement}
      autoplay
      muted
      playsinline
      onerror={handleVideoError}
      class="video-stream"
    ></video>
  {:else}
    <div class="no-stream">
      <p>No camera stream active</p>
      <p>Select a camera and click play to start</p>
    </div>
  {/if}
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .video-stream {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .error-message, .no-stream {
    text-align: center;
    color: #fff;
    padding: 2rem;
  }
  
  .error-message p {
    color: #ff6b6b;
    margin-bottom: 1rem;
  }
  
  .error-message button {
    background: #4dabf7;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error-message button:hover {
    background: #339af0;
  }
  
  .no-stream p {
    margin: 0.5rem 0;
    opacity: 0.7;
  }
</style>
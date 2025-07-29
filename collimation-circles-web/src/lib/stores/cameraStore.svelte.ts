import type { Camera, ExtendedMediaTrackCapabilities, ExtendedMediaTrackConstraints } from '../types/index.js';
import { settingsStore } from './settingsStore.svelte.js';

class CameraStore {
  private _cameras = $state<Camera[]>([]);
  private _selectedCamera = $state<Camera | null>(null);
  private _isStreaming = $state<boolean>(false);
  private _stream = $state<MediaStream | null>(null);
  private _error = $state<string | null>(null);

  constructor() {
    this.detectCameras();
  }

  get cameras(): Camera[] {
    return this._cameras;
  }

  get selectedCamera(): Camera | null {
    return this._selectedCamera;
  }

  get isStreaming(): boolean {
    return this._isStreaming;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }

  get error(): string | null {
    return this._error;
  }

  async detectCameras(): Promise<void> {
    try {
      this._error = null;
      console.log('Starting camera detection...');
      
      // First, try to get permission
      let permissionStream: MediaStream | null = null;
      try {
        permissionStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        console.log('Camera permission granted');
      } catch (permError) {
        this._error = 'Camera permission denied. Please allow camera access and refresh the page.';
        console.error('Permission error:', permError);
        return;
      }
      
      // Stop the permission stream immediately
      if (permissionStream) {
        permissionStream.getTracks().forEach(track => track.stop());
      }
      
      // Get available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Found video devices:', videoDevices);
      
      this._cameras = videoDevices.map(device => ({
        id: device.deviceId,
        name: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
        apiType: 'WebRTC'
      }));

      // Try to restore previously selected camera
      const savedCameraId = localStorage.getItem('selectedCameraId');
      let selectedCamera = null;
      
      if (savedCameraId) {
        selectedCamera = this._cameras.find(c => c.id === savedCameraId);
      }
      
      // Fallback to first camera if saved camera not found
      if (!selectedCamera && this._cameras.length > 0) {
        selectedCamera = this._cameras[0];
      }
      
      if (selectedCamera) {
        this._selectedCamera = selectedCamera;
        console.log('Selected camera:', this._selectedCamera);
        // Auto-start the stream for better UX
        await this.startStream();
      }
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to detect cameras';
      console.error('Camera detection failed:', error);
    }
  }

  selectCamera(camera: Camera): void {
    if (this._isStreaming) {
      this.stopStream();
    }
    this._selectedCamera = camera;
    
    // Persist selected camera to localStorage
    localStorage.setItem('selectedCameraId', camera.id);
  }

  async startStream(): Promise<void> {
    if (!this._selectedCamera || this._isStreaming) {
      console.log('Cannot start stream: no camera selected or already streaming');
      return;
    }

    try {
      this._error = null;
      console.log('Starting stream for camera:', this._selectedCamera);
      
      // Get resolution from settings
      const resolutionSetting = settingsStore.cameraSettings.resolution || '1280x720';
      const [widthStr, heightStr] = resolutionSetting.split('x');
      const targetWidth = parseInt(widthStr, 10);
      const targetHeight = parseInt(heightStr, 10);
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: this._selectedCamera.id ? { exact: this._selectedCamera.id } : undefined,
          width: { ideal: targetWidth, min: 640 },
          height: { ideal: targetHeight, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      };

      console.log('Using constraints:', constraints);
      this._stream = await navigator.mediaDevices.getUserMedia(constraints);
      this._isStreaming = true;
      console.log('Stream started successfully:', this._stream);
      
      // Add event listeners for stream health monitoring
      if (this._stream) {
        this._stream.getTracks().forEach(track => {
          track.addEventListener('ended', () => {
            console.log('Stream track ended');
            this._isStreaming = false;
            this._stream = null;
          });
        });
      }
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Failed to start camera stream';
      console.error('Failed to start stream:', error);
      
      // Try fallback constraints
      if (error instanceof Error && error.name === 'OverconstrainedError') {
        console.log('Trying fallback constraints...');
        try {
          const fallbackConstraints: MediaStreamConstraints = {
            video: {
              deviceId: this._selectedCamera.id ? { ideal: this._selectedCamera.id } : undefined
            },
            audio: false
          };
          
          this._stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          this._isStreaming = true;
          this._error = null;
          console.log('Stream started with fallback constraints');
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
    }
  }

  stopStream(): void {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    this._isStreaming = false;
  }

  async refreshCameras(): Promise<void> {
    this.stopStream();
    await this.detectCameras();
  }

  // Apply camera settings using proper capability ranges
  async applyCameraSetting(setting: string, value: number): Promise<void> {
    if (!this._stream) return;

    try {
      const videoTracks = this._stream.getVideoTracks();
      if (videoTracks.length === 0) return;

      const track = videoTracks[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      // Map our settings to MediaTrackConstraints using actual capability ranges
      const constraints: ExtendedMediaTrackConstraints = {};
      
      switch (setting) {
        case 'brightness':
          if ('brightness' in capabilities && capabilities.brightness) {
            constraints.brightness = value;
          }
          break;
        case 'contrast':
          if ('contrast' in capabilities && capabilities.contrast) {
            constraints.contrast = value;
          }
          break;
        case 'saturation':
          if ('saturation' in capabilities && capabilities.saturation) {
            constraints.saturation = value;
          }
          break;
        case 'sharpness':
          if ('sharpness' in capabilities && capabilities.sharpness) {
            constraints.sharpness = value;
          }
          break;
        case 'zoom':
          if ('zoom' in capabilities && capabilities.zoom) {
            constraints.zoom = value;
          }
          break;
        case 'focusDistance':
        case 'focus':
          if ('focusDistance' in capabilities && capabilities.focusDistance) {
            constraints.focusDistance = value;
          }
          break;
        case 'exposureTime':
        case 'exposure':
          if ('exposureTime' in capabilities && capabilities.exposureTime) {
            constraints.exposureTime = value;
          }
          break;
        case 'exposureCompensation':
          if ('exposureCompensation' in capabilities && capabilities.exposureCompensation) {
            constraints.exposureCompensation = value;
          }
          break;
        case 'colorTemperature':
          if ('colorTemperature' in capabilities && capabilities.colorTemperature) {
            constraints.colorTemperature = value;
          }
          break;
      }

      if (Object.keys(constraints).length > 0) {
        console.log(`Applying ${setting} constraint:`, constraints, 'capabilities:', capabilities[setting as keyof MediaTrackCapabilities]);
        await track.applyConstraints(constraints);
      }
    } catch (error) {
      console.warn(`Failed to apply camera setting ${setting}:`, error);
    }
  }

  // Toggle autofocus mode
  async toggleAutofocus(enabled: boolean): Promise<void> {
    if (!this._stream) return;

    try {
      const videoTracks = this._stream.getVideoTracks();
      if (videoTracks.length === 0) return;

      const track = videoTracks[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if ('focusMode' in capabilities) {
        const constraints: ExtendedMediaTrackConstraints = {
          focusMode: enabled ? 'continuous' : 'manual'
        };
        
        console.log('Setting focus mode:', constraints);
        await track.applyConstraints(constraints);
      }
    } catch (error) {
      console.warn('Failed to toggle autofocus:', error);
    }
  }

  // Set exposure mode
  async setExposureMode(mode: 'continuous' | 'manual'): Promise<void> {
    if (!this._stream) return;

    try {
      const videoTracks = this._stream.getVideoTracks();
      if (videoTracks.length === 0) return;

      const track = videoTracks[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if ('exposureMode' in capabilities && capabilities.exposureMode?.includes(mode)) {
        const constraints: ExtendedMediaTrackConstraints = {
          exposureMode: mode
        };
        
        console.log('Setting exposure mode:', constraints);
        await track.applyConstraints(constraints);
      }
    } catch (error) {
      console.warn('Failed to set exposure mode:', error);
    }
  }

  // Set white balance mode
  async setWhiteBalanceMode(mode: 'continuous' | 'manual'): Promise<void> {
    if (!this._stream) return;

    try {
      const videoTracks = this._stream.getVideoTracks();
      if (videoTracks.length === 0) return;

      const track = videoTracks[0];
      const capabilities = track.getCapabilities() as ExtendedMediaTrackCapabilities;
      
      if ('whiteBalanceMode' in capabilities && capabilities.whiteBalanceMode?.includes(mode)) {
        const constraints: ExtendedMediaTrackConstraints = {
          whiteBalanceMode: mode
        };
        
        console.log('Setting white balance mode:', constraints);
        await track.applyConstraints(constraints);
      }
    } catch (error) {
      console.warn('Failed to set white balance mode:', error);
    }
  }

  getCameraCapabilities(): ExtendedMediaTrackCapabilities | null {
    if (!this._stream) return null;
    
    const videoTracks = this._stream.getVideoTracks();
    return videoTracks.length > 0 ? videoTracks[0].getCapabilities() as ExtendedMediaTrackCapabilities : null;
  }

  getCameraSettings(): MediaTrackSettings | null {
    if (!this._stream) return null;
    
    const videoTracks = this._stream.getVideoTracks();
    return videoTracks.length > 0 ? videoTracks[0].getSettings() : null;
  }
}

export const cameraStore = new CameraStore();
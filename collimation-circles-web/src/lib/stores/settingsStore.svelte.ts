import type { GlobalSettings, CameraSettings } from '../types/index.js';

class SettingsStore {
  private _globalSettings = $state<GlobalSettings>({
    scale: 1.0,
    globalRotation: 0,
    globalOffsetX: 0,
    globalOffsetY: 0,
    mainWindowOpacity: 1.0,
    showLabels: true,
    labelSize: 16,
    alwaysOnTop: false,
    dockedInMainWindow: true,
    selectedLanguage: 'en-US',
    theme: 'dark'
  });

  private _cameraSettings = $state<CameraSettings>({
    streamTimeout: 1000,
    resolution: '1280x720',
    brightness: 50,
    contrast: 50,
    saturation: 50,
    hue: 0,
    gamma: 100,
    gain: 50,
    focus: 50,
    exposure: 50,
    exposureMode: 'continuous',
    exposureCompensation: 32,
    colorTemperature: 6000,
    whiteBalance: 4600,
    whiteBalanceMode: 'continuous',
    temperature: 6500,
    sharpness: 50,
    zoom: 100,
    autofocusEnabled: true
  });

  constructor() {
    // Load settings from localStorage on initialization
    this.loadSettings();
  }

  get globalSettings(): GlobalSettings {
    return this._globalSettings;
  }

  get cameraSettings(): CameraSettings {
    return this._cameraSettings;
  }

  updateGlobalSetting<K extends keyof GlobalSettings>(
    key: K, 
    value: GlobalSettings[K]
  ): void {
    this._globalSettings[key] = value;
    this.saveSettings();
  }

  updateCameraSetting<K extends keyof CameraSettings>(
    key: K, 
    value: CameraSettings[K]
  ): void {
    if (value !== undefined) {
      this._cameraSettings[key] = value;
      this.saveSettings();
    }
  }

  resetGlobalSettings(): void {
    this._globalSettings = {
      scale: 1.0,
      globalRotation: 0,
      globalOffsetX: 0,
      globalOffsetY: 0,
      mainWindowOpacity: 1.0,
      showLabels: true,
      labelSize: 16,
      alwaysOnTop: false,
      dockedInMainWindow: true,
      selectedLanguage: 'en-US',
      theme: 'dark'
    };
    this.saveSettings();
  }

  resetCameraSettings(): void {
    this._cameraSettings = {
      streamTimeout: 1000,
      resolution: '1280x720',
      brightness: 50,
      contrast: 50,
      saturation: 50,
      hue: 0,
      gamma: 100,
      gain: 50,
      focus: 50,
      exposure: 50,
      exposureMode: 'continuous',
      exposureCompensation: 32,
      colorTemperature: 6000,
      whiteBalance: 4600,
      whiteBalanceMode: 'continuous',
      temperature: 6500,
      sharpness: 50,
      zoom: 100,
      autofocusEnabled: true
    };
    this.saveSettings();
  }

  private saveSettings(): void {
    try {
      const settings = {
        global: this._globalSettings,
        camera: this._cameraSettings
      };
      localStorage.setItem('collimation-circles-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('collimation-circles-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.global) {
          this._globalSettings = { ...this._globalSettings, ...settings.global };
        }
        if (settings.camera) {
          this._cameraSettings = { ...this._cameraSettings, ...settings.camera };
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  exportSettings(): string {
    return JSON.stringify({
      version: '1.0',
      global: this._globalSettings,
      camera: this._cameraSettings
    }, null, 2);
  }

  importSettings(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.global) {
        this._globalSettings = { ...this._globalSettings, ...data.global };
      }
      if (data.camera) {
        this._cameraSettings = { ...this._cameraSettings, ...data.camera };
      }
      
      this.saveSettings();
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }
}

export const settingsStore = new SettingsStore();
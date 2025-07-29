// Core type definitions for Collimation Circles web app

export interface ICollimationHelper {
  id: string;
  itemColor: string;
  label?: string;
  thickness: number;
  radius: number;
  rotationIncrement: number;
  inclinationIncrement: number;
  isVisible: boolean;
  isRotatable: boolean;
  isInclinatable: boolean;
  isSizeable: boolean;
  isEditable: boolean;
  isCountable: boolean;
  rotationAngle: number;
  inclinationAngle: number;
  size: number;
  count: number;
  maxCount: number;
  opacity: number;
}

export type ShapeType = 'circle' | 'screw' | 'primaryClip' | 'spider';

export interface Camera {
  id: string;
  name: string;
  apiType: string;
}

export interface GlobalSettings {
  scale: number;
  globalRotation: number;
  globalOffsetX: number;
  globalOffsetY: number;
  mainWindowOpacity: number;
  showLabels: boolean;
  labelSize: number;
  alwaysOnTop: boolean;
  dockedInMainWindow: boolean;
  selectedLanguage: string;
  theme: 'light' | 'dark' | 'night';
}

export interface CameraSettings {
  selectedCameraId?: string;
  streamTimeout: number;
  resolution?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  gamma?: number;
  gain?: number;
  focus?: number;
  exposure?: number;
  exposureMode?: 'continuous' | 'manual';
  exposureCompensation?: number;
  colorTemperature?: number;
  whiteBalance?: number;
  whiteBalanceMode?: 'continuous' | 'manual';
  temperature?: number;
  sharpness?: number;
  zoom?: number;
  autofocusEnabled?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export const CONSTRAINTS = {
  ThicknessMin: 1,
  ThicknessMax: 10,
  RadiusMin: 1,
  RadiusMax: 2000,
  RotationAngleMin: -180,
  RotationAngleMax: 180,
  InclinationAngleMin: -90,
  InclinationAngleMax: 90,
  SizeMin: 1,
  SizeMax: 100,
  CountMin: 1,
  CountMax: 10,
  OpacityMin: 0.1,
  OpacityMax: 1.0,
  ScaleMin: 1.0,
  ScaleMax: 4.0,
  LabelSizeMin: 5,
  LabelSizeMax: 1000,
  OffsetMin: -1000,
  OffsetMax: 1000
} as const;

export const COLORS = [
  '#FF0000', // Red
  '#00FF00', // Lime
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFFFFF', // White
  '#808080', // Gray
  '#800000', // Maroon
  '#008000', // Green
  '#000080', // Navy
  '#FFA500', // Orange
  '#800080'  // Purple
] as const;

export const LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'sl-SI', name: 'Slovenščina' },
  { code: 'fr-FR', name: 'Français' }
] as const;

export const RESOLUTIONS = [
  { label: '640x480', value: '640x480', width: 640, height: 480 },
  { label: '800x600', value: '800x600', width: 800, height: 600 },
  { label: '1024x768', value: '1024x768', width: 1024, height: 768 },
  { label: '1280x720 (720p)', value: '1280x720', width: 1280, height: 720 },
  { label: '1920x1080 (1080p)', value: '1920x1080', width: 1920, height: 1080 },
  { label: '2560x1440 (1440p)', value: '2560x1440', width: 2560, height: 1440 },
  { label: '3840x2160 (4K)', value: '3840x2160', width: 3840, height: 2160 }
] as const;

// Extended WebRTC types for camera capabilities
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  brightness?: DoubleRange;
  contrast?: DoubleRange;
  saturation?: DoubleRange;
  sharpness?: DoubleRange;
  zoom?: DoubleRange;
  focusDistance?: DoubleRange;
  exposureTime?: DoubleRange;
  exposureCompensation?: DoubleRange;
  colorTemperature?: DoubleRange;
  whiteBalanceMode?: string[];
  focusMode?: string[];
  exposureMode?: string[];
}

export interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
  brightness?: number | ConstrainDouble;
  contrast?: number | ConstrainDouble;
  saturation?: number | ConstrainDouble;
  sharpness?: number | ConstrainDouble;
  zoom?: number | ConstrainDouble;
  focusDistance?: number | ConstrainDouble;
  exposureTime?: number | ConstrainDouble;
  exposureCompensation?: number | ConstrainDouble;
  colorTemperature?: number | ConstrainDouble;
  whiteBalanceMode?: string | ConstrainDOMString;
  focusMode?: string | ConstrainDOMString;
  exposureMode?: string | ConstrainDOMString;
}
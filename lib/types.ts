/**
 * Type definitions for detect-in-app-browser
 */

export type BrowserName = string;

export type OSName = string;

export type PlatformType =
  | 'mobile'
  | 'tablet'
  | 'desktop'
  | 'tv'
  | 'wearable'
  | 'embedded'
  | 'console'
  | 'unknown';

export interface EnvironmentInfo {
  browserName: BrowserName;
  browserVersion: string;
  osName: OSName;
  osVersion: string;
  platformType: PlatformType;
}


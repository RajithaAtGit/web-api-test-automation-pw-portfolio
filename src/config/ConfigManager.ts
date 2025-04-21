/**
 * @file ConfigManager.ts
 * @author R N W Gunawardana
 * @copyright Copyright (c) 2025 R N W Gunawardana
 * @license Proprietary and Confidential
 * 
 * This file is part of the Web API Test Automation Framework with Playwright.
 * 
 * This codebase may be utilized for training artificial intelligence and machine learning models
 * aimed at improving software development tools and practices. The training process may involve
 * the analysis of code patterns, structures, and documentation to enhance AI capabilities in
 * code comprehension and generation. If this code is used for such purposes, appropriate credit
 * or compensation should be given to the original author where applicable.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { devices } from '@playwright/test';

/**
 * ConfigManager
 * 
 * Manages environment-specific configuration, browser configuration options,
 * timeout settings, and device profiles.
 * Implements the Singleton pattern for consistent configuration.
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigData = {
    environment: 'development',
    baseUrl: '',
    apiBaseUrl: '',
    timeouts: {
      defaultTimeout: 30000,
      navigationTimeout: 60000,
      actionTimeout: 10000,
      waitForElementTimeout: 5000
    },
    browser: {
      headless: true,
      slowMo: 0,
      defaultBrowserType: 'chromium',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      deviceScaleFactor: 1
    },
    devices: {},
    auth: {
      username: '',
      password: '',
      apiToken: ''
    },
    network: {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    },
    reporting: {
      screenshotsDir: './test-results/screenshots',
      videosDir: './test-results/videos',
      tracesDir: './test-results/traces',
      reportsDir: './test-results/reports',
      captureVideo: false,
      captureTrace: false,
      captureScreenshotOnFailure: true
    }
  };

  /**
   * Creates a new ConfigManager instance
   * @param envPath Path to .env file
   */
  private constructor(envPath?: string) {
    this.loadEnv(envPath);
    this.initializeConfig();
  }

  /**
   * Gets the singleton instance of the ConfigManager
   * @param envPath Optional path to .env file
   * @returns The singleton instance
   */
  public static getInstance(envPath?: string): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager(envPath);
    }
    return ConfigManager.instance;
  }

  /**
   * Loads environment variables from .env file
   * @param envPath Path to .env file
   */
  private loadEnv(envPath?: string): void {
    const envFile = envPath || path.resolve(process.cwd(), '.env');
    dotenv.config({ path: envFile });
  }

  /**
   * Initializes configuration from environment variables
   */
  private initializeConfig(): void {
    // Environment
    this.config.environment = process.env.NODE_ENV || 'development';

    // URLs
    this.config.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    this.config.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';

    // Timeouts
    this.config.timeouts.defaultTimeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);
    this.config.timeouts.navigationTimeout = parseInt(process.env.NAVIGATION_TIMEOUT || '60000', 10);
    this.config.timeouts.actionTimeout = parseInt(process.env.ACTION_TIMEOUT || '10000', 10);
    this.config.timeouts.waitForElementTimeout = parseInt(process.env.WAIT_FOR_ELEMENT_TIMEOUT || '5000', 10);

    // Browser
    this.config.browser.headless = process.env.HEADLESS !== 'false';
    this.config.browser.slowMo = parseInt(process.env.SLOW_MO || '0', 10);
    this.config.browser.defaultBrowserType = process.env.DEFAULT_BROWSER_TYPE as BrowserType || 'chromium';
    this.config.browser.ignoreHTTPSErrors = process.env.IGNORE_HTTPS_ERRORS !== 'false';

    if (process.env.VIEWPORT_WIDTH && process.env.VIEWPORT_HEIGHT) {
      this.config.browser.viewport = {
        width: parseInt(process.env.VIEWPORT_WIDTH, 10),
        height: parseInt(process.env.VIEWPORT_HEIGHT, 10)
      };
    }

    // Auth
    this.config.auth.username = process.env.AUTH_USERNAME || '';
    this.config.auth.password = process.env.AUTH_PASSWORD || '';
    this.config.auth.apiToken = process.env.API_TOKEN || '';

    // Network
    this.config.network.offline = process.env.NETWORK_OFFLINE === 'true';
    this.config.network.latency = parseInt(process.env.NETWORK_LATENCY || '0', 10);
    this.config.network.downloadThroughput = parseInt(process.env.NETWORK_DOWNLOAD_THROUGHPUT || '-1', 10);
    this.config.network.uploadThroughput = parseInt(process.env.NETWORK_UPLOAD_THROUGHPUT || '-1', 10);

    // Reporting
    this.config.reporting.screenshotsDir = process.env.SCREENSHOTS_DIR || './test-results/screenshots';
    this.config.reporting.videosDir = process.env.VIDEOS_DIR || './test-results/videos';
    this.config.reporting.tracesDir = process.env.TRACES_DIR || './test-results/traces';
    this.config.reporting.reportsDir = process.env.REPORTS_DIR || './test-results/reports';
    this.config.reporting.captureVideo = process.env.CAPTURE_VIDEO === 'true';
    this.config.reporting.captureTrace = process.env.CAPTURE_TRACE === 'true';
    this.config.reporting.captureScreenshotOnFailure = process.env.CAPTURE_SCREENSHOT_ON_FAILURE !== 'false';

    // Initialize device profiles
    this.initializeDeviceProfiles();
  }

  /**
   * Initializes device profiles
   */
  private initializeDeviceProfiles(): void {
    // Add standard device profiles from Playwright
    this.config.devices = {
      desktop: {
        name: 'Desktop',
        userAgent: '',
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      },
      mobile: {
        name: 'Mobile',
        userAgent: '',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      },
      tablet: {
        name: 'Tablet',
        userAgent: '',
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    };

    // Add Playwright device descriptors
    for (const [name, device] of Object.entries(devices)) {
      this.config.devices[name] = {
        name,
        userAgent: device.userAgent,
        viewport: device.viewport,
        deviceScaleFactor: device.deviceScaleFactor,
        isMobile: device.isMobile,
        hasTouch: device.hasTouch
      };
    }
  }

  /**
   * Gets the current configuration
   * @returns The current configuration
   */
  public getConfig(): ConfigData {
    return { ...this.config };
  }

  /**
   * Updates the configuration
   * @param config Partial configuration to update
   */
  public updateConfig(config: Partial<ConfigData>): void {
    this.config = {
      ...this.config,
      ...config,
      timeouts: {
        ...this.config.timeouts,
        ...config.timeouts
      },
      browser: {
        ...this.config.browser,
        ...config.browser
      },
      auth: {
        ...this.config.auth,
        ...config.auth
      },
      network: {
        ...this.config.network,
        ...config.network
      },
      reporting: {
        ...this.config.reporting,
        ...config.reporting
      }
    };
  }

  /**
   * Gets browser launch options based on current configuration
   * @returns Browser launch options
   */
  public getBrowserLaunchOptions(): BrowserLaunchOptions {
    return {
      headless: this.config.browser.headless,
      slowMo: this.config.browser.slowMo,
      ignoreHTTPSErrors: this.config.browser.ignoreHTTPSErrors,
      args: []
    };
  }

  /**
   * Gets context options based on current configuration
   * @param deviceName Optional device name to use
   * @returns Context options
   */
  public getContextOptions(deviceName?: string): ContextOptions {
    const device = deviceName ? this.config.devices[deviceName] : undefined;

    return {
      baseURL: this.config.baseUrl,
      viewport: device?.viewport || this.config.browser.viewport,
      userAgent: device?.userAgent,
      deviceScaleFactor: device?.deviceScaleFactor || this.config.browser.deviceScaleFactor,
      isMobile: device?.isMobile || false,
      hasTouch: device?.hasTouch || false,
      ignoreHTTPSErrors: this.config.browser.ignoreHTTPSErrors,
      offline: this.config.network.offline,
      recordVideo: this.config.reporting.captureVideo ? {
        dir: this.config.reporting.videosDir
      } : undefined
    };
  }

  /**
   * Gets the base URL for the current environment
   * @returns The base URL
   */
  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Gets the API base URL for the current environment
   * @returns The API base URL
   */
  public getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Gets the default timeout
   * @returns The default timeout in milliseconds
   */
  public getDefaultTimeout(): number {
    return this.config.timeouts.defaultTimeout;
  }

  /**
   * Gets the navigation timeout
   * @returns The navigation timeout in milliseconds
   */
  public getNavigationTimeout(): number {
    return this.config.timeouts.navigationTimeout;
  }

  /**
   * Gets the action timeout
   * @returns The action timeout in milliseconds
   */
  public getActionTimeout(): number {
    return this.config.timeouts.actionTimeout;
  }

  /**
   * Gets the wait for element timeout
   * @returns The wait for element timeout in milliseconds
   */
  public getWaitForElementTimeout(): number {
    return this.config.timeouts.waitForElementTimeout;
  }

  /**
   * Gets the current environment
   * @returns The current environment
   */
  public getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Checks if the current environment is production
   * @returns True if the current environment is production
   */
  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Gets authentication credentials
   * @returns Authentication credentials
   */
  public getAuthCredentials(): AuthConfig {
    return { ...this.config.auth };
  }

  /**
   * Gets a device profile by name
   * @param name Device name
   * @returns Device profile or undefined if not found
   */
  public getDevice(name: string): DeviceProfile | undefined {
    return this.config.devices[name];
  }

  /**
   * Gets all available device profiles
   * @returns All device profiles
   */
  public getAllDevices(): Record<string, DeviceProfile> {
    return { ...this.config.devices };
  }

  /**
   * Gets reporting configuration
   * @returns Reporting configuration
   */
  public getReportingConfig(): ReportingConfig {
    return { ...this.config.reporting };
  }
}

/**
 * Configuration data
 */
export interface ConfigData {
  environment: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeouts: TimeoutConfig;
  browser: BrowserConfig;
  devices: Record<string, DeviceProfile>;
  auth: AuthConfig;
  network: NetworkConfig;
  reporting: ReportingConfig;
}

/**
 * Timeout configuration
 */
export interface TimeoutConfig {
  defaultTimeout: number;
  navigationTimeout: number;
  actionTimeout: number;
  waitForElementTimeout: number;
}

/**
 * Browser configuration
 */
export interface BrowserConfig {
  headless: boolean;
  slowMo: number;
  defaultBrowserType: BrowserType;
  viewport: { width: number; height: number };
  ignoreHTTPSErrors: boolean;
  deviceScaleFactor: number;
}

/**
 * Browser type
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * Device profile
 */
export interface DeviceProfile {
  name: string;
  userAgent: string;
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  username: string;
  password: string;
  apiToken: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  offline: boolean;
  latency: number;
  downloadThroughput: number;
  uploadThroughput: number;
}

/**
 * Reporting configuration
 */
export interface ReportingConfig {
  screenshotsDir: string;
  videosDir: string;
  tracesDir: string;
  reportsDir: string;
  captureVideo: boolean;
  captureTrace: boolean;
  captureScreenshotOnFailure: boolean;
}

/**
 * Browser launch options
 */
export interface BrowserLaunchOptions {
  headless: boolean;
  slowMo: number;
  ignoreHTTPSErrors: boolean;
  args: string[];
}

/**
 * Context options
 */
export interface ContextOptions {
  baseURL: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  ignoreHTTPSErrors: boolean;
  offline: boolean;
  recordVideo?: { dir: string };
}

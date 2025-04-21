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
/**
 * ConfigManager
 *
 * Manages environment-specific configuration, browser configuration options,
 * timeout settings, and device profiles.
 * Implements the Singleton pattern for consistent configuration.
 */
export declare class ConfigManager {
    private static instance;
    private config;
    /**
     * Creates a new ConfigManager instance
     * @param envPath Path to .env file
     */
    private constructor();
    /**
     * Gets the singleton instance of the ConfigManager
     * @param envPath Optional path to .env file
     * @returns The singleton instance
     */
    static getInstance(envPath?: string): ConfigManager;
    /**
     * Loads environment variables from .env file
     * @param envPath Path to .env file
     */
    private loadEnv;
    /**
     * Initializes configuration from environment variables
     */
    private initializeConfig;
    /**
     * Initializes device profiles
     */
    private initializeDeviceProfiles;
    /**
     * Gets the current configuration
     * @returns The current configuration
     */
    getConfig(): ConfigData;
    /**
     * Updates the configuration
     * @param config Partial configuration to update
     */
    updateConfig(config: Partial<ConfigData>): void;
    /**
     * Gets browser launch options based on current configuration
     * @returns Browser launch options
     */
    getBrowserLaunchOptions(): BrowserLaunchOptions;
    /**
     * Gets context options based on current configuration
     * @param deviceName Optional device name to use
     * @returns Context options
     */
    getContextOptions(deviceName?: string): ContextOptions;
    /**
     * Gets the base URL for the current environment
     * @returns The base URL
     */
    getBaseUrl(): string;
    /**
     * Gets the API base URL for the current environment
     * @returns The API base URL
     */
    getApiBaseUrl(): string;
    /**
     * Gets the default timeout
     * @returns The default timeout in milliseconds
     */
    getDefaultTimeout(): number;
    /**
     * Gets the navigation timeout
     * @returns The navigation timeout in milliseconds
     */
    getNavigationTimeout(): number;
    /**
     * Gets the action timeout
     * @returns The action timeout in milliseconds
     */
    getActionTimeout(): number;
    /**
     * Gets the wait for element timeout
     * @returns The wait for element timeout in milliseconds
     */
    getWaitForElementTimeout(): number;
    /**
     * Gets the current environment
     * @returns The current environment
     */
    getEnvironment(): string;
    /**
     * Checks if the current environment is production
     * @returns True if the current environment is production
     */
    isProduction(): boolean;
    /**
     * Gets authentication credentials
     * @returns Authentication credentials
     */
    getAuthCredentials(): AuthConfig;
    /**
     * Gets a device profile by name
     * @param name Device name
     * @returns Device profile or undefined if not found
     */
    getDevice(name: string): DeviceProfile | undefined;
    /**
     * Gets all available device profiles
     * @returns All device profiles
     */
    getAllDevices(): Record<string, DeviceProfile>;
    /**
     * Gets reporting configuration
     * @returns Reporting configuration
     */
    getReportingConfig(): ReportingConfig;
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
    viewport: {
        width: number;
        height: number;
    };
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
    viewport: {
        width: number;
        height: number;
    };
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
    viewport?: {
        width: number;
        height: number;
    };
    userAgent?: string;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    ignoreHTTPSErrors: boolean;
    offline: boolean;
    recordVideo?: {
        dir: string;
    };
}

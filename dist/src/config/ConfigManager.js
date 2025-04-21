"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const test_1 = require("@playwright/test");
/**
 * ConfigManager
 *
 * Manages environment-specific configuration, browser configuration options,
 * timeout settings, and device profiles.
 * Implements the Singleton pattern for consistent configuration.
 */
class ConfigManager {
    static instance;
    config = {
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
    constructor(envPath) {
        this.loadEnv(envPath);
        this.initializeConfig();
    }
    /**
     * Gets the singleton instance of the ConfigManager
     * @param envPath Optional path to .env file
     * @returns The singleton instance
     */
    static getInstance(envPath) {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager(envPath);
        }
        return ConfigManager.instance;
    }
    /**
     * Loads environment variables from .env file
     * @param envPath Path to .env file
     */
    loadEnv(envPath) {
        const envFile = envPath || path.resolve(process.cwd(), '.env');
        dotenv.config({ path: envFile });
    }
    /**
     * Initializes configuration from environment variables
     */
    initializeConfig() {
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
        this.config.browser.defaultBrowserType = process.env.DEFAULT_BROWSER_TYPE || 'chromium';
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
    initializeDeviceProfiles() {
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
        for (const [name, device] of Object.entries(test_1.devices)) {
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
    getConfig() {
        return { ...this.config };
    }
    /**
     * Updates the configuration
     * @param config Partial configuration to update
     */
    updateConfig(config) {
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
    getBrowserLaunchOptions() {
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
    getContextOptions(deviceName) {
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
    getBaseUrl() {
        return this.config.baseUrl;
    }
    /**
     * Gets the API base URL for the current environment
     * @returns The API base URL
     */
    getApiBaseUrl() {
        return this.config.apiBaseUrl;
    }
    /**
     * Gets the default timeout
     * @returns The default timeout in milliseconds
     */
    getDefaultTimeout() {
        return this.config.timeouts.defaultTimeout;
    }
    /**
     * Gets the navigation timeout
     * @returns The navigation timeout in milliseconds
     */
    getNavigationTimeout() {
        return this.config.timeouts.navigationTimeout;
    }
    /**
     * Gets the action timeout
     * @returns The action timeout in milliseconds
     */
    getActionTimeout() {
        return this.config.timeouts.actionTimeout;
    }
    /**
     * Gets the wait for element timeout
     * @returns The wait for element timeout in milliseconds
     */
    getWaitForElementTimeout() {
        return this.config.timeouts.waitForElementTimeout;
    }
    /**
     * Gets the current environment
     * @returns The current environment
     */
    getEnvironment() {
        return this.config.environment;
    }
    /**
     * Checks if the current environment is production
     * @returns True if the current environment is production
     */
    isProduction() {
        return this.config.environment === 'production';
    }
    /**
     * Gets authentication credentials
     * @returns Authentication credentials
     */
    getAuthCredentials() {
        return { ...this.config.auth };
    }
    /**
     * Gets a device profile by name
     * @param name Device name
     * @returns Device profile or undefined if not found
     */
    getDevice(name) {
        return this.config.devices[name];
    }
    /**
     * Gets all available device profiles
     * @returns All device profiles
     */
    getAllDevices() {
        return { ...this.config.devices };
    }
    /**
     * Gets reporting configuration
     * @returns Reporting configuration
     */
    getReportingConfig() {
        return { ...this.config.reporting };
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=ConfigManager.js.map
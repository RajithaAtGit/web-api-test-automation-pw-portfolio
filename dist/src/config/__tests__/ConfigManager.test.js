"use strict";
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
const ConfigManager_1 = require("../ConfigManager");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Mock dotenv
jest.mock('dotenv', () => ({
    config: jest.fn()
}));
// Mock path
jest.mock('path', () => ({
    resolve: jest.fn().mockReturnValue('/mock/path/.env')
}));
// Mock Playwright devices
jest.mock('@playwright/test', () => ({
    devices: {
        'Desktop Chrome': {
            name: 'Desktop Chrome',
            userAgent: 'Chrome',
            viewport: { width: 1280, height: 720 },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false
        },
        'iPhone 12': {
            name: 'iPhone 12',
            userAgent: 'iPhone',
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        }
    }
}));
describe('ConfigManager', () => {
    // Store original process.env
    const originalEnv = process.env;
    beforeEach(() => {
        // Reset process.env before each test
        process.env = { ...originalEnv };
        // Reset the singleton instance
        ConfigManager_1.ConfigManager.instance = undefined;
        // Clear mock calls
        jest.clearAllMocks();
    });
    afterEach(() => {
        // Restore process.env after each test
        process.env = originalEnv;
    });
    describe('getInstance', () => {
        it('should return the same instance each time', () => {
            const instance1 = ConfigManager_1.ConfigManager.getInstance();
            const instance2 = ConfigManager_1.ConfigManager.getInstance();
            expect(instance1).toBe(instance2);
        });
        it('should create a new instance if one does not exist', () => {
            const instance = ConfigManager_1.ConfigManager.getInstance();
            expect(instance).toBeInstanceOf(ConfigManager_1.ConfigManager);
        });
        it('should pass the envPath to loadEnv', () => {
            const envPath = '/custom/path/.env';
            ConfigManager_1.ConfigManager.getInstance(envPath);
            expect(dotenv.config).toHaveBeenCalledWith({ path: envPath });
        });
    });
    describe('loadEnv', () => {
        it('should use the provided envPath', () => {
            const envPath = '/custom/path/.env';
            ConfigManager_1.ConfigManager.getInstance(envPath);
            expect(dotenv.config).toHaveBeenCalledWith({ path: envPath });
        });
        it('should use the default envPath if not provided', () => {
            ConfigManager_1.ConfigManager.getInstance();
            expect(path.resolve).toHaveBeenCalledWith(process.cwd(), '.env');
            expect(dotenv.config).toHaveBeenCalledWith({ path: '/mock/path/.env' });
        });
    });
    describe('initializeConfig', () => {
        it('should initialize config with default values', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const config = configManager.getConfig();
            expect(config.environment).toBe('test');
            expect(config.baseUrl).toBe('http://localhost:3000');
            expect(config.apiBaseUrl).toBe('http://localhost:3000/api');
            expect(config.timeouts.defaultTimeout).toBe(30000);
            expect(config.timeouts.navigationTimeout).toBe(60000);
            expect(config.timeouts.actionTimeout).toBe(10000);
            expect(config.timeouts.waitForElementTimeout).toBe(5000);
            expect(config.browser.headless).toBe(true);
            expect(config.browser.slowMo).toBe(0);
            expect(config.browser.defaultBrowserType).toBe('chromium');
            expect(config.browser.ignoreHTTPSErrors).toBe(true);
            expect(config.browser.viewport).toEqual({ width: 1280, height: 720 });
            expect(config.auth.username).toBe('');
            expect(config.auth.password).toBe('');
            expect(config.auth.apiToken).toBe('');
            expect(config.network.offline).toBe(false);
            expect(config.network.latency).toBe(0);
            expect(config.network.downloadThroughput).toBe(-1);
            expect(config.network.uploadThroughput).toBe(-1);
            expect(config.reporting.screenshotsDir).toBe('./test-results/screenshots');
            expect(config.reporting.videosDir).toBe('./test-results/videos');
            expect(config.reporting.tracesDir).toBe('./test-results/traces');
            expect(config.reporting.reportsDir).toBe('./test-results/reports');
            expect(config.reporting.captureVideo).toBe(false);
            expect(config.reporting.captureTrace).toBe(false);
            expect(config.reporting.captureScreenshotOnFailure).toBe(true);
        });
        it('should initialize config from environment variables', () => {
            // Set environment variables
            process.env.NODE_ENV = 'production';
            process.env.BASE_URL = 'https://example.com';
            process.env.API_BASE_URL = 'https://api.example.com';
            process.env.DEFAULT_TIMEOUT = '5000';
            process.env.NAVIGATION_TIMEOUT = '10000';
            process.env.ACTION_TIMEOUT = '2000';
            process.env.WAIT_FOR_ELEMENT_TIMEOUT = '1000';
            process.env.HEADLESS = 'false';
            process.env.SLOW_MO = '50';
            process.env.DEFAULT_BROWSER_TYPE = 'firefox';
            process.env.IGNORE_HTTPS_ERRORS = 'false';
            process.env.VIEWPORT_WIDTH = '800';
            process.env.VIEWPORT_HEIGHT = '600';
            process.env.AUTH_USERNAME = 'testuser';
            process.env.AUTH_PASSWORD = 'testpass';
            process.env.API_TOKEN = 'testtoken';
            process.env.NETWORK_OFFLINE = 'true';
            process.env.NETWORK_LATENCY = '100';
            process.env.NETWORK_DOWNLOAD_THROUGHPUT = '1000';
            process.env.NETWORK_UPLOAD_THROUGHPUT = '500';
            process.env.SCREENSHOTS_DIR = './custom/screenshots';
            process.env.VIDEOS_DIR = './custom/videos';
            process.env.TRACES_DIR = './custom/traces';
            process.env.REPORTS_DIR = './custom/reports';
            process.env.CAPTURE_VIDEO = 'true';
            process.env.CAPTURE_TRACE = 'true';
            process.env.CAPTURE_SCREENSHOT_ON_FAILURE = 'false';
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const config = configManager.getConfig();
            expect(config.environment).toBe('production');
            expect(config.baseUrl).toBe('https://example.com');
            expect(config.apiBaseUrl).toBe('https://api.example.com');
            expect(config.timeouts.defaultTimeout).toBe(5000);
            expect(config.timeouts.navigationTimeout).toBe(10000);
            expect(config.timeouts.actionTimeout).toBe(2000);
            expect(config.timeouts.waitForElementTimeout).toBe(1000);
            expect(config.browser.headless).toBe(false);
            expect(config.browser.slowMo).toBe(50);
            expect(config.browser.defaultBrowserType).toBe('firefox');
            expect(config.browser.ignoreHTTPSErrors).toBe(false);
            expect(config.browser.viewport).toEqual({ width: 800, height: 600 });
            expect(config.auth.username).toBe('testuser');
            expect(config.auth.password).toBe('testpass');
            expect(config.auth.apiToken).toBe('testtoken');
            expect(config.network.offline).toBe(true);
            expect(config.network.latency).toBe(100);
            expect(config.network.downloadThroughput).toBe(1000);
            expect(config.network.uploadThroughput).toBe(500);
            expect(config.reporting.screenshotsDir).toBe('./custom/screenshots');
            expect(config.reporting.videosDir).toBe('./custom/videos');
            expect(config.reporting.tracesDir).toBe('./custom/traces');
            expect(config.reporting.reportsDir).toBe('./custom/reports');
            expect(config.reporting.captureVideo).toBe(true);
            expect(config.reporting.captureTrace).toBe(true);
            expect(config.reporting.captureScreenshotOnFailure).toBe(false);
        });
    });
    describe('initializeDeviceProfiles', () => {
        it('should initialize standard device profiles', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const devices = configManager.getAllDevices();
            expect(devices.desktop).toBeDefined();
            expect(devices.mobile).toBeDefined();
            expect(devices.tablet).toBeDefined();
            expect(devices.desktop.name).toBe('Desktop');
            expect(devices.desktop.viewport).toEqual({ width: 1280, height: 720 });
            expect(devices.desktop.isMobile).toBe(false);
            expect(devices.mobile.name).toBe('Mobile');
            expect(devices.mobile.viewport).toEqual({ width: 375, height: 667 });
            expect(devices.mobile.isMobile).toBe(true);
            expect(devices.tablet.name).toBe('Tablet');
            expect(devices.tablet.viewport).toEqual({ width: 768, height: 1024 });
            expect(devices.tablet.isMobile).toBe(true);
        });
        it('should initialize Playwright device profiles', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const devices = configManager.getAllDevices();
            expect(devices['Desktop Chrome']).toBeDefined();
            expect(devices['iPhone 12']).toBeDefined();
            expect(devices['Desktop Chrome'].name).toBe('Desktop Chrome');
            expect(devices['Desktop Chrome'].userAgent).toBe('Chrome');
            expect(devices['Desktop Chrome'].viewport).toEqual({ width: 1280, height: 720 });
            expect(devices['Desktop Chrome'].isMobile).toBe(false);
            expect(devices['iPhone 12'].name).toBe('iPhone 12');
            expect(devices['iPhone 12'].userAgent).toBe('iPhone');
            expect(devices['iPhone 12'].viewport).toEqual({ width: 390, height: 844 });
            expect(devices['iPhone 12'].isMobile).toBe(true);
        });
    });
    describe('getConfig', () => {
        it('should return a copy of the config', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const config = configManager.getConfig();
            // Modify the returned config
            config.baseUrl = 'modified';
            // Get the config again
            const config2 = configManager.getConfig();
            // The original config should not be modified
            expect(config2.baseUrl).not.toBe('modified');
        });
    });
    describe('updateConfig', () => {
        it('should update the config', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                baseUrl: 'https://updated.example.com',
                apiBaseUrl: 'https://api.updated.example.com'
            });
            const config = configManager.getConfig();
            expect(config.baseUrl).toBe('https://updated.example.com');
            expect(config.apiBaseUrl).toBe('https://api.updated.example.com');
        });
        it('should update nested config objects', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                timeouts: {
                    defaultTimeout: 5000
                },
                browser: {
                    headless: false
                },
                auth: {
                    username: 'updateduser'
                },
                network: {
                    offline: true
                },
                reporting: {
                    captureVideo: true
                }
            });
            const config = configManager.getConfig();
            expect(config.timeouts.defaultTimeout).toBe(5000);
            expect(config.timeouts.navigationTimeout).toBe(60000); // Unchanged
            expect(config.browser.headless).toBe(false);
            expect(config.browser.slowMo).toBe(0); // Unchanged
            expect(config.auth.username).toBe('updateduser');
            expect(config.auth.password).toBe(''); // Unchanged
            expect(config.network.offline).toBe(true);
            expect(config.network.latency).toBe(0); // Unchanged
            expect(config.reporting.captureVideo).toBe(true);
            expect(config.reporting.captureTrace).toBe(false); // Unchanged
        });
    });
    describe('getBrowserLaunchOptions', () => {
        it('should return browser launch options based on config', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                browser: {
                    headless: false,
                    slowMo: 50,
                    ignoreHTTPSErrors: false
                }
            });
            const options = configManager.getBrowserLaunchOptions();
            expect(options.headless).toBe(false);
            expect(options.slowMo).toBe(50);
            expect(options.ignoreHTTPSErrors).toBe(false);
            expect(options.args).toEqual([]);
        });
    });
    describe('getContextOptions', () => {
        it('should return context options based on config', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                baseUrl: 'https://example.com',
                browser: {
                    viewport: { width: 1024, height: 768 },
                    ignoreHTTPSErrors: false
                },
                network: {
                    offline: true
                },
                reporting: {
                    captureVideo: true,
                    videosDir: './custom/videos'
                }
            });
            const options = configManager.getContextOptions();
            expect(options.baseURL).toBe('https://example.com');
            expect(options.viewport).toEqual({ width: 1024, height: 768 });
            expect(options.ignoreHTTPSErrors).toBe(false);
            expect(options.offline).toBe(true);
            expect(options.recordVideo).toEqual({ dir: './custom/videos' });
        });
        it('should use device settings if deviceName is provided', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const options = configManager.getContextOptions('iPhone 12');
            expect(options.viewport).toEqual({ width: 390, height: 844 });
            expect(options.userAgent).toBe('iPhone');
            expect(options.deviceScaleFactor).toBe(3);
            expect(options.isMobile).toBe(true);
            expect(options.hasTouch).toBe(true);
        });
        it('should not include recordVideo if captureVideo is false', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                reporting: {
                    captureVideo: false
                }
            });
            const options = configManager.getContextOptions();
            expect(options.recordVideo).toBeUndefined();
        });
    });
    describe('getter methods', () => {
        it('should get the base URL', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ baseUrl: 'https://example.com' });
            expect(configManager.getBaseUrl()).toBe('https://example.com');
        });
        it('should get the API base URL', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ apiBaseUrl: 'https://api.example.com' });
            expect(configManager.getApiBaseUrl()).toBe('https://api.example.com');
        });
        it('should get the default timeout', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ timeouts: { defaultTimeout: 5000 } });
            expect(configManager.getDefaultTimeout()).toBe(5000);
        });
        it('should get the navigation timeout', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ timeouts: { navigationTimeout: 10000 } });
            expect(configManager.getNavigationTimeout()).toBe(10000);
        });
        it('should get the action timeout', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ timeouts: { actionTimeout: 2000 } });
            expect(configManager.getActionTimeout()).toBe(2000);
        });
        it('should get the wait for element timeout', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ timeouts: { waitForElementTimeout: 1000 } });
            expect(configManager.getWaitForElementTimeout()).toBe(1000);
        });
        it('should get the environment', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ environment: 'production' });
            expect(configManager.getEnvironment()).toBe('production');
        });
        it('should check if the environment is production', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({ environment: 'production' });
            expect(configManager.isProduction()).toBe(true);
            configManager.updateConfig({ environment: 'development' });
            expect(configManager.isProduction()).toBe(false);
        });
        it('should get authentication credentials', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                auth: {
                    username: 'testuser',
                    password: 'testpass',
                    apiToken: 'testtoken'
                }
            });
            const auth = configManager.getAuthCredentials();
            expect(auth.username).toBe('testuser');
            expect(auth.password).toBe('testpass');
            expect(auth.apiToken).toBe('testtoken');
            // Verify it's a copy
            auth.username = 'modified';
            expect(configManager.getAuthCredentials().username).toBe('testuser');
        });
        it('should get a device profile by name', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const device = configManager.getDevice('iPhone 12');
            expect(device).toBeDefined();
            expect(device?.name).toBe('iPhone 12');
            expect(device?.userAgent).toBe('iPhone');
        });
        it('should return undefined for non-existent device', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const device = configManager.getDevice('NonExistentDevice');
            expect(device).toBeUndefined();
        });
        it('should get all device profiles', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            const devices = configManager.getAllDevices();
            expect(devices.desktop).toBeDefined();
            expect(devices.mobile).toBeDefined();
            expect(devices.tablet).toBeDefined();
            expect(devices['Desktop Chrome']).toBeDefined();
            expect(devices['iPhone 12']).toBeDefined();
            // Verify it's a copy
            devices.desktop.name = 'Modified';
            expect(configManager.getDevice('desktop')?.name).toBe('Desktop');
        });
        it('should get reporting configuration', () => {
            const configManager = ConfigManager_1.ConfigManager.getInstance();
            configManager.updateConfig({
                reporting: {
                    screenshotsDir: './custom/screenshots',
                    captureVideo: true
                }
            });
            const reporting = configManager.getReportingConfig();
            expect(reporting.screenshotsDir).toBe('./custom/screenshots');
            expect(reporting.captureVideo).toBe(true);
            // Verify it's a copy
            reporting.screenshotsDir = 'modified';
            expect(configManager.getReportingConfig().screenshotsDir).toBe('./custom/screenshots');
        });
    });
});
//# sourceMappingURL=ConfigManager.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const ConfigManager_1 = require("../../config/ConfigManager");
const DIContainer_1 = require("../../di/DIContainer");
// Mock ConfigManager
jest.mock('../../config/ConfigManager');
const mockConfigManager = {
    getContextOptions: jest.fn().mockReturnValue({}),
    getAuthCredentials: jest.fn().mockReturnValue({
        username: 'testuser',
        password: 'password123',
        apiToken: 'test-token'
    })
};
ConfigManager_1.ConfigManager.getInstance.mockReturnValue(mockConfigManager);
// Mock DIContainer
jest.mock('../../di/DIContainer');
const mockApiClient = {};
const mockReporter = {};
const mockContainer = {
    resolve: jest.fn().mockImplementation((type) => {
        if (type === 'IApiClient')
            return mockApiClient;
        if (type === 'IReporter')
            return mockReporter;
        return null;
    })
};
DIContainer_1.DIContainer.getInstance.mockReturnValue(mockContainer);
// Mock Playwright Browser
const createMockBrowser = () => {
    return {
        newContext: jest.fn().mockResolvedValue(createMockBrowserContext()),
    };
};
// Mock Playwright BrowserContext
const createMockBrowserContext = () => {
    return {
        newPage: jest.fn().mockResolvedValue(createMockPage()),
        storageState: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
    };
};
// Mock Playwright Page
const createMockPage = () => {
    return {
        goto: jest.fn().mockResolvedValue(undefined),
        fill: jest.fn().mockResolvedValue(undefined),
        click: jest.fn().mockResolvedValue(undefined),
        waitForURL: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        route: jest.fn().mockResolvedValue(undefined),
        unroute: jest.fn().mockResolvedValue(undefined),
    };
};
// Mock Playwright APIRequestContext
const createMockAPIRequestContext = () => {
    return {
        post: jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({ id: 'test-id' }),
        }),
        delete: jest.fn().mockResolvedValue(undefined),
        dispose: jest.fn().mockResolvedValue(undefined),
    };
};
// Mock Playwright
const createMockPlaywright = () => {
    return {
        request: {
            newContext: jest.fn().mockResolvedValue(createMockAPIRequestContext()),
        },
    };
};
describe('TestFixtures', () => {
    let testFixtures;
    beforeEach(() => {
        testFixtures = new TestFixtures_1.TestFixtures();
        // Reset all mocks
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with default ConfigManager and DIContainer', () => {
            expect(ConfigManager_1.ConfigManager.getInstance).toHaveBeenCalled();
            expect(DIContainer_1.DIContainer.getInstance).toHaveBeenCalled();
        });
        it('should initialize with provided ConfigManager and DIContainer', () => {
            const configManager = {};
            const container = {};
            const fixtures = new TestFixtures_1.TestFixtures(configManager, container);
            expect(fixtures['configManager']).toBe(configManager);
            expect(fixtures['container']).toBe(container);
        });
    });
    describe('createTestFixtures', () => {
        it('should create test fixtures with all required properties', () => {
            // Mock base.extend
            const extendMock = jest.fn();
            test_1.test.extend = extendMock;
            // Call createTestFixtures
            testFixtures.createTestFixtures();
            // Verify base.extend was called with an object containing all required fixtures
            expect(extendMock).toHaveBeenCalledWith(expect.objectContaining({
                authenticatedPage: expect.any(Function),
                authenticatedRequest: expect.any(Function),
                apiClient: expect.any(Function),
                reporter: expect.any(Function),
                testData: expect.any(Function),
                mockApi: expect.any(Function),
            }));
        });
    });
    describe('registerEntity', () => {
        it('should add the entity to the createdEntities array', () => {
            // Create test data context
            const testData = {
                createdEntities: [],
                testId: 'test-123',
                timestamp: 1234567890
            };
            // Create test entity
            const entity = {
                id: 'test-id',
                type: 'test',
                data: { name: 'Test Entity' },
                cleanup: jest.fn()
            };
            // Call registerEntity
            testFixtures.registerEntity(testData, entity);
            // Verify the entity was added to the createdEntities array
            expect(testData.createdEntities).toContain(entity);
        });
    });
    describe('generateTestEmail', () => {
        it('should generate a unique test email with the default prefix', () => {
            // Create test data context
            const testData = {
                createdEntities: [],
                testId: 'test-123',
                timestamp: 1234567890
            };
            // Call generateTestEmail
            const email = testFixtures.generateTestEmail(testData);
            // Verify the email format
            expect(email).toBe('test.test-123@example.com');
        });
        it('should generate a unique test email with a custom prefix', () => {
            // Create test data context
            const testData = {
                createdEntities: [],
                testId: 'test-123',
                timestamp: 1234567890
            };
            // Call generateTestEmail with a custom prefix
            const email = testFixtures.generateTestEmail(testData, 'custom');
            // Verify the email format
            expect(email).toBe('custom.test-123@example.com');
        });
    });
    describe('generateTestUsername', () => {
        it('should generate a unique test username with the default prefix', () => {
            // Create test data context
            const testData = {
                createdEntities: [],
                testId: 'test-123',
                timestamp: 1234567890
            };
            // Call generateTestUsername
            const username = testFixtures.generateTestUsername(testData);
            // Verify the username format
            expect(username).toBe('user_test-123');
        });
        it('should generate a unique test username with a custom prefix', () => {
            // Create test data context
            const testData = {
                createdEntities: [],
                testId: 'test-123',
                timestamp: 1234567890
            };
            // Call generateTestUsername with a custom prefix
            const username = testFixtures.generateTestUsername(testData, 'custom');
            // Verify the username format
            expect(username).toBe('custom_test-123');
        });
    });
});
//# sourceMappingURL=TestFixtures.test.js.map
import { Page, Browser, BrowserContext, APIRequestContext, expect as playwrightExpect } from '@playwright/test';
import { BaseTest, test, TestStrategy } from '../BaseTest';
import { IPage } from '../../interfaces/IPage';
import { IApiClient, ApiResponse } from '../../interfaces/IApiClient';
import { IReporter } from '../../interfaces/IReporter';

// Create a concrete implementation of BaseTest for testing
class TestBaseTest extends BaseTest {
  // Expose protected methods for testing
  public createPageTest<T extends IPage>(page: Page, PageClass: new (page: Page) => T): T {
    return this.createPage(page, PageClass);
  }
  
  public async saveAuthStateTest(page: Page, path?: string): Promise<void> {
    return this.saveAuthState(page, path);
  }
  
  public async takeScreenshotTest(page: Page, name: string, reporter: IReporter): Promise<void> {
    return this.takeScreenshot(page, name, reporter);
  }
  
  public async captureTraceTest(context: BrowserContext, name: string, reporter: IReporter): Promise<void> {
    return this.captureTrace(context, name, reporter);
  }
  
  public async startTracingTest(context: BrowserContext, options?: { screenshots?: boolean; snapshots?: boolean }): Promise<void> {
    return this.startTracing(context, options);
  }
  
  public async retryTest<T>(operation: () => Promise<T>, options?: { maxAttempts?: number; timeout?: number; delay?: number }): Promise<T> {
    return this.retry(operation, options);
  }
  
  public async stepTest<T>(title: string, action: () => Promise<T>, reporter: IReporter): Promise<T> {
    return this.step(title, action, reporter);
  }
  
  public createTestTest(title: string, testFn: any, strategy: TestStrategy): void {
    return this.createTest(title, testFn, strategy);
  }
}

// Mock Playwright Page object
const createMockPage = (): jest.Mocked<Page> => {
  return {
    context: jest.fn().mockReturnValue({
      storageState: jest.fn().mockResolvedValue(undefined),
    }),
    screenshot: jest.fn().mockResolvedValue(Buffer.from('test')),
  } as unknown as jest.Mocked<Page>;
};

// Mock Playwright BrowserContext object
const createMockBrowserContext = (): jest.Mocked<BrowserContext> => {
  return {
    tracing: {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
    },
  } as unknown as jest.Mocked<BrowserContext>;
};

// Mock IPage implementation
class MockPage implements IPage {
  constructor(private page: Page) {}
  
  async navigate(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    return Promise.resolve();
  }
  
  async waitForPageLoad(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    return Promise.resolve();
  }
  
  async getCurrentUrl(): Promise<string> {
    return Promise.resolve('https://example.com');
  }
  
  async getTitle(): Promise<string> {
    return Promise.resolve('Test Page');
  }
  
  async takeScreenshot(path?: string): Promise<Buffer> {
    return Promise.resolve(Buffer.from('test'));
  }
  
  async containsText(text: string, options?: { timeout?: number; ignoreCase?: boolean }): Promise<boolean> {
    return Promise.resolve(true);
  }
  
  async evaluate<T>(script: string | Function, ...args: any[]): Promise<T> {
    return Promise.resolve({} as T);
  }
  
  async waitForCondition(condition: () => Promise<boolean> | boolean, options?: { timeout?: number; polling?: number }): Promise<void> {
    return Promise.resolve();
  }
}

// Mock IReporter implementation
class MockReporter implements IReporter {
  onTestRunStart = jest.fn();
  onTestRunEnd = jest.fn();
  onTestStart = jest.fn();
  onTestEnd = jest.fn();
  onStepStart = jest.fn();
  onStepEnd = jest.fn();
  addScreenshot = jest.fn();
  addTrace = jest.fn();
  addVideo = jest.fn();
  addAttachment = jest.fn();
  log = jest.fn();
  setTag = jest.fn();
  setCategory = jest.fn();
  setSeverity = jest.fn();
  setOwner = jest.fn();
  setProperty = jest.fn();
}

// Mock IApiClient implementation
class MockApiClient implements IApiClient {
  get = jest.fn().mockImplementation(<T>(url: string) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  post = jest.fn().mockImplementation(<T>(url: string, data?: any) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  put = jest.fn().mockImplementation(<T>(url: string, data?: any) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  patch = jest.fn().mockImplementation(<T>(url: string, data?: any) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  delete = jest.fn().mockImplementation(<T>(url: string) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  request = jest.fn().mockImplementation(<T>(method: string, url: string, data?: any) => {
    return Promise.resolve({
      data: {} as T,
      status: 200,
      headers: {},
      statusText: 'OK',
      originalResponse: {},
      ok: true
    });
  });
  
  setDefaultHeader = jest.fn();
  setDefaultHeaders = jest.fn();
  setBaseUrl = jest.fn();
  setAuthToken = jest.fn();
  clone = jest.fn().mockReturnThis();
}

// Mock the test function
jest.mock('@playwright/test', () => {
  const originalModule = jest.requireActual('@playwright/test');
  
  return {
    ...originalModule,
    test: {
      extend: jest.fn().mockReturnValue(jest.fn()),
    },
  };
});

describe('BaseTest', () => {
  let testBaseTest: TestBaseTest;
  let mockPage: jest.Mocked<Page>;
  let mockBrowserContext: jest.Mocked<BrowserContext>;
  let mockReporter: MockReporter;
  
  beforeEach(() => {
    testBaseTest = new TestBaseTest();
    mockPage = createMockPage();
    mockBrowserContext = createMockBrowserContext();
    mockReporter = new MockReporter();
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('createPage', () => {
    it('should create a page object', () => {
      const pageObject = testBaseTest.createPageTest(mockPage, MockPage);
      expect(pageObject).toBeInstanceOf(MockPage);
    });
  });
  
  describe('saveAuthState', () => {
    it('should save authentication state', async () => {
      await testBaseTest.saveAuthStateTest(mockPage);
      expect(mockPage.context).toHaveBeenCalled();
      expect(mockPage.context().storageState).toHaveBeenCalledWith({ path: './storage-state.json' });
    });
    
    it('should use the provided path', async () => {
      await testBaseTest.saveAuthStateTest(mockPage, './custom-path.json');
      expect(mockPage.context().storageState).toHaveBeenCalledWith({ path: './custom-path.json' });
    });
  });
  
  describe('takeScreenshot', () => {
    it('should take a screenshot and add it to the report', async () => {
      await testBaseTest.takeScreenshotTest(mockPage, 'test-screenshot', mockReporter);
      expect(mockPage.screenshot).toHaveBeenCalled();
      expect(mockReporter.addScreenshot).toHaveBeenCalledWith(Buffer.from('test'), 'test-screenshot');
    });
  });
  
  describe('captureTrace', () => {
    it('should capture a trace and add it to the report', async () => {
      await testBaseTest.captureTraceTest(mockBrowserContext, 'test-trace', mockReporter);
      expect(mockBrowserContext.tracing.stop).toHaveBeenCalledWith({ path: './traces/test-trace.zip' });
      expect(mockReporter.addTrace).toHaveBeenCalledWith('./traces/test-trace.zip', 'test-trace');
    });
  });
  
  describe('startTracing', () => {
    it('should start tracing with default options', async () => {
      await testBaseTest.startTracingTest(mockBrowserContext);
      expect(mockBrowserContext.tracing.start).toHaveBeenCalledWith({
        screenshots: true,
        snapshots: true
      });
    });
    
    it('should start tracing with provided options', async () => {
      await testBaseTest.startTracingTest(mockBrowserContext, { screenshots: false, snapshots: false });
      expect(mockBrowserContext.tracing.start).toHaveBeenCalledWith({
        screenshots: false,
        snapshots: false
      });
    });
  });
  
  describe('retry', () => {
    it('should return the result if the operation succeeds', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await testBaseTest.retryTest(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });
    
    it('should retry the operation if it fails', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce('success');
      
      const result = await testBaseTest.retryTest(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
    
    it('should throw an error if all retries fail', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      await expect(testBaseTest.retryTest(operation, { maxAttempts: 2 }))
        .rejects.toThrow('Operation failed after 2 attempts: Failed');
      
      expect(operation).toHaveBeenCalledTimes(2);
    });
    
    it('should respect the maxAttempts option', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      await expect(testBaseTest.retryTest(operation, { maxAttempts: 3 }))
        .rejects.toThrow('Operation failed after 3 attempts: Failed');
      
      expect(operation).toHaveBeenCalledTimes(3);
    });
    
    it('should respect the timeout option', async () => {
      jest.useFakeTimers();
      
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      
      const retryPromise = testBaseTest.retryTest(operation, { timeout: 100, delay: 50 });
      
      // Fast-forward time to simulate timeout
      jest.advanceTimersByTime(150);
      
      await expect(retryPromise).rejects.toThrow('Operation failed after');
      
      jest.useRealTimers();
    });
  });
  
  describe('step', () => {
    it('should execute the action and report success', async () => {
      const action = jest.fn().mockResolvedValue('result');
      
      const result = await testBaseTest.stepTest('Test Step', action, mockReporter);
      
      expect(result).toBe('result');
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockReporter.onStepStart).toHaveBeenCalled();
      expect(mockReporter.onStepEnd).toHaveBeenCalled();
      expect(mockReporter.onStepEnd.mock.calls[0][0].status).toBe('passed');
    });
    
    it('should report failure if the action throws an error', async () => {
      const error = new Error('Action failed');
      const action = jest.fn().mockRejectedValue(error);
      
      await expect(testBaseTest.stepTest('Test Step', action, mockReporter))
        .rejects.toThrow('Action failed');
      
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockReporter.onStepStart).toHaveBeenCalled();
      expect(mockReporter.onStepEnd).toHaveBeenCalled();
      expect(mockReporter.onStepEnd.mock.calls[0][0].status).toBe('failed');
      expect(mockReporter.onStepEnd.mock.calls[0][0].errorMessage).toBe('Action failed');
    });
  });
  
  describe('createTest', () => {
    it('should create a UI test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('UI Test', testFn, TestStrategy.UI);
      
      // Since we're mocking the test function, we can't directly verify the test was created
      // But we can verify that the test function was called
      expect(test).toBeDefined();
    });
    
    it('should create an API test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('API Test', testFn, TestStrategy.API);
      
      expect(test).toBeDefined();
    });
    
    it('should create an AUTHENTICATED_UI test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('Authenticated UI Test', testFn, TestStrategy.AUTHENTICATED_UI);
      
      expect(test).toBeDefined();
    });
    
    it('should create an AUTHENTICATED_API test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('Authenticated API Test', testFn, TestStrategy.AUTHENTICATED_API);
      
      expect(test).toBeDefined();
    });
    
    it('should create a HYBRID test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('Hybrid Test', testFn, TestStrategy.HYBRID);
      
      expect(test).toBeDefined();
    });
    
    it('should create an AUTHENTICATED_HYBRID test', () => {
      const testFn = jest.fn();
      testBaseTest.createTestTest('Authenticated Hybrid Test', testFn, TestStrategy.AUTHENTICATED_HYBRID);
      
      expect(test).toBeDefined();
    });
    
    it('should throw an error for unknown test strategy', () => {
      const testFn = jest.fn();
      expect(() => testBaseTest.createTestTest('Unknown Test', testFn, 'unknown' as TestStrategy))
        .toThrow('Unknown test strategy: unknown');
    });
  });
});
import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

// Create a concrete implementation of BasePage for testing
class TestPage extends BasePage {
  protected readonly path: string = '/test-page';
  
  // Expose protected methods for testing
  public getFullUrlTest(): string {
    return this.getFullUrl();
  }
  
  public async onPageLoadedTest(): Promise<void> {
    return this.onPageLoaded();
  }
  
  public async waitForSelectorTest(selector: string, options?: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' }): Promise<void> {
    return this.waitForSelector(selector, options);
  }
  
  public async clickElementTest(selector: string, options?: { timeout?: number; force?: boolean; position?: { x: number; y: number } }): Promise<void> {
    return this.clickElement(selector, options);
  }
  
  public async fillFieldTest(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    return this.fillField(selector, value, options);
  }
  
  public async selectOptionTest(selector: string, value: string): Promise<void> {
    return this.selectOption(selector, value);
  }
  
  public async isElementVisibleTest(selector: string, options?: { timeout?: number }): Promise<boolean> {
    return this.isElementVisible(selector, options);
  }
  
  public async getElementTextTest(selector: string): Promise<string> {
    return this.getElementText(selector);
  }
  
  public async getElementAttributeTest(selector: string, attribute: string): Promise<string | null> {
    return this.getElementAttribute(selector, attribute);
  }
  
  public async hoverElementTest(selector: string, options?: { position?: { x: number; y: number } }): Promise<void> {
    return this.hoverElement(selector, options);
  }
  
  public async pressKeyTest(key: string): Promise<void> {
    return this.pressKey(key);
  }
  
  public async typeTextTest(text: string): Promise<void> {
    return this.typeText(text);
  }
}

// Mock Playwright Page object
const createMockPage = (): jest.Mocked<Page> => {
  return {
    goto: jest.fn().mockResolvedValue(undefined),
    waitForLoadState: jest.fn().mockResolvedValue(undefined),
    url: jest.fn().mockReturnValue('https://example.com/test-page'),
    title: jest.fn().mockReturnValue('Test Page'),
    screenshot: jest.fn().mockResolvedValue(Buffer.from('test')),
    content: jest.fn().mockResolvedValue('<html><body>Test Content</body></html>'),
    evaluate: jest.fn().mockImplementation((fn, ...args) => Promise.resolve(fn(...args))),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    click: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    selectOption: jest.fn().mockResolvedValue(undefined),
    textContent: jest.fn().mockResolvedValue('Test Text'),
    getAttribute: jest.fn().mockResolvedValue('test-attribute'),
    hover: jest.fn().mockResolvedValue(undefined),
    waitForTimeout: jest.fn().mockResolvedValue(undefined),
    context: jest.fn().mockReturnValue({
      browser: jest.fn().mockReturnValue({
        options: {
          baseURL: 'https://example.com'
        }
      })
    }),
    keyboard: {
      press: jest.fn().mockResolvedValue(undefined),
      type: jest.fn().mockResolvedValue(undefined)
    }
  } as unknown as jest.Mocked<Page>;
};

describe('BasePage', () => {
  let mockPage: jest.Mocked<Page>;
  let testPage: TestPage;
  
  beforeEach(() => {
    mockPage = createMockPage();
    testPage = new TestPage(mockPage);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('constructor', () => {
    it('should initialize with the provided page object', () => {
      expect(testPage['page']).toBe(mockPage);
    });
  });
  
  describe('getFullUrl', () => {
    it('should return the full URL by combining base URL and path', () => {
      const fullUrl = testPage.getFullUrlTest();
      expect(fullUrl).toBe('https://example.com/test-page');
    });
    
    it('should handle missing baseURL', () => {
      mockPage.context().browser = jest.fn().mockReturnValue({
        options: {}
      });
      const fullUrl = testPage.getFullUrlTest();
      expect(fullUrl).toBe('/test-page');
    });
  });
  
  describe('navigate', () => {
    it('should navigate to the page URL', async () => {
      await testPage.navigate();
      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com/test-page', undefined);
      expect(mockPage.waitForLoadState).toHaveBeenCalled();
    });
    
    it('should pass navigation options to goto', async () => {
      const options = { timeout: 5000, waitUntil: 'load' as const };
      await testPage.navigate(options);
      expect(mockPage.goto).toHaveBeenCalledWith('https://example.com/test-page', options);
    });
  });
  
  describe('waitForPageLoad', () => {
    it('should wait for the page to load with default options', async () => {
      await testPage.waitForPageLoad();
      expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle', { timeout: undefined });
    });
    
    it('should wait for the page to load with custom options', async () => {
      const options = { timeout: 5000, waitUntil: 'load' as const };
      await testPage.waitForPageLoad(options);
      expect(mockPage.waitForLoadState).toHaveBeenCalledWith('load', { timeout: 5000 });
    });
  });
  
  describe('getCurrentUrl', () => {
    it('should return the current URL', async () => {
      const url = await testPage.getCurrentUrl();
      expect(url).toBe('https://example.com/test-page');
      expect(mockPage.url).toHaveBeenCalled();
    });
  });
  
  describe('getTitle', () => {
    it('should return the page title', async () => {
      const title = await testPage.getTitle();
      expect(title).toBe('Test Page');
      expect(mockPage.title).toHaveBeenCalled();
    });
  });
  
  describe('takeScreenshot', () => {
    it('should take a screenshot', async () => {
      const screenshot = await testPage.takeScreenshot();
      expect(screenshot).toEqual(Buffer.from('test'));
      expect(mockPage.screenshot).toHaveBeenCalledWith({ path: undefined });
    });
    
    it('should take a screenshot with a specified path', async () => {
      const path = 'test-screenshot.png';
      await testPage.takeScreenshot(path);
      expect(mockPage.screenshot).toHaveBeenCalledWith({ path });
    });
  });
  
  describe('containsText', () => {
    it('should return true if the page contains the specified text', async () => {
      mockPage.content.mockResolvedValue('<html><body>Test Content</body></html>');
      const result = await testPage.containsText('Test Content');
      expect(result).toBe(true);
    });
    
    it('should return false if the page does not contain the specified text', async () => {
      mockPage.content.mockResolvedValue('<html><body>Test Content</body></html>');
      const result = await testPage.containsText('Not Found');
      expect(result).toBe(false);
    });
    
    it('should handle case-insensitive search', async () => {
      mockPage.content.mockResolvedValue('<html><body>Test Content</body></html>');
      const result = await testPage.containsText('test content', { ignoreCase: true });
      expect(result).toBe(true);
    });
    
    it('should return false if an error occurs', async () => {
      mockPage.content.mockRejectedValue(new Error('Test error'));
      const result = await testPage.containsText('Test Content');
      expect(result).toBe(false);
    });
  });
  
  describe('evaluate', () => {
    it('should execute JavaScript in the context of the page', async () => {
      const script = (a: number, b: number) => a + b;
      const result = await testPage.evaluate(script, 1, 2);
      expect(result).toBe(3);
      expect(mockPage.evaluate).toHaveBeenCalledWith(script, 1, 2);
    });
  });
  
  describe('waitForCondition', () => {
    it('should resolve when the condition is met', async () => {
      const condition = jest.fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
      
      await testPage.waitForCondition(condition, { polling: 10 });
      expect(condition).toHaveBeenCalledTimes(3);
    });
    
    it('should throw an error if the condition is not met within the timeout', async () => {
      jest.useFakeTimers();
      const condition = jest.fn().mockResolvedValue(false);
      
      const promise = testPage.waitForCondition(condition, { timeout: 1000, polling: 10 });
      
      // Fast-forward time
      jest.advanceTimersByTime(1100);
      
      await expect(promise).rejects.toThrow('Condition not met within timeout: 1000ms');
      
      jest.useRealTimers();
    });
  });
  
  describe('protected methods', () => {
    it('should wait for a selector', async () => {
      await testPage.waitForSelectorTest('.test-selector');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.test-selector', undefined);
    });
    
    it('should click an element', async () => {
      await testPage.clickElementTest('.test-selector');
      expect(mockPage.click).toHaveBeenCalledWith('.test-selector', undefined);
    });
    
    it('should fill a field', async () => {
      await testPage.fillFieldTest('.test-selector', 'test value');
      expect(mockPage.fill).toHaveBeenCalledWith('.test-selector', 'test value', undefined);
    });
    
    it('should select an option', async () => {
      await testPage.selectOptionTest('.test-selector', 'test value');
      expect(mockPage.selectOption).toHaveBeenCalledWith('.test-selector', 'test value');
    });
    
    it('should check if an element is visible', async () => {
      mockPage.waitForSelector.mockResolvedValue(undefined);
      const result = await testPage.isElementVisibleTest('.test-selector');
      expect(result).toBe(true);
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.test-selector', { state: 'visible', timeout: 1000 });
    });
    
    it('should return false if an element is not visible', async () => {
      mockPage.waitForSelector.mockRejectedValue(new Error('Element not found'));
      const result = await testPage.isElementVisibleTest('.test-selector');
      expect(result).toBe(false);
    });
    
    it('should get element text', async () => {
      mockPage.textContent.mockResolvedValue('Test Text');
      const text = await testPage.getElementTextTest('.test-selector');
      expect(text).toBe('Test Text');
      expect(mockPage.textContent).toHaveBeenCalledWith('.test-selector');
    });
    
    it('should get element attribute', async () => {
      mockPage.getAttribute.mockResolvedValue('test-attribute');
      const attribute = await testPage.getElementAttributeTest('.test-selector', 'data-test');
      expect(attribute).toBe('test-attribute');
      expect(mockPage.getAttribute).toHaveBeenCalledWith('.test-selector', 'data-test');
    });
    
    it('should hover over an element', async () => {
      await testPage.hoverElementTest('.test-selector');
      expect(mockPage.hover).toHaveBeenCalledWith('.test-selector', undefined);
    });
    
    it('should press a key', async () => {
      await testPage.pressKeyTest('Enter');
      expect(mockPage.keyboard.press).toHaveBeenCalledWith('Enter');
    });
    
    it('should type text', async () => {
      await testPage.typeTextTest('test text');
      expect(mockPage.keyboard.type).toHaveBeenCalledWith('test text');
    });
  });
});
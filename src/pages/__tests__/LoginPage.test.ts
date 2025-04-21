import { Page, Locator } from '@playwright/test';
import { LoginPage } from '../LoginPage';

// Mock Playwright Locator object
const createMockLocator = (): jest.Mocked<Locator> => {
  return {
    count: jest.fn().mockResolvedValue(1),
    nth: jest.fn().mockImplementation(() => createMockLocator()),
    locator: jest.fn().mockImplementation(() => createMockLocator()),
    textContent: jest.fn().mockResolvedValue('Test Content'),
    click: jest.fn().mockResolvedValue(undefined),
    waitFor: jest.fn().mockResolvedValue(undefined),
    isVisible: jest.fn().mockResolvedValue(true),
  } as unknown as jest.Mocked<Locator>;
};

// Mock Playwright Page object
const createMockPage = (): jest.Mocked<Page> => {
  return {
    locator: jest.fn().mockImplementation(() => createMockLocator()),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    goto: jest.fn().mockResolvedValue(undefined),
    url: jest.fn().mockReturnValue('https://example.com/login'),
    fill: jest.fn().mockResolvedValue(undefined),
    click: jest.fn().mockResolvedValue(undefined),
    waitForURL: jest.fn().mockResolvedValue(undefined),
    context: jest.fn().mockReturnValue({
      storageState: jest.fn().mockResolvedValue(undefined),
    }),
  } as unknown as jest.Mocked<Page>;
};

describe('LoginPage', () => {
  let mockPage: jest.Mocked<Page>;
  let loginPage: LoginPage;
  
  beforeEach(() => {
    mockPage = createMockPage();
    loginPage = new LoginPage(mockPage);
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('login', () => {
    it('should fill the login form, submit it, and wait for success', async () => {
      // Mock methods
      jest.spyOn(loginPage, 'fillLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'submitLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'waitForLoginSuccess').mockResolvedValue(undefined);
      
      await loginPage.login('testuser', 'password123');
      
      expect(loginPage.fillLoginForm).toHaveBeenCalledWith('testuser', 'password123', false);
      expect(loginPage.submitLoginForm).toHaveBeenCalled();
      expect(loginPage.waitForLoginSuccess).toHaveBeenCalled();
    });
    
    it('should pass the rememberMe parameter to fillLoginForm', async () => {
      // Mock methods
      jest.spyOn(loginPage, 'fillLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'submitLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'waitForLoginSuccess').mockResolvedValue(undefined);
      
      await loginPage.login('testuser', 'password123', true);
      
      expect(loginPage.fillLoginForm).toHaveBeenCalledWith('testuser', 'password123', true);
    });
  });
  
  describe('attemptLogin', () => {
    it('should fill the login form and submit it without waiting for success', async () => {
      // Mock methods
      jest.spyOn(loginPage, 'fillLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'submitLoginForm').mockResolvedValue(undefined);
      
      await loginPage.attemptLogin('testuser', 'password123');
      
      expect(loginPage.fillLoginForm).toHaveBeenCalledWith('testuser', 'password123', false);
      expect(loginPage.submitLoginForm).toHaveBeenCalled();
    });
    
    it('should pass the rememberMe parameter to fillLoginForm', async () => {
      // Mock methods
      jest.spyOn(loginPage, 'fillLoginForm').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'submitLoginForm').mockResolvedValue(undefined);
      
      await loginPage.attemptLogin('testuser', 'password123', true);
      
      expect(loginPage.fillLoginForm).toHaveBeenCalledWith('testuser', 'password123', true);
    });
  });
  
  describe('fillLoginForm', () => {
    it('should fill the username and password fields', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'waitForSelector').mockResolvedValue(undefined);
      jest.spyOn(loginPage as any, 'fillField').mockResolvedValue(undefined);
      
      await loginPage.fillLoginForm('testuser', 'password123');
      
      expect(loginPage['waitForSelector']).toHaveBeenCalledWith('form[id="loginForm"]', { state: 'visible' });
      expect(loginPage['fillField']).toHaveBeenCalledWith('input[name="username"]', 'testuser');
      expect(loginPage['fillField']).toHaveBeenCalledWith('input[name="password"]', 'password123');
    });
    
    it('should check the rememberMe checkbox if rememberMe is true', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'waitForSelector').mockResolvedValue(undefined);
      jest.spyOn(loginPage as any, 'fillField').mockResolvedValue(undefined);
      jest.spyOn(loginPage as any, 'clickElement').mockResolvedValue(undefined);
      
      await loginPage.fillLoginForm('testuser', 'password123', true);
      
      expect(loginPage['clickElement']).toHaveBeenCalledWith('input[name="rememberMe"]');
    });
  });
  
  describe('submitLoginForm', () => {
    it('should click the submit button', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'clickElement').mockResolvedValue(undefined);
      
      await loginPage.submitLoginForm();
      
      expect(loginPage['clickElement']).toHaveBeenCalledWith('button[type="submit"]');
    });
  });
  
  describe('waitForLoginSuccess', () => {
    it('should wait for navigation to the dashboard page', async () => {
      await loginPage.waitForLoginSuccess();
      
      expect(mockPage.waitForURL).toHaveBeenCalledWith('**/dashboard', { timeout: 30000 });
    });
    
    it('should use the provided timeout', async () => {
      await loginPage.waitForLoginSuccess(5000);
      
      expect(mockPage.waitForURL).toHaveBeenCalledWith('**/dashboard', { timeout: 5000 });
    });
  });
  
  describe('isLoginSuccessful', () => {
    it('should return true if the current URL includes /dashboard', async () => {
      // Mock getCurrentUrl
      jest.spyOn(loginPage, 'getCurrentUrl').mockResolvedValue('https://example.com/dashboard');
      
      const result = await loginPage.isLoginSuccessful();
      
      expect(result).toBe(true);
    });
    
    it('should return false if the current URL does not include /dashboard', async () => {
      // Mock getCurrentUrl
      jest.spyOn(loginPage, 'getCurrentUrl').mockResolvedValue('https://example.com/login');
      
      const result = await loginPage.isLoginSuccessful();
      
      expect(result).toBe(false);
    });
    
    it('should return false if an error occurs', async () => {
      // Mock getCurrentUrl to throw an error
      jest.spyOn(loginPage, 'getCurrentUrl').mockRejectedValue(new Error('Test error'));
      
      const result = await loginPage.isLoginSuccessful();
      
      expect(result).toBe(false);
    });
  });
  
  describe('getErrorMessage', () => {
    it('should return the error message if visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(true);
      jest.spyOn(loginPage as any, 'getElementText').mockResolvedValue('Invalid credentials');
      
      const errorMessage = await loginPage.getErrorMessage();
      
      expect(errorMessage).toBe('Invalid credentials');
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('.error-message');
      expect(loginPage['getElementText']).toHaveBeenCalledWith('.error-message');
    });
    
    it('should return null if error message is not visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(false);
      
      const errorMessage = await loginPage.getErrorMessage();
      
      expect(errorMessage).toBeNull();
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('.error-message');
    });
  });
  
  describe('hasErrorMessage', () => {
    it('should return true if error message is visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(true);
      
      const result = await loginPage.hasErrorMessage();
      
      expect(result).toBe(true);
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('.error-message');
    });
    
    it('should return false if error message is not visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(false);
      
      const result = await loginPage.hasErrorMessage();
      
      expect(result).toBe(false);
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('.error-message');
    });
  });
  
  describe('clickForgotPassword', () => {
    it('should click the forgot password link and wait for navigation', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'clickElement').mockResolvedValue(undefined);
      
      await loginPage.clickForgotPassword();
      
      expect(loginPage['clickElement']).toHaveBeenCalledWith('a[href*="forgot-password"]');
      expect(mockPage.waitForURL).toHaveBeenCalledWith('**/forgot-password');
    });
  });
  
  describe('isLoginFormDisplayed', () => {
    it('should check if the login form is visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(true);
      
      const result = await loginPage.isLoginFormDisplayed();
      
      expect(result).toBe(true);
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('form[id="loginForm"]');
    });
  });
  
  describe('waitForLoginForm', () => {
    it('should wait for the login form to be visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'waitForSelector').mockResolvedValue(undefined);
      
      await loginPage.waitForLoginForm();
      
      expect(loginPage['waitForSelector']).toHaveBeenCalledWith('form[id="loginForm"]', { state: 'visible', timeout: 10000 });
    });
    
    it('should use the provided timeout', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'waitForSelector').mockResolvedValue(undefined);
      
      await loginPage.waitForLoginForm(5000);
      
      expect(loginPage['waitForSelector']).toHaveBeenCalledWith('form[id="loginForm"]', { state: 'visible', timeout: 5000 });
    });
  });
  
  describe('isPageReady', () => {
    it('should return true if all required elements are visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(true);
      
      const result = await loginPage.isPageReady();
      
      expect(result).toBe(true);
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('input[name="username"]');
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('input[name="password"]');
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('button[type="submit"]');
    });
    
    it('should return false if any required element is not visible', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockImplementation((selector) => {
        return Promise.resolve(selector !== 'input[name="password"]');
      });
      
      const result = await loginPage.isPageReady();
      
      expect(result).toBe(false);
    });
  });
  
  describe('onPageLoaded', () => {
    it('should wait for the login form', async () => {
      // Mock methods
      jest.spyOn(loginPage, 'waitForLoginForm').mockResolvedValue(undefined);
      
      // Call the protected method using any type assertion
      await (loginPage as any).onPageLoaded();
      
      expect(loginPage.waitForLoginForm).toHaveBeenCalled();
    });
  });
  
  describe('saveAuthState', () => {
    it('should save the storage state', async () => {
      await loginPage.saveAuthState();
      
      expect(mockPage.context).toHaveBeenCalled();
      expect(mockPage.context().storageState).toHaveBeenCalledWith({ path: './storage-state.json' });
    });
    
    it('should use the provided path', async () => {
      await loginPage.saveAuthState('./custom-path.json');
      
      expect(mockPage.context().storageState).toHaveBeenCalledWith({ path: './custom-path.json' });
    });
  });
  
  describe('completeMFA', () => {
    it('should complete MFA if required', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(true);
      jest.spyOn(loginPage as any, 'fillField').mockResolvedValue(undefined);
      jest.spyOn(loginPage as any, 'clickElement').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'waitForLoginSuccess').mockResolvedValue(undefined);
      
      await loginPage.completeMFA('123456');
      
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('input[name="mfaCode"]');
      expect(loginPage['fillField']).toHaveBeenCalledWith('input[name="mfaCode"]', '123456');
      expect(loginPage['clickElement']).toHaveBeenCalledWith('button[id="mfaSubmit"]');
      expect(loginPage.waitForLoginSuccess).toHaveBeenCalled();
    });
    
    it('should do nothing if MFA is not required', async () => {
      // Mock methods
      jest.spyOn(loginPage as any, 'isElementVisible').mockResolvedValue(false);
      jest.spyOn(loginPage as any, 'fillField').mockResolvedValue(undefined);
      jest.spyOn(loginPage as any, 'clickElement').mockResolvedValue(undefined);
      jest.spyOn(loginPage, 'waitForLoginSuccess').mockResolvedValue(undefined);
      
      await loginPage.completeMFA('123456');
      
      expect(loginPage['isElementVisible']).toHaveBeenCalledWith('input[name="mfaCode"]');
      expect(loginPage['fillField']).not.toHaveBeenCalled();
      expect(loginPage['clickElement']).not.toHaveBeenCalled();
      expect(loginPage.waitForLoginSuccess).not.toHaveBeenCalled();
    });
  });
});
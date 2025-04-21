import { Page } from '@playwright/test';
import { RegisterPage } from '../RegisterPage';

// Mock Playwright Page object
const createMockPage = (): jest.Mocked<Page> => {
  return {
    goto: jest.fn().mockResolvedValue(undefined),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    click: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    textContent: jest.fn().mockResolvedValue('Your account was created successfully'),
    isVisible: jest.fn().mockResolvedValue(true),
    waitForURL: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<Page>;
};

describe('RegisterPage', () => {
  let mockPage: jest.Mocked<Page>;
  let registerPage: RegisterPage;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPage = createMockPage();
    registerPage = new RegisterPage(mockPage);
  });

  describe('navigateToRegisterPage', () => {
    it('should navigate to the ParaBank homepage and click the register link', async () => {
      await registerPage.navigateToRegisterPage();

      expect(mockPage.goto).toHaveBeenCalledWith('https://parabank.parasoft.com/parabank/index.htm');
      expect(mockPage.click).toHaveBeenCalledWith('a[href="register.htm"]');
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('form[id="customerForm"]', { state: 'visible' });
    });
  });

  describe('fillRegistrationForm', () => {
    it('should fill all fields in the registration form', async () => {
      await registerPage.fillRegistrationForm(
        'John',
        'Doe',
        '123 Test Street',
        'Testville',
        'TX',
        '75001',
        '1234567890',
        '123-45-6789',
        'john.doe.test',
        'Test@1234',
        'Test@1234'
      );

      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.firstName"]', 'John');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.lastName"]', 'Doe');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.street"]', '123 Test Street');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.city"]', 'Testville');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.state"]', 'TX');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.zipCode"]', '75001');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.phoneNumber"]', '1234567890');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.ssn"]', '123-45-6789');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.username"]', 'john.doe.test');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.password"]', 'Test@1234');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="repeatedPassword"]', 'Test@1234');
    });
  });

  describe('submitRegistrationForm', () => {
    it('should click the register button', async () => {
      await registerPage.submitRegistrationForm();

      expect(mockPage.click).toHaveBeenCalledWith('//input[@value="Register"]');
    });
  });

  describe('register', () => {
    it('should fill the form, submit it, and wait for success', async () => {
      await registerPage.register(
        'John',
        'Doe',
        '123 Test Street',
        'Testville',
        'TX',
        '75001',
        '1234567890',
        '123-45-6789',
        'john.doe.test',
        'Test@1234',
        'Test@1234'
      );

      // Check that form was filled
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.firstName"]', 'John');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.lastName"]', 'Doe');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.street"]', '123 Test Street');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.city"]', 'Testville');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.state"]', 'TX');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.address.zipCode"]', '75001');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.phoneNumber"]', '1234567890');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.ssn"]', '123-45-6789');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.username"]', 'john.doe.test');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="customer.password"]', 'Test@1234');
      expect(mockPage.fill).toHaveBeenCalledWith('input[name="repeatedPassword"]', 'Test@1234');

      // Check that form was submitted
      expect(mockPage.click).toHaveBeenCalledWith('//input[@value="Register"]');

      // Check that we waited for success
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('div[id="rightPanel"] p', { state: 'visible', timeout: 30000 });
    });
  });

  describe('isRegistrationSuccessful', () => {
    it('should return true when registration is successful', async () => {
      mockPage.waitForSelector.mockResolvedValue(undefined);
      mockPage.textContent.mockResolvedValue('Your account was created successfully');

      const result = await registerPage.isRegistrationSuccessful();

      expect(result).toBe(true);
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('div[id="rightPanel"] p', { state: 'visible', timeout: 5000 });
    });

    it('should return false when registration fails', async () => {
      mockPage.waitForSelector.mockRejectedValue(new Error('Timeout'));

      const result = await registerPage.isRegistrationSuccessful();

      expect(result).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return the error message when one is displayed', async () => {
      mockPage.isVisible.mockResolvedValue(true);
      mockPage.textContent.mockResolvedValue('Username already exists');

      const errorMessage = await registerPage.getErrorMessage();

      expect(errorMessage).toBe('Username already exists');
    });

    it('should return null when no error message is displayed', async () => {
      mockPage.isVisible.mockResolvedValue(false);

      const errorMessage = await registerPage.getErrorMessage();

      expect(errorMessage).toBeNull();
    });
  });
});

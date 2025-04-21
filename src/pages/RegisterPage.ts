/**
 * @file RegisterPage.ts
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

import { Page } from '@playwright/test';
import { BasePage } from '@/base/BasePage';

/**
 * RegisterPage
 * 
 * Page object for the registration page.
 * Implements the Facade pattern for registration operations.
 */
export class RegisterPage extends BasePage {
  /**
   * The URL path for this page
   */
  protected readonly path: string = '/parabank/register.htm';

  // Selectors for registration form elements
  private readonly firstNameSelector: string = 'input[name="customer.firstName"]';
  private readonly lastNameSelector: string = 'input[name="customer.lastName"]';
  private readonly addressSelector: string = 'input[name="customer.address.street"]';
  private readonly citySelector: string = 'input[name="customer.address.city"]';
  private readonly stateSelector: string = 'input[name="customer.address.state"]';
  private readonly zipCodeSelector: string = 'input[name="customer.address.zipCode"]';
  private readonly phoneSelector: string = 'input[name="customer.phoneNumber"]';
  private readonly ssnSelector: string = 'input[name="customer.ssn"]';
  private readonly usernameSelector: string = 'input[name="customer.username"]';
  private readonly passwordSelector: string = 'input[name="customer.password"]';
  private readonly confirmPasswordSelector: string = 'input[name="repeatedPassword"]';
  private readonly registerButtonSelector: string = '//input[@value="Register"]';
  private readonly registerFormSelector: string = 'form[id="customerForm"]';
  private readonly successMessageSelector: string = 'div[id="rightPanel"] p';
  private readonly errorMessageSelector: string = 'span[class="error"]';

  /**
   * Creates a new RegisterPage instance
   * @param page Playwright page
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the registration page
   * @returns Promise that resolves when navigation is complete
   */
  public async navigateToRegisterPage(): Promise<void> {
    await this.page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await this.clickRegisterLink();
  }

  /**
   * Clicks the Register link on the home page
   * @returns Promise that resolves when the link is clicked
   */
  public async clickRegisterLink(): Promise<void> {
    await this.clickElement('a:has-text("Register")');
    await this.waitForSelector(this.registerFormSelector, { state: 'visible' });
  }

  /**
   * Fills the registration form with the given information
   * @param firstName First name
   * @param lastName Last name
   * @param address Address
   * @param city City
   * @param state State
   * @param zipCode Zip code
   * @param phone Phone number
   * @param ssn Social Security Number
   * @param username Username
   * @param password Password
   * @param confirmPassword Confirm password
   * @returns Promise that resolves when the form is filled
   */
  public async fillRegistrationForm(
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    ssn: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    // Clear and fill each field with explicit waits to ensure they are properly filled
    await this.page.waitForSelector(this.firstNameSelector, { state: 'visible' });
    await this.page.fill(this.firstNameSelector, ''); // Clear first
    await this.page.fill(this.firstNameSelector, firstName);

    await this.page.waitForSelector(this.lastNameSelector, { state: 'visible' });
    await this.page.fill(this.lastNameSelector, ''); // Clear first
    await this.page.fill(this.lastNameSelector, lastName);

    await this.page.waitForSelector(this.addressSelector, { state: 'visible' });
    await this.page.fill(this.addressSelector, ''); // Clear first
    await this.page.fill(this.addressSelector, address);

    await this.page.waitForSelector(this.citySelector, { state: 'visible' });
    await this.page.fill(this.citySelector, ''); // Clear first
    await this.page.fill(this.citySelector, city);

    await this.page.waitForSelector(this.stateSelector, { state: 'visible' });
    await this.page.fill(this.stateSelector, ''); // Clear first
    await this.page.fill(this.stateSelector, state);

    await this.page.waitForSelector(this.zipCodeSelector, { state: 'visible' });
    await this.page.fill(this.zipCodeSelector, ''); // Clear first
    await this.page.fill(this.zipCodeSelector, zipCode);

    await this.page.waitForSelector(this.phoneSelector, { state: 'visible' });
    await this.page.fill(this.phoneSelector, ''); // Clear first
    await this.page.fill(this.phoneSelector, phone);

    await this.page.waitForSelector(this.ssnSelector, { state: 'visible' });
    await this.page.fill(this.ssnSelector, ''); // Clear first
    await this.page.fill(this.ssnSelector, ssn);

    await this.page.waitForSelector(this.usernameSelector, { state: 'visible' });
    await this.page.fill(this.usernameSelector, ''); // Clear first
    await this.page.fill(this.usernameSelector, username);

    await this.page.waitForSelector(this.passwordSelector, { state: 'visible' });
    await this.page.fill(this.passwordSelector, ''); // Clear first
    await this.page.fill(this.passwordSelector, password);

    await this.page.waitForSelector(this.confirmPasswordSelector, { state: 'visible' });
    await this.page.fill(this.confirmPasswordSelector, ''); // Clear first
    await this.page.fill(this.confirmPasswordSelector, confirmPassword);

    // Verify that the fields are filled correctly
    const firstNameValue = await this.page.inputValue(this.firstNameSelector);
    const passwordValue = await this.page.inputValue(this.passwordSelector);
    const confirmPasswordValue = await this.page.inputValue(this.confirmPasswordSelector);

    console.log(`[DEBUG_LOG] First Name: ${firstNameValue}`);
    console.log(`[DEBUG_LOG] Password: ${passwordValue}`);
    console.log(`[DEBUG_LOG] Confirm Password: ${confirmPasswordValue}`);
  }

  async submitRegistrationForm(): Promise<void> {
    // Wait for the button to be visible before clicking it
    await this.waitForSelector(this.registerButtonSelector, { state: 'visible' });
    await this.clickElement(this.registerButtonSelector);
  }

  /**
   * Registers a new user with the given information
   * @param firstName First name
   * @param lastName Last name
   * @param address Address
   * @param city City
   * @param state State
   * @param zipCode Zip code
   * @param phone Phone number
   * @param ssn Social Security Number
   * @param username Username
   * @param password Password
   * @param confirmPassword Confirm password
   * @returns Promise that resolves when registration is complete
   */
  public async register(
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    ssn: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.fillRegistrationForm(
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      phone,
      ssn,
      username,
      password,
      confirmPassword
    );
    await this.submitRegistrationForm();

    // Wait for registration to complete
    await this.waitForRegistrationSuccess();
  }

  /**
   * Waits for successful registration
   * @param timeout Timeout in milliseconds
   * @returns Promise that resolves when registration is successful
   */
  public async waitForRegistrationSuccess(timeout: number = 30000): Promise<void> {
    // Wait for success message
    await this.waitForSelector(this.successMessageSelector, { state: 'visible', timeout });
  }

  /**
   * Checks if registration was successful
   * @returns Promise that resolves with true if registration was successful, false otherwise
   */
  public async isRegistrationSuccessful(): Promise<boolean> {
    try {
      await this.waitForSelector(this.successMessageSelector, { state: 'visible', timeout: 5000 });
      const message = await this.getElementText(this.successMessageSelector);
      return message.includes('Your account was created successfully');
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the error message displayed on the registration page
   * @returns Promise that resolves with the error message or null if no error is displayed
   */
  public async getErrorMessage(): Promise<string | null> {
    if (await this.isElementVisible(this.errorMessageSelector)) {
      return this.getElementText(this.errorMessageSelector);
    }
    return null;
  }

  /**
   * Checks if an error message is displayed
   * @returns Promise that resolves with true if an error message is displayed, false otherwise
   */
  public async hasErrorMessage(): Promise<boolean> {
    return this.isElementVisible(this.errorMessageSelector);
  }

  /**
   * Template method called after the page is loaded
   * Override to perform additional actions after page load
   */
  protected async onPageLoaded(): Promise<void> {
    // Wait for the registration form to be visible
    await this.waitForSelector(this.registerFormSelector, { state: 'visible' });
  }
}

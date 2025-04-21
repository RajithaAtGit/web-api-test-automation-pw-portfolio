/**
 * @file LoginPage.ts
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
import { BasePage } from '../base/BasePage';

/**
 * LoginPage
 * 
 * Page object for the login page.
 * Implements the Facade pattern for login operations.
 */
export class LoginPage extends BasePage {
  /**
   * The URL path for this page
   */
  protected readonly path: string = '/login';

  // Selectors for login form elements
  private readonly usernameSelector: string = 'input[name="username"]';
  private readonly passwordSelector: string = 'input[name="password"]';
  private readonly submitButtonSelector: string = 'button[type="submit"]';
  private readonly errorMessageSelector: string = '.error-message';
  private readonly rememberMeSelector: string = 'input[name="rememberMe"]';
  private readonly forgotPasswordLinkSelector: string = 'a[href*="forgot-password"]';
  private readonly loginFormSelector: string = 'form[id="loginForm"]';

  /**
   * Creates a new LoginPage instance
   * @param page Playwright page
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Logs in with the given credentials
   * @param username Username
   * @param password Password
   * @param rememberMe Whether to check the "Remember Me" checkbox
   * @returns Promise that resolves when login is complete
   */
  public async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillLoginForm(username, password, rememberMe);
    await this.submitLoginForm();

    // Wait for navigation to complete after successful login
    await this.waitForLoginSuccess();
  }

  /**
   * Attempts to log in with the given credentials
   * This method doesn't wait for successful login, useful for testing invalid credentials
   * @param username Username
   * @param password Password
   * @param rememberMe Whether to check the "Remember Me" checkbox
   * @returns Promise that resolves when login attempt is complete
   */
  public async attemptLogin(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.fillLoginForm(username, password, rememberMe);
    await this.submitLoginForm();
  }

  /**
   * Fills the login form with the given credentials
   * @param username Username
   * @param password Password
   * @param rememberMe Whether to check the "Remember Me" checkbox
   * @returns Promise that resolves when form is filled
   */
  public async fillLoginForm(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.waitForSelector(this.loginFormSelector, { state: 'visible' });
    await this.fillField(this.usernameSelector, username);
    await this.fillField(this.passwordSelector, password);

    if (rememberMe) {
      await this.clickElement(this.rememberMeSelector);
    }
  }

  /**
   * Submits the login form
   * @returns Promise that resolves when form is submitted
   */
  public async submitLoginForm(): Promise<void> {
    await this.clickElement(this.submitButtonSelector);
  }

  /**
   * Waits for successful login
   * @param timeout Timeout in milliseconds
   * @returns Promise that resolves when login is successful
   */
  public async waitForLoginSuccess(timeout: number = 30000): Promise<void> {
    // Wait for navigation to dashboard or home page
    await this.page.waitForURL('**/dashboard', { timeout });
  }

  /**
   * Checks if the login was successful
   * @returns Promise that resolves with true if login was successful, false otherwise
   */
  public async isLoginSuccessful(): Promise<boolean> {
    try {
      // Check if we're on the dashboard page
      const currentUrl = await this.getCurrentUrl();
      return currentUrl.includes('/dashboard');
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the error message displayed on the login page
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
   * Clicks the "Forgot Password" link
   * @returns Promise that resolves when the link is clicked
   */
  public async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLinkSelector);
    // Wait for navigation to the forgot password page
    await this.page.waitForURL('**/forgot-password');
  }

  /**
   * Checks if the login form is displayed
   * @returns Promise that resolves with true if the login form is displayed, false otherwise
   */
  public async isLoginFormDisplayed(): Promise<boolean> {
    return this.isElementVisible(this.loginFormSelector);
  }

  /**
   * Waits for the login form to be displayed
   * @param timeout Timeout in milliseconds
   * @returns Promise that resolves when the login form is displayed
   */
  public async waitForLoginForm(timeout: number = 10000): Promise<void> {
    await this.waitForSelector(this.loginFormSelector, { state: 'visible', timeout });
  }

  /**
   * Checks if the page is ready for login
   * @returns Promise that resolves with true if the page is ready for login, false otherwise
   */
  public async isPageReady(): Promise<boolean> {
    return (
      await this.isElementVisible(this.usernameSelector) &&
      await this.isElementVisible(this.passwordSelector) &&
      await this.isElementVisible(this.submitButtonSelector)
    );
  }

  /**
   * Template method called after the page is loaded
   * Override to perform additional actions after page load
   */
  protected async onPageLoaded(): Promise<void> {
    // Wait for the login form to be visible
    await this.waitForLoginForm();
  }

  /**
   * Saves the authentication state after successful login
   * @param path Path to save the storage state
   * @returns Promise that resolves when the storage state is saved
   */
  public async saveAuthState(path: string = './storage-state.json'): Promise<void> {
    await this.page.context().storageState({ path });
  }

  /**
   * Performs multi-factor authentication if required
   * @param code MFA code
   * @returns Promise that resolves when MFA is complete
   */
  public async completeMFA(code: string): Promise<void> {
    const mfaInputSelector = 'input[name="mfaCode"]';
    const mfaSubmitSelector = 'button[id="mfaSubmit"]';

    // Check if MFA is required
    if (await this.isElementVisible(mfaInputSelector)) {
      // Fill in the MFA code
      await this.fillField(mfaInputSelector, code);

      // Submit the MFA form
      await this.clickElement(mfaSubmitSelector);

      // Wait for navigation to complete after successful MFA
      await this.waitForLoginSuccess();
    }
  }
}

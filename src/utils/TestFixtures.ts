/**
 * @file TestFixtures.ts
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

import { test as base, Page, BrowserContext, APIRequestContext, expect } from '@playwright/test';
import { RegisterPage } from '@/pages/RegisterPage';
import { TestDataBuilder, UserData } from '@/utils/TestDataBuilder';
import { IReporter } from '@/interfaces/IReporter';
import { IApiClient } from '@/interfaces/IApiClient';

/**
 * TestFixtures
 * 
 * Provides test fixtures for common test scenarios.
 * Extends Playwright's test fixtures with custom fixtures.
 */
export const test = base.extend<TestFixtures>({
  // Page object fixtures
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },

  // Test data fixtures
  defaultUserData: async ({}, use) => {
    await use(TestDataBuilder.createDefaultUser());
  },

  randomUserData: async ({}, use) => {
    await use(TestDataBuilder.createRandomUser());
  },

  // Custom user data fixture that can be configured in beforeEach
  userData: [async ({}, use) => {
    await use(TestDataBuilder.createDefaultUser());
  }, { scope: 'test' }],

  // Authentication fixtures
  authenticatedPage: async ({ browser, baseURL }, use) => {
    // Create a new browser context with storage state
    const context = await browser.newContext({
      baseURL,
      storageState: './storage-state.json'
    }).catch(() => browser.newContext({ baseURL }));

    const page = await context.newPage();
    await use(page);

    // Close the context after use
    await context.close();
  },

  // Authenticated API context
  authenticatedRequest: async ({ playwright, baseURL }, use) => {
    // Create a new API request context with authentication
    const request = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`
      }
    });

    await use(request);

    // Dispose the request context after use
    await request.dispose();
  },

  // Reporter fixture
  reporter: async ({}, use) => {
    // This will be overridden by actual implementation
    await use(undefined as any);
  },

  // API client fixture
  apiClient: async ({ request }, use) => {
    // This will be overridden by actual implementation
    await use(undefined as any);
  },

  // Context fixture for saving state between tests
  testContext: [async ({}, use) => {
    const context: Record<string, any> = {};
    await use(context);
  }, { scope: 'test' }],
});

/**
 * TestFixtures interface
 */
export interface TestFixtures {
  // Page object fixtures
  registerPage: RegisterPage;

  // Test data fixtures
  defaultUserData: UserData;
  randomUserData: UserData;
  userData: UserData;

  // Authentication fixtures
  authenticatedPage: Page;
  authenticatedRequest: APIRequestContext;

  // Other fixtures
  reporter: IReporter;
  apiClient: IApiClient;
  testContext: Record<string, any>;
}

/**
 * Helper functions for common test operations
 */
export class TestHelper {
  /**
   * Registers a new user
   * @param registerPage Register page object
   * @param userData User data
   * @returns Promise that resolves when registration is complete
   */
  public static async registerUser(registerPage: RegisterPage, userData: UserData): Promise<void> {
    await registerPage.navigateToRegisterPage();

    // Try to register with the given username, if it already exists, try with a different one
    let maxAttempts = 3;
    let attempts = 0;
    let success = false;

    while (!success && attempts < maxAttempts) {
      // If this is a retry, generate a new username
      if (attempts > 0) {
        console.log(`[DEBUG_LOG] Username already exists. Trying with a different username (attempt ${attempts + 1})`);

        // Generate a new unique username with only text characters
        const prefixes = ['user', 'test', 'account', 'login', 'member', 'profile', 'retry'];
        const suffixes = ['alpha', 'beta', 'delta', 'gamma', 'omega', 'sigma', 'theta', 'zeta'];

        // Generate 5 random letters
        let randomLetters = '';
        for (let i = 0; i < 5; i++) {
          randomLetters += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }

        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        userData.username = `${prefix}_${randomLetters}_${suffix}`;

        console.log(`[DEBUG_LOG] New username: ${userData.username}`);
      }

      // Fill the form and submit
      await registerPage.fillRegistrationForm(
        userData.firstName,
        userData.lastName,
        userData.address,
        userData.city,
        userData.state,
        userData.zipCode,
        userData.phone,
        userData.ssn,
        userData.username,
        userData.password,
        userData.confirmPassword
      );
      await registerPage.submitRegistrationForm();

      // Check if registration was successful or if username already exists
      // Wait for error message to appear if any
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (await registerPage.hasErrorMessage()) {
        const errorMessage = await registerPage.getErrorMessage();
        console.log(`[DEBUG_LOG] Error message: ${errorMessage}`);

        if (errorMessage && errorMessage.includes("This username already exists")) {
          // Username already exists, try again with a different username
          attempts++;
          continue;
        } else {
          // Some other error occurred
          throw new Error(`Registration failed: ${errorMessage}`);
        }
      } else {
        // No error message, registration was successful
        success = true;
      }
    }

    if (!success) {
      throw new Error(`Failed to register user after ${maxAttempts} attempts. Username already exists.`);
    }
  }

  /**
   * Saves authentication state for future use
   * @param page Playwright page
   * @param path Path to save the storage state
   */
  public static async saveAuthState(page: Page, path: string = './storage-state.json'): Promise<void> {
    await page.context().storageState({ path });
  }

  /**
   * Takes a screenshot and adds it to the report
   * @param page Playwright page
   * @param name Screenshot name
   */
  public static async takeScreenshot(page: Page, name: string): Promise<Buffer> {
    return page.screenshot({ path: `./screenshots/${name}.png` });
  }

  /**
   * Captures a trace and saves it
   * @param context Browser context
   * @param name Trace name
   */
  public static async captureTrace(context: BrowserContext, name: string): Promise<void> {
    await context.tracing.stop({ path: `./traces/${name}.zip` });
  }

  /**
   * Starts tracing
   * @param context Browser context
   * @param options Tracing options
   */
  public static async startTracing(context: BrowserContext, options?: { screenshots?: boolean; snapshots?: boolean }): Promise<void> {
    await context.tracing.start({
      screenshots: options?.screenshots ?? true,
      snapshots: options?.snapshots ?? true
    });
  }

  /**
   * Retries an operation until it succeeds or times out
   * @param operation Operation to retry
   * @param options Retry options
   * @returns Result of the operation
   */
  public static async retry<T>(
    operation: () => Promise<T>,
    options?: { maxAttempts?: number; timeout?: number; delay?: number }
  ): Promise<T> {
    const maxAttempts = options?.maxAttempts || 3;
    const timeout = options?.timeout || 30000;
    const delay = options?.delay || 1000;

    const startTime = Date.now();
    let attempts = 0;
    let lastError: Error | undefined;

    while (attempts < maxAttempts && Date.now() - startTime < timeout) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        attempts++;

        if (attempts >= maxAttempts || Date.now() + delay > startTime + timeout) {
          break;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Operation failed after ${attempts} attempts: ${lastError?.message}`);
  }
}

// Re-export expect for convenience
export { expect };

/**
 * @file BaseTest.ts
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

import { test as base, Page, Browser, BrowserContext, APIRequestContext, expect } from '@playwright/test';
import { IPage } from '@/interfaces/IPage';
import { IApiClient } from '@/interfaces/IApiClient';
import { IReporter } from '@/interfaces/IReporter';

/**
 * BaseTest
 * 
 * Abstract base class for all tests.
 * Implements the Strategy pattern for different testing approaches.
 */
export const test = base.extend<BaseTestFixtures>({
  // Define custom fixtures
  reporter: async ({}, use) => {
    // This will be overridden by actual implementation
    await use(undefined as any);
  },

  apiClient: async ({ request }, use) => {
    // This will be overridden by actual implementation
    await use(undefined as any);
  },

  // Add authentication state management
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

  // Add authenticated API context
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
  }
});

/**
 * BaseTest fixtures
 */
export interface BaseTestFixtures {
  reporter: IReporter;
  apiClient: IApiClient;
  authenticatedPage: Page;
  authenticatedRequest: APIRequestContext;
}

/**
 * BaseTest class
 * 
 * Provides common functionality for all tests.
 */
export abstract class BaseTest {
  /**
   * The test object
   */
  protected readonly test = test;

  /**
   * The expect function
   */
  protected readonly expect = expect;

  /**
   * Creates a new page object
   * @param page Playwright page
   * @param PageClass Page class constructor
   * @returns Instance of the page object
   */
  protected createPage<T extends IPage>(page: Page, PageClass: new (page: Page) => T): T {
    return new PageClass(page);
  }

  /**
   * Saves authentication state for future use
   * @param page Playwright page
   * @param path Path to save the storage state
   */
  protected async saveAuthState(page: Page, path: string = './storage-state.json'): Promise<void> {
    await page.context().storageState({ path });
  }

  /**
   * Takes a screenshot and adds it to the report
   * @param page Playwright page
   * @param name Screenshot name
   * @param reporter Reporter instance
   */
  protected async takeScreenshot(page: Page, name: string, reporter: IReporter): Promise<void> {
    const screenshot = await page.screenshot();
    reporter.addScreenshot(screenshot, name);
  }

  /**
   * Captures a trace and adds it to the report
   * @param context Browser context
   * @param name Trace name
   * @param reporter Reporter instance
   */
  protected async captureTrace(context: BrowserContext, name: string, reporter: IReporter): Promise<void> {
    await context.tracing.stop({ path: `./traces/${name}.zip` });
    reporter.addTrace(`./traces/${name}.zip`, name);
  }

  /**
   * Starts tracing
   * @param context Browser context
   * @param options Tracing options
   */
  protected async startTracing(context: BrowserContext, options?: { screenshots?: boolean; snapshots?: boolean }): Promise<void> {
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
  protected async retry<T>(
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

  /**
   * Executes a test step and reports it
   * @param title Step title
   * @param action Step action
   * @param reporter Reporter instance
   * @returns Result of the action
   */
  protected async step<T>(title: string, action: () => Promise<T>, reporter: IReporter): Promise<T> {
    const stepInfo = {
      id: `step-${Date.now()}`,
      title,
      testId: 'test-id', // This would be set by the actual test runner
      category: 'step'
    };

    reporter.onStepStart(stepInfo);
    const startTime = new Date();

    try {
      const result = await action();

      const stepResult = {
        ...stepInfo,
        status: 'passed' as any,
        startTime,
        endTime: new Date(),
        duration: new Date().getTime() - startTime.getTime()
      };

      reporter.onStepEnd(stepResult);
      return result;
    } catch (error) {
      const stepResult = {
        ...stepInfo,
        status: 'failed' as any,
        startTime,
        endTime: new Date(),
        duration: new Date().getTime() - startTime.getTime(),
        errorMessage: (error as Error).message,
        errorStack: (error as Error).stack
      };

      reporter.onStepEnd(stepResult);
      throw error;
    }
  }

  /**
   * Creates a test that uses a specific testing strategy
   * @param title Test title
   * @param testFn Test function
   * @param strategy Test strategy
   */
  protected createTest(title: string, testFn: (fixtures: BaseTestFixtures) => Promise<void>, strategy: TestStrategy): void {
    switch (strategy) {
      case TestStrategy.UI:
        test(title, async ({ page, reporter, apiClient }) => {
          await testFn({ page, reporter, apiClient, authenticatedPage: page, authenticatedRequest: {} as any });
        });
        break;

      case TestStrategy.API:
        test(title, async ({ request, reporter, apiClient }) => {
          await testFn({ request, reporter, apiClient, authenticatedPage: {} as any, authenticatedRequest: request });
        });
        break;

      case TestStrategy.AUTHENTICATED_UI:
        test(title, async ({ authenticatedPage, reporter, apiClient }) => {
          await testFn({ page: authenticatedPage, reporter, apiClient, authenticatedPage, authenticatedRequest: {} as any });
        });
        break;

      case TestStrategy.AUTHENTICATED_API:
        test(title, async ({ authenticatedRequest, reporter, apiClient }) => {
          await testFn({ request: authenticatedRequest, reporter, apiClient, authenticatedPage: {} as any, authenticatedRequest });
        });
        break;

      case TestStrategy.HYBRID:
        test(title, async ({ page, request, reporter, apiClient }) => {
          await testFn({ page, request, reporter, apiClient, authenticatedPage: {} as any, authenticatedRequest: {} as any });
        });
        break;

      case TestStrategy.AUTHENTICATED_HYBRID:
        test(title, async ({ authenticatedPage, authenticatedRequest, reporter, apiClient }) => {
          await testFn({ page: authenticatedPage, request: authenticatedRequest, reporter, apiClient, authenticatedPage, authenticatedRequest });
        });
        break;

      default:
        throw new Error(`Unknown test strategy: ${strategy}`);
    }
  }
}

/**
 * Test strategies
 */
export enum TestStrategy {
  UI = 'ui',
  API = 'api',
  AUTHENTICATED_UI = 'authenticated-ui',
  AUTHENTICATED_API = 'authenticated-api',
  HYBRID = 'hybrid',
  AUTHENTICATED_HYBRID = 'authenticated-hybrid'
}

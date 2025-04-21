"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStrategy = exports.BaseTest = exports.test = void 0;
const test_1 = require("@playwright/test");
/**
 * BaseTest
 *
 * Abstract base class for all tests.
 * Implements the Strategy pattern for different testing approaches.
 */
exports.test = test_1.test.extend({
    // Define custom fixtures
    reporter: async ({}, use) => {
        // This will be overridden by actual implementation
        await use(undefined);
    },
    apiClient: async ({ request }, use) => {
        // This will be overridden by actual implementation
        await use(undefined);
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
 * BaseTest class
 *
 * Provides common functionality for all tests.
 */
class BaseTest {
    /**
     * The test object
     */
    test = exports.test;
    /**
     * The expect function
     */
    expect = test_1.expect;
    /**
     * Creates a new page object
     * @param page Playwright page
     * @param PageClass Page class constructor
     * @returns Instance of the page object
     */
    createPage(page, PageClass) {
        return new PageClass(page);
    }
    /**
     * Saves authentication state for future use
     * @param page Playwright page
     * @param path Path to save the storage state
     */
    async saveAuthState(page, path = './storage-state.json') {
        await page.context().storageState({ path });
    }
    /**
     * Takes a screenshot and adds it to the report
     * @param page Playwright page
     * @param name Screenshot name
     * @param reporter Reporter instance
     */
    async takeScreenshot(page, name, reporter) {
        const screenshot = await page.screenshot();
        reporter.addScreenshot(screenshot, name);
    }
    /**
     * Captures a trace and adds it to the report
     * @param context Browser context
     * @param name Trace name
     * @param reporter Reporter instance
     */
    async captureTrace(context, name, reporter) {
        await context.tracing.stop({ path: `./traces/${name}.zip` });
        reporter.addTrace(`./traces/${name}.zip`, name);
    }
    /**
     * Starts tracing
     * @param context Browser context
     * @param options Tracing options
     */
    async startTracing(context, options) {
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
    async retry(operation, options) {
        const maxAttempts = options?.maxAttempts || 3;
        const timeout = options?.timeout || 30000;
        const delay = options?.delay || 1000;
        const startTime = Date.now();
        let attempts = 0;
        let lastError;
        while (attempts < maxAttempts && Date.now() - startTime < timeout) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
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
    async step(title, action, reporter) {
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
                status: 'passed',
                startTime,
                endTime: new Date(),
                duration: new Date().getTime() - startTime.getTime()
            };
            reporter.onStepEnd(stepResult);
            return result;
        }
        catch (error) {
            const stepResult = {
                ...stepInfo,
                status: 'failed',
                startTime,
                endTime: new Date(),
                duration: new Date().getTime() - startTime.getTime(),
                errorMessage: error.message,
                errorStack: error.stack
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
    createTest(title, testFn, strategy) {
        switch (strategy) {
            case TestStrategy.UI:
                (0, exports.test)(title, async ({ page, reporter, apiClient }) => {
                    await testFn({ page, reporter, apiClient, authenticatedPage: page, authenticatedRequest: {} });
                });
                break;
            case TestStrategy.API:
                (0, exports.test)(title, async ({ request, reporter, apiClient }) => {
                    await testFn({ request, reporter, apiClient, authenticatedPage: {}, authenticatedRequest: request });
                });
                break;
            case TestStrategy.AUTHENTICATED_UI:
                (0, exports.test)(title, async ({ authenticatedPage, reporter, apiClient }) => {
                    await testFn({ page: authenticatedPage, reporter, apiClient, authenticatedPage, authenticatedRequest: {} });
                });
                break;
            case TestStrategy.AUTHENTICATED_API:
                (0, exports.test)(title, async ({ authenticatedRequest, reporter, apiClient }) => {
                    await testFn({ request: authenticatedRequest, reporter, apiClient, authenticatedPage: {}, authenticatedRequest });
                });
                break;
            case TestStrategy.HYBRID:
                (0, exports.test)(title, async ({ page, request, reporter, apiClient }) => {
                    await testFn({ page, request, reporter, apiClient, authenticatedPage: {}, authenticatedRequest: {} });
                });
                break;
            case TestStrategy.AUTHENTICATED_HYBRID:
                (0, exports.test)(title, async ({ authenticatedPage, authenticatedRequest, reporter, apiClient }) => {
                    await testFn({ page: authenticatedPage, request: authenticatedRequest, reporter, apiClient, authenticatedPage, authenticatedRequest });
                });
                break;
            default:
                throw new Error(`Unknown test strategy: ${strategy}`);
        }
    }
}
exports.BaseTest = BaseTest;
/**
 * Test strategies
 */
var TestStrategy;
(function (TestStrategy) {
    TestStrategy["UI"] = "ui";
    TestStrategy["API"] = "api";
    TestStrategy["AUTHENTICATED_UI"] = "authenticated-ui";
    TestStrategy["AUTHENTICATED_API"] = "authenticated-api";
    TestStrategy["HYBRID"] = "hybrid";
    TestStrategy["AUTHENTICATED_HYBRID"] = "authenticated-hybrid";
})(TestStrategy || (exports.TestStrategy = TestStrategy = {}));
//# sourceMappingURL=BaseTest.js.map
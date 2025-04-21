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
import { Page, BrowserContext, APIRequestContext } from '@playwright/test';
import { IPage } from '@/interfaces/IPage';
import { IApiClient } from '@/interfaces/IApiClient';
import { IReporter } from '@/interfaces/IReporter';
/**
 * BaseTest
 *
 * Abstract base class for all tests.
 * Implements the Strategy pattern for different testing approaches.
 */
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & BaseTestFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
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
export declare abstract class BaseTest {
    /**
     * The test object
     */
    protected readonly test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & BaseTestFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
    /**
     * The expect function
     */
    protected readonly expect: import("@playwright/test").Expect<{}>;
    /**
     * Creates a new page object
     * @param page Playwright page
     * @param PageClass Page class constructor
     * @returns Instance of the page object
     */
    protected createPage<T extends IPage>(page: Page, PageClass: new (page: Page) => T): T;
    /**
     * Saves authentication state for future use
     * @param page Playwright page
     * @param path Path to save the storage state
     */
    protected saveAuthState(page: Page, path?: string): Promise<void>;
    /**
     * Takes a screenshot and adds it to the report
     * @param page Playwright page
     * @param name Screenshot name
     * @param reporter Reporter instance
     */
    protected takeScreenshot(page: Page, name: string, reporter: IReporter): Promise<void>;
    /**
     * Captures a trace and adds it to the report
     * @param context Browser context
     * @param name Trace name
     * @param reporter Reporter instance
     */
    protected captureTrace(context: BrowserContext, name: string, reporter: IReporter): Promise<void>;
    /**
     * Starts tracing
     * @param context Browser context
     * @param options Tracing options
     */
    protected startTracing(context: BrowserContext, options?: {
        screenshots?: boolean;
        snapshots?: boolean;
    }): Promise<void>;
    /**
     * Retries an operation until it succeeds or times out
     * @param operation Operation to retry
     * @param options Retry options
     * @returns Result of the operation
     */
    protected retry<T>(operation: () => Promise<T>, options?: {
        maxAttempts?: number;
        timeout?: number;
        delay?: number;
    }): Promise<T>;
    /**
     * Executes a test step and reports it
     * @param title Step title
     * @param action Step action
     * @param reporter Reporter instance
     * @returns Result of the action
     */
    protected step<T>(title: string, action: () => Promise<T>, reporter: IReporter): Promise<T>;
    /**
     * Creates a test that uses a specific testing strategy
     * @param title Test title
     * @param testFn Test function
     * @param strategy Test strategy
     */
    protected createTest(title: string, testFn: (fixtures: BaseTestFixtures) => Promise<void>, strategy: TestStrategy): void;
}
/**
 * Test strategies
 */
export declare enum TestStrategy {
    UI = "ui",
    API = "api",
    AUTHENTICATED_UI = "authenticated-ui",
    AUTHENTICATED_API = "authenticated-api",
    HYBRID = "hybrid",
    AUTHENTICATED_HYBRID = "authenticated-hybrid"
}

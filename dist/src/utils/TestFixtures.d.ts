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
import { Page, BrowserContext, APIRequestContext, expect } from '@playwright/test';
import { RegisterPage } from '@/pages/RegisterPage';
import { UserData } from '@/utils/TestDataBuilder';
import { IReporter } from '@/interfaces/IReporter';
import { IApiClient } from '@/interfaces/IApiClient';
/**
 * TestFixtures
 *
 * Provides test fixtures for common test scenarios.
 * Extends Playwright's test fixtures with custom fixtures.
 */
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions & TestFixtures, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
/**
 * TestFixtures interface
 */
export interface TestFixtures {
    registerPage: RegisterPage;
    defaultUserData: UserData;
    randomUserData: UserData;
    userData: UserData;
    authenticatedPage: Page;
    authenticatedRequest: APIRequestContext;
    reporter: IReporter;
    apiClient: IApiClient;
    testContext: Record<string, any>;
}
/**
 * Helper functions for common test operations
 */
export declare class TestHelper {
    /**
     * Registers a new user
     * @param registerPage Register page object
     * @param userData User data
     * @returns Promise that resolves when registration is complete
     */
    static registerUser(registerPage: RegisterPage, userData: UserData): Promise<void>;
    /**
     * Saves authentication state for future use
     * @param page Playwright page
     * @param path Path to save the storage state
     */
    static saveAuthState(page: Page, path?: string): Promise<void>;
    /**
     * Takes a screenshot and adds it to the report
     * @param page Playwright page
     * @param name Screenshot name
     */
    static takeScreenshot(page: Page, name: string): Promise<Buffer>;
    /**
     * Captures a trace and saves it
     * @param context Browser context
     * @param name Trace name
     */
    static captureTrace(context: BrowserContext, name: string): Promise<void>;
    /**
     * Starts tracing
     * @param context Browser context
     * @param options Tracing options
     */
    static startTracing(context: BrowserContext, options?: {
        screenshots?: boolean;
        snapshots?: boolean;
    }): Promise<void>;
    /**
     * Retries an operation until it succeeds or times out
     * @param operation Operation to retry
     * @param options Retry options
     * @returns Result of the operation
     */
    static retry<T>(operation: () => Promise<T>, options?: {
        maxAttempts?: number;
        timeout?: number;
        delay?: number;
    }): Promise<T>;
}
export { expect };

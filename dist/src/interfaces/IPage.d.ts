/**
 * @file IPage.ts
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
/**
 * IPage Interface
 *
 * Defines methods for page navigation with auto-waiting and other page-related functionality.
 * Implements the Facade pattern to simplify complex UI interactions.
 */
export interface IPage {
    /**
     * Navigates to the page URL with auto-waiting for page load
     * @param options Optional navigation options
     * @returns Promise that resolves when navigation is complete
     */
    navigate(options?: {
        timeout?: number;
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }): Promise<void>;
    /**
     * Waits for the page to be fully loaded
     * @param options Optional waiting options
     * @returns Promise that resolves when the page is loaded
     */
    waitForPageLoad(options?: {
        timeout?: number;
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }): Promise<void>;
    /**
     * Gets the current URL of the page
     * @returns Promise that resolves with the current URL
     */
    getCurrentUrl(): Promise<string>;
    /**
     * Gets the title of the page
     * @returns Promise that resolves with the page title
     */
    getTitle(): Promise<string>;
    /**
     * Takes a screenshot of the page
     * @param path Optional path to save the screenshot
     * @returns Promise that resolves with the screenshot buffer
     */
    takeScreenshot(path?: string): Promise<Buffer>;
    /**
     * Checks if the page contains the specified text
     * @param text Text to search for
     * @param options Optional search options
     * @returns Promise that resolves with true if the text is found, false otherwise
     */
    containsText(text: string, options?: {
        timeout?: number;
        ignoreCase?: boolean;
    }): Promise<boolean>;
    /**
     * Executes JavaScript in the context of the page
     * @param script JavaScript to execute
     * @param args Arguments to pass to the script
     * @returns Promise that resolves with the result of the script
     */
    evaluate<T>(script: string | Function, ...args: any[]): Promise<T>;
    /**
     * Waits for a specific condition on the page
     * @param condition Condition to wait for
     * @param options Optional waiting options
     * @returns Promise that resolves when the condition is met
     */
    waitForCondition(condition: () => Promise<boolean> | boolean, options?: {
        timeout?: number;
        polling?: number;
    }): Promise<void>;
}

/**
 * @file BasePage.ts
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
import { IPage } from '@/interfaces/IPage';
/**
 * BasePage
 *
 * Abstract base class for all page objects.
 * Implements the Template Method pattern for page operations.
 */
export declare abstract class BasePage implements IPage {
    /**
     * The Playwright page object
     */
    protected readonly page: Page;
    /**
     * The URL path for this page (relative to base URL)
     */
    protected abstract readonly path: string;
    /**
     * Creates a new BasePage instance
     * @param page Playwright page object
     */
    constructor(page: Page);
    /**
     * Gets the full URL for this page
     * @returns The full URL
     */
    protected getFullUrl(): string;
    /**
     * Navigates to the page
     * @param options Optional navigation options
     * @returns Promise that resolves when navigation is complete
     */
    navigate(options?: {
        timeout?: number;
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    }): Promise<void>;
    /**
     * Template method called after the page is loaded
     * Override this method to perform additional actions after page load
     */
    protected onPageLoaded(): Promise<void>;
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
    /**
     * Waits for an element to be visible
     * @param selector Element selector
     * @param options Optional waiting options
     * @returns Promise that resolves when the element is visible
     */
    protected waitForSelector(selector: string, options?: {
        timeout?: number;
        state?: 'attached' | 'detached' | 'visible' | 'hidden';
    }): Promise<void>;
    /**
     * Clicks on an element
     * @param selector Element selector
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    protected clickElement(selector: string, options?: {
        timeout?: number;
        force?: boolean;
        position?: {
            x: number;
            y: number;
        };
    }): Promise<void>;
    /**
     * Fills a form field
     * @param selector Element selector
     * @param value Value to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    protected fillField(selector: string, value: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Selects an option from a select element
     * @param selector Element selector
     * @param value Value to select
     * @returns Promise that resolves when the selection is complete
     */
    protected selectOption(selector: string, value: string): Promise<void>;
    /**
     * Checks if an element is visible
     * @param selector Element selector
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the element is visible, false otherwise
     */
    protected isElementVisible(selector: string, options?: {
        timeout?: number;
    }): Promise<boolean>;
    /**
     * Gets the text content of an element
     * @param selector Element selector
     * @returns Promise that resolves with the text content
     */
    protected getElementText(selector: string): Promise<string>;
    /**
     * Gets the value of an attribute on an element
     * @param selector Element selector
     * @param attribute Attribute name
     * @returns Promise that resolves with the attribute value
     */
    protected getElementAttribute(selector: string, attribute: string): Promise<string | null>;
    /**
     * Hovers over an element
     * @param selector Element selector
     * @param options Optional hover options
     * @returns Promise that resolves when the hover is complete
     */
    protected hoverElement(selector: string, options?: {
        position?: {
            x: number;
            y: number;
        };
    }): Promise<void>;
    /**
     * Presses a key on the keyboard
     * @param key Key to press
     * @returns Promise that resolves when the key press is complete
     */
    protected pressKey(key: string): Promise<void>;
    /**
     * Types text
     * @param text Text to type
     * @returns Promise that resolves when the typing is complete
     */
    protected typeText(text: string): Promise<void>;
}

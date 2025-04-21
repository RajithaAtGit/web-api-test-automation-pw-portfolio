"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
/**
 * BasePage
 *
 * Abstract base class for all page objects.
 * Implements the Template Method pattern for page operations.
 */
class BasePage {
    /**
     * The Playwright page object
     */
    page;
    /**
     * Creates a new BasePage instance
     * @param page Playwright page object
     */
    constructor(page) {
        this.page = page;
    }
    /**
     * Gets the full URL for this page
     * @returns The full URL
     */
    getFullUrl() {
        const baseUrl = this.page.context().browser()?.options.baseURL || '';
        return `${baseUrl}${this.path}`;
    }
    /**
     * Navigates to the page
     * @param options Optional navigation options
     * @returns Promise that resolves when navigation is complete
     */
    async navigate(options) {
        await this.page.goto(this.getFullUrl(), options);
        await this.waitForPageLoad(options);
        await this.onPageLoaded();
    }
    /**
     * Template method called after the page is loaded
     * Override this method to perform additional actions after page load
     */
    async onPageLoaded() {
        // Default implementation does nothing
        // Subclasses can override this method to perform additional actions
    }
    /**
     * Waits for the page to be fully loaded
     * @param options Optional waiting options
     * @returns Promise that resolves when the page is loaded
     */
    async waitForPageLoad(options) {
        const waitUntil = options?.waitUntil || 'networkidle';
        await this.page.waitForLoadState(waitUntil, { timeout: options?.timeout });
    }
    /**
     * Gets the current URL of the page
     * @returns Promise that resolves with the current URL
     */
    async getCurrentUrl() {
        return this.page.url();
    }
    /**
     * Gets the title of the page
     * @returns Promise that resolves with the page title
     */
    async getTitle() {
        return this.page.title();
    }
    /**
     * Takes a screenshot of the page
     * @param path Optional path to save the screenshot
     * @returns Promise that resolves with the screenshot buffer
     */
    async takeScreenshot(path) {
        return this.page.screenshot({ path });
    }
    /**
     * Checks if the page contains the specified text
     * @param text Text to search for
     * @param options Optional search options
     * @returns Promise that resolves with true if the text is found, false otherwise
     */
    async containsText(text, options) {
        const searchText = options?.ignoreCase ? text.toLowerCase() : text;
        try {
            const content = await this.page.content();
            const pageText = options?.ignoreCase ? content.toLowerCase() : content;
            return pageText.includes(searchText);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Executes JavaScript in the context of the page
     * @param script JavaScript to execute
     * @param args Arguments to pass to the script
     * @returns Promise that resolves with the result of the script
     */
    async evaluate(script, ...args) {
        return this.page.evaluate(script, ...args);
    }
    /**
     * Waits for a specific condition on the page
     * @param condition Condition to wait for
     * @param options Optional waiting options
     * @returns Promise that resolves when the condition is met
     */
    async waitForCondition(condition, options) {
        const timeout = options?.timeout || 30000;
        const polling = options?.polling || 100;
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, polling));
        }
        throw new Error(`Condition not met within timeout: ${timeout}ms`);
    }
    /**
     * Waits for an element to be visible
     * @param selector Element selector
     * @param options Optional waiting options
     * @returns Promise that resolves when the element is visible
     */
    async waitForSelector(selector, options) {
        await this.page.waitForSelector(selector, options);
    }
    /**
     * Clicks on an element
     * @param selector Element selector
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    async clickElement(selector, options) {
        await this.page.click(selector, options);
    }
    /**
     * Fills a form field
     * @param selector Element selector
     * @param value Value to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    async fillField(selector, value, options) {
        await this.page.fill(selector, value, options);
    }
    /**
     * Selects an option from a select element
     * @param selector Element selector
     * @param value Value to select
     * @returns Promise that resolves when the selection is complete
     */
    async selectOption(selector, value) {
        await this.page.selectOption(selector, value);
    }
    /**
     * Checks if an element is visible
     * @param selector Element selector
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the element is visible, false otherwise
     */
    async isElementVisible(selector, options) {
        try {
            await this.page.waitForSelector(selector, { state: 'visible', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Gets the text content of an element
     * @param selector Element selector
     * @returns Promise that resolves with the text content
     */
    async getElementText(selector) {
        return this.page.textContent(selector) || '';
    }
    /**
     * Gets the value of an attribute on an element
     * @param selector Element selector
     * @param attribute Attribute name
     * @returns Promise that resolves with the attribute value
     */
    async getElementAttribute(selector, attribute) {
        return this.page.getAttribute(selector, attribute);
    }
    /**
     * Hovers over an element
     * @param selector Element selector
     * @param options Optional hover options
     * @returns Promise that resolves when the hover is complete
     */
    async hoverElement(selector, options) {
        await this.page.hover(selector, options);
    }
    /**
     * Presses a key on the keyboard
     * @param key Key to press
     * @returns Promise that resolves when the key press is complete
     */
    async pressKey(key) {
        await this.page.keyboard.press(key);
    }
    /**
     * Types text
     * @param text Text to type
     * @returns Promise that resolves when the typing is complete
     */
    async typeText(text) {
        await this.page.keyboard.type(text);
    }
}
exports.BasePage = BasePage;
//# sourceMappingURL=BasePage.js.map
"use strict";
/**
 * @file BaseComponent.ts
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
exports.BaseComponent = void 0;
/**
 * BaseComponent
 *
 * Abstract base class for all UI components.
 * Implements the Bridge pattern for component implementations.
 */
class BaseComponent {
    /**
     * The Playwright page object
     */
    page;
    /**
     * The root locator for this component
     */
    rootLocator;
    /**
     * Creates a new BaseComponent instance
     * @param page Playwright page object
     * @param selector Selector for the root element of the component
     */
    constructor(page, selector) {
        this.page = page;
        this.rootLocator = page.locator(selector);
    }
    /**
     * Checks if the component is visible
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the component is visible, false otherwise
     */
    async isVisible(options) {
        try {
            await this.rootLocator.waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Waits for the component to be visible
     * @param options Optional waiting options
     * @returns Promise that resolves when the component is visible
     */
    async waitForVisible(options) {
        await this.rootLocator.waitFor({ state: 'visible', timeout: options?.timeout });
    }
    /**
     * Clicks on the component
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    async click(options) {
        await this.rootLocator.click(options);
    }
    /**
     * Hovers over the component
     * @param options Optional hover options
     * @returns Promise that resolves when the hover is complete
     */
    async hover(options) {
        await this.rootLocator.hover(options);
    }
    /**
     * Gets the text content of the component
     * @returns Promise that resolves with the text content
     */
    async getText() {
        return (await this.rootLocator.textContent()) || '';
    }
    /**
     * Gets the value of an attribute
     * @param name Attribute name
     * @returns Promise that resolves with the attribute value
     */
    async getAttribute(name) {
        return this.rootLocator.getAttribute(name);
    }
    /**
     * Fills a form field component with text
     * @param text Text to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    async fill(text, options) {
        await this.rootLocator.fill(text, options);
    }
    /**
     * Selects an option from a select component
     * @param value Value to select
     * @param options Optional select options
     * @returns Promise that resolves when the selection is complete
     */
    async select(value, options) {
        await this.rootLocator.selectOption(value, options);
    }
    /**
     * Checks if the component contains the specified text
     * @param text Text to search for
     * @param options Optional search options
     * @returns Promise that resolves with true if the text is found, false otherwise
     */
    async containsText(text, options) {
        const searchText = options?.ignoreCase ? text.toLowerCase() : text;
        try {
            const content = await this.getText();
            const componentText = options?.ignoreCase ? content.toLowerCase() : content;
            return componentText.includes(searchText);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Highlights the component for debugging purposes
     * @param duration Duration in milliseconds to highlight the component
     * @returns Promise that resolves when the highlight is complete
     */
    async highlight(duration = 1000) {
        await this.rootLocator.evaluate((element, duration) => {
            const originalOutline = element.style.outline;
            const originalBackgroundColor = element.style.backgroundColor;
            element.style.outline = '3px solid red';
            element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            setTimeout(() => {
                element.style.outline = originalOutline;
                element.style.backgroundColor = originalBackgroundColor;
            }, duration);
        }, duration);
        await this.page.waitForTimeout(duration);
    }
    /**
     * Gets child components
     * @param selector Selector for child components
     * @returns Promise that resolves with an array of child components
     */
    async getChildren(selector) {
        const childLocators = this.rootLocator.locator(selector);
        const count = await childLocators.count();
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(new LocatorComponent(this.page, childLocators.nth(i)));
        }
        return children;
    }
    /**
     * Finds a child component by selector
     * @param selector Selector for the child component
     * @returns Promise that resolves with the child component or null if not found
     */
    async findChild(selector) {
        const childLocator = this.rootLocator.locator(selector);
        if (await childLocator.count() > 0) {
            return new LocatorComponent(this.page, childLocator);
        }
        return null;
    }
    /**
     * Checks if the component exists in the DOM
     * @param options Optional existence check options
     * @returns Promise that resolves with true if the component exists, false otherwise
     */
    async exists(options) {
        try {
            await this.rootLocator.waitFor({ state: 'attached', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Waits for the component to exist in the DOM
     * @param options Optional waiting options
     * @returns Promise that resolves when the component exists
     */
    async waitForExists(options) {
        await this.rootLocator.waitFor({ state: 'attached', timeout: options?.timeout });
    }
    /**
     * Scrolls the component into view
     * @param options Optional scroll options
     * @returns Promise that resolves when the scroll is complete
     */
    async scrollIntoView(options) {
        await this.rootLocator.scrollIntoViewIfNeeded();
    }
    /**
     * Gets a locator for a child element
     * @param selector Selector for the child element
     * @returns Locator for the child element
     */
    getChildLocator(selector) {
        return this.rootLocator.locator(selector);
    }
    /**
     * Clicks on a child element
     * @param selector Selector for the child element
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    async clickChild(selector, options) {
        await this.getChildLocator(selector).click(options);
    }
    /**
     * Gets the text content of a child element
     * @param selector Selector for the child element
     * @returns Promise that resolves with the text content
     */
    async getChildText(selector) {
        return (await this.getChildLocator(selector).textContent()) || '';
    }
    /**
     * Fills a child form field
     * @param selector Selector for the child element
     * @param value Value to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    async fillChild(selector, value, options) {
        await this.getChildLocator(selector).fill(value, options);
    }
    /**
     * Checks if a child element is visible
     * @param selector Selector for the child element
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the child element is visible, false otherwise
     */
    async isChildVisible(selector, options) {
        try {
            await this.getChildLocator(selector).waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.BaseComponent = BaseComponent;
/**
 * LocatorComponent
 *
 * A component implementation that wraps a Playwright Locator.
 * Used internally by BaseComponent for child components.
 */
class LocatorComponent {
    page;
    locator;
    constructor(page, locator) {
        this.page = page;
        this.locator = locator;
    }
    async isVisible(options) {
        try {
            await this.locator.waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async waitForVisible(options) {
        await this.locator.waitFor({ state: 'visible', timeout: options?.timeout });
    }
    async click(options) {
        await this.locator.click(options);
    }
    async hover(options) {
        await this.locator.hover(options);
    }
    async getText() {
        return (await this.locator.textContent()) || '';
    }
    async getAttribute(name) {
        return this.locator.getAttribute(name);
    }
    async fill(text, options) {
        await this.locator.fill(text, options);
    }
    async select(value, options) {
        await this.locator.selectOption(value, options);
    }
    async containsText(text, options) {
        const searchText = options?.ignoreCase ? text.toLowerCase() : text;
        try {
            const content = await this.getText();
            const componentText = options?.ignoreCase ? content.toLowerCase() : content;
            return componentText.includes(searchText);
        }
        catch (error) {
            return false;
        }
    }
    async highlight(duration = 1000) {
        await this.locator.evaluate((element, duration) => {
            const originalOutline = element.style.outline;
            const originalBackgroundColor = element.style.backgroundColor;
            element.style.outline = '3px solid red';
            element.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            setTimeout(() => {
                element.style.outline = originalOutline;
                element.style.backgroundColor = originalBackgroundColor;
            }, duration);
        }, duration);
        await this.page.waitForTimeout(duration);
    }
    async getChildren(selector) {
        const childLocators = this.locator.locator(selector);
        const count = await childLocators.count();
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(new LocatorComponent(this.page, childLocators.nth(i)));
        }
        return children;
    }
    async findChild(selector) {
        const childLocator = this.locator.locator(selector);
        if (await childLocator.count() > 0) {
            return new LocatorComponent(this.page, childLocator);
        }
        return null;
    }
    async exists(options) {
        try {
            await this.locator.waitFor({ state: 'attached', timeout: options?.timeout || 1000 });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async waitForExists(options) {
        await this.locator.waitFor({ state: 'attached', timeout: options?.timeout });
    }
    async scrollIntoView(options) {
        await this.locator.scrollIntoViewIfNeeded();
    }
}
//# sourceMappingURL=BaseComponent.js.map
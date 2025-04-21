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
import { Locator, Page } from '@playwright/test';
import { IComponent } from '../interfaces/IComponent';
/**
 * BaseComponent
 *
 * Abstract base class for all UI components.
 * Implements the Bridge pattern for component implementations.
 */
export declare abstract class BaseComponent implements IComponent {
    /**
     * The Playwright page object
     */
    protected readonly page: Page;
    /**
     * The root locator for this component
     */
    protected readonly rootLocator: Locator;
    /**
     * Creates a new BaseComponent instance
     * @param page Playwright page object
     * @param selector Selector for the root element of the component
     */
    constructor(page: Page, selector: string);
    /**
     * Checks if the component is visible
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the component is visible, false otherwise
     */
    isVisible(options?: {
        timeout?: number;
    }): Promise<boolean>;
    /**
     * Waits for the component to be visible
     * @param options Optional waiting options
     * @returns Promise that resolves when the component is visible
     */
    waitForVisible(options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Clicks on the component
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    click(options?: {
        timeout?: number;
        force?: boolean;
        position?: {
            x: number;
            y: number;
        };
    }): Promise<void>;
    /**
     * Hovers over the component
     * @param options Optional hover options
     * @returns Promise that resolves when the hover is complete
     */
    hover(options?: {
        timeout?: number;
        position?: {
            x: number;
            y: number;
        };
    }): Promise<void>;
    /**
     * Gets the text content of the component
     * @returns Promise that resolves with the text content
     */
    getText(): Promise<string>;
    /**
     * Gets the value of an attribute
     * @param name Attribute name
     * @returns Promise that resolves with the attribute value
     */
    getAttribute(name: string): Promise<string | null>;
    /**
     * Fills a form field component with text
     * @param text Text to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    fill(text: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Selects an option from a select component
     * @param value Value to select
     * @param options Optional select options
     * @returns Promise that resolves when the selection is complete
     */
    select(value: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Checks if the component contains the specified text
     * @param text Text to search for
     * @param options Optional search options
     * @returns Promise that resolves with true if the text is found, false otherwise
     */
    containsText(text: string, options?: {
        timeout?: number;
        ignoreCase?: boolean;
    }): Promise<boolean>;
    /**
     * Highlights the component for debugging purposes
     * @param duration Duration in milliseconds to highlight the component
     * @returns Promise that resolves when the highlight is complete
     */
    highlight(duration?: number): Promise<void>;
    /**
     * Gets child components
     * @param selector Selector for child components
     * @returns Promise that resolves with an array of child components
     */
    getChildren(selector: string): Promise<IComponent[]>;
    /**
     * Finds a child component by selector
     * @param selector Selector for the child component
     * @returns Promise that resolves with the child component or null if not found
     */
    findChild(selector: string): Promise<IComponent | null>;
    /**
     * Checks if the component exists in the DOM
     * @param options Optional existence check options
     * @returns Promise that resolves with true if the component exists, false otherwise
     */
    exists(options?: {
        timeout?: number;
    }): Promise<boolean>;
    /**
     * Waits for the component to exist in the DOM
     * @param options Optional waiting options
     * @returns Promise that resolves when the component exists
     */
    waitForExists(options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Scrolls the component into view
     * @param options Optional scroll options
     * @returns Promise that resolves when the scroll is complete
     */
    scrollIntoView(options?: {
        behavior?: 'auto' | 'smooth';
        block?: 'start' | 'center' | 'end' | 'nearest';
    }): Promise<void>;
    /**
     * Gets a locator for a child element
     * @param selector Selector for the child element
     * @returns Locator for the child element
     */
    protected getChildLocator(selector: string): Locator;
    /**
     * Clicks on a child element
     * @param selector Selector for the child element
     * @param options Optional click options
     * @returns Promise that resolves when the click is complete
     */
    protected clickChild(selector: string, options?: {
        timeout?: number;
        force?: boolean;
        position?: {
            x: number;
            y: number;
        };
    }): Promise<void>;
    /**
     * Gets the text content of a child element
     * @param selector Selector for the child element
     * @returns Promise that resolves with the text content
     */
    protected getChildText(selector: string): Promise<string>;
    /**
     * Fills a child form field
     * @param selector Selector for the child element
     * @param value Value to fill
     * @param options Optional fill options
     * @returns Promise that resolves when the fill is complete
     */
    protected fillChild(selector: string, value: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Checks if a child element is visible
     * @param selector Selector for the child element
     * @param options Optional visibility check options
     * @returns Promise that resolves with true if the child element is visible, false otherwise
     */
    protected isChildVisible(selector: string, options?: {
        timeout?: number;
    }): Promise<boolean>;
}

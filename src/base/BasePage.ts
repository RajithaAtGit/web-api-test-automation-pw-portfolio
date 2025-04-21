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
export abstract class BasePage implements IPage {
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
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Gets the full URL for this page
   * @returns The full URL
   */
  protected getFullUrl(): string {
    const baseUrl = this.page.context().browser()?.options.baseURL || '';
    return `${baseUrl}${this.path}`;
  }

  /**
   * Navigates to the page
   * @param options Optional navigation options
   * @returns Promise that resolves when navigation is complete
   */
  public async navigate(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.goto(this.getFullUrl(), options);
    await this.waitForPageLoad(options);
    await this.onPageLoaded();
  }

  /**
   * Template method called after the page is loaded
   * Override this method to perform additional actions after page load
   */
  protected async onPageLoaded(): Promise<void> {
    // Default implementation does nothing
    // Subclasses can override this method to perform additional actions
  }

  /**
   * Waits for the page to be fully loaded
   * @param options Optional waiting options
   * @returns Promise that resolves when the page is loaded
   */
  public async waitForPageLoad(options?: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const waitUntil = options?.waitUntil || 'networkidle';
    await this.page.waitForLoadState(waitUntil, { timeout: options?.timeout });
  }

  /**
   * Gets the current URL of the page
   * @returns Promise that resolves with the current URL
   */
  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Gets the title of the page
   * @returns Promise that resolves with the page title
   */
  public async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Takes a screenshot of the page
   * @param path Optional path to save the screenshot
   * @returns Promise that resolves with the screenshot buffer
   */
  public async takeScreenshot(path?: string): Promise<Buffer> {
    return this.page.screenshot({ path });
  }

  /**
   * Checks if the page contains the specified text
   * @param text Text to search for
   * @param options Optional search options
   * @returns Promise that resolves with true if the text is found, false otherwise
   */
  public async containsText(text: string, options?: { timeout?: number; ignoreCase?: boolean }): Promise<boolean> {
    const searchText = options?.ignoreCase ? text.toLowerCase() : text;
    try {
      const content = await this.page.content();
      const pageText = options?.ignoreCase ? content.toLowerCase() : content;
      return pageText.includes(searchText);
    } catch (error) {
      return false;
    }
  }

  /**
   * Executes JavaScript in the context of the page
   * @param script JavaScript to execute
   * @param args Arguments to pass to the script
   * @returns Promise that resolves with the result of the script
   */
  public async evaluate<T>(script: string | Function, ...args: any[]): Promise<T> {
    return this.page.evaluate(script as any, ...args);
  }

  /**
   * Waits for a specific condition on the page
   * @param condition Condition to wait for
   * @param options Optional waiting options
   * @returns Promise that resolves when the condition is met
   */
  public async waitForCondition(condition: () => Promise<boolean> | boolean, options?: { timeout?: number; polling?: number }): Promise<void> {
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
  protected async waitForSelector(selector: string, options?: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' }): Promise<void> {
    await this.page.waitForSelector(selector, options);
  }

  /**
   * Clicks on an element
   * @param selector Element selector
   * @param options Optional click options
   * @returns Promise that resolves when the click is complete
   */
  protected async clickElement(selector: string, options?: { timeout?: number; force?: boolean; position?: { x: number; y: number } }): Promise<void> {
    await this.page.click(selector, options);
  }

  /**
   * Fills a form field
   * @param selector Element selector
   * @param value Value to fill
   * @param options Optional fill options
   * @returns Promise that resolves when the fill is complete
   */
  protected async fillField(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.page.fill(selector, value, options);
  }

  /**
   * Selects an option from a select element
   * @param selector Element selector
   * @param value Value to select
   * @returns Promise that resolves when the selection is complete
   */
  protected async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Checks if an element is visible
   * @param selector Element selector
   * @param options Optional visibility check options
   * @returns Promise that resolves with true if the element is visible, false otherwise
   */
  protected async isElementVisible(selector: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the text content of an element
   * @param selector Element selector
   * @returns Promise that resolves with the text content
   */
  protected async getElementText(selector: string): Promise<string> {
    return this.page.textContent(selector) || '';
  }

  /**
   * Gets the value of an attribute on an element
   * @param selector Element selector
   * @param attribute Attribute name
   * @returns Promise that resolves with the attribute value
   */
  protected async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.page.getAttribute(selector, attribute);
  }

  /**
   * Hovers over an element
   * @param selector Element selector
   * @param options Optional hover options
   * @returns Promise that resolves when the hover is complete
   */
  protected async hoverElement(selector: string, options?: { position?: { x: number; y: number } }): Promise<void> {
    await this.page.hover(selector, options);
  }

  /**
   * Presses a key on the keyboard
   * @param key Key to press
   * @returns Promise that resolves when the key press is complete
   */
  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Types text
   * @param text Text to type
   * @returns Promise that resolves when the typing is complete
   */
  protected async typeText(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }
}

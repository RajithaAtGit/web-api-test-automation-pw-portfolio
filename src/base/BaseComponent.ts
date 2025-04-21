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
export abstract class BaseComponent implements IComponent {
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
  constructor(page: Page, selector: string) {
    this.page = page;
    this.rootLocator = page.locator(selector);
  }

  /**
   * Checks if the component is visible
   * @param options Optional visibility check options
   * @returns Promise that resolves with true if the component is visible, false otherwise
   */
  public async isVisible(options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.rootLocator.waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Waits for the component to be visible
   * @param options Optional waiting options
   * @returns Promise that resolves when the component is visible
   */
  public async waitForVisible(options?: { timeout?: number }): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout: options?.timeout });
  }

  /**
   * Clicks on the component
   * @param options Optional click options
   * @returns Promise that resolves when the click is complete
   */
  public async click(options?: { timeout?: number; force?: boolean; position?: { x: number; y: number } }): Promise<void> {
    await this.rootLocator.click(options);
  }

  /**
   * Hovers over the component
   * @param options Optional hover options
   * @returns Promise that resolves when the hover is complete
   */
  public async hover(options?: { timeout?: number; position?: { x: number; y: number } }): Promise<void> {
    await this.rootLocator.hover(options);
  }

  /**
   * Gets the text content of the component
   * @returns Promise that resolves with the text content
   */
  public async getText(): Promise<string> {
    return (await this.rootLocator.textContent()) || '';
  }

  /**
   * Gets the value of an attribute
   * @param name Attribute name
   * @returns Promise that resolves with the attribute value
   */
  public async getAttribute(name: string): Promise<string | null> {
    return this.rootLocator.getAttribute(name);
  }

  /**
   * Fills a form field component with text
   * @param text Text to fill
   * @param options Optional fill options
   * @returns Promise that resolves when the fill is complete
   */
  public async fill(text: string, options?: { timeout?: number }): Promise<void> {
    await this.rootLocator.fill(text, options);
  }

  /**
   * Selects an option from a select component
   * @param value Value to select
   * @param options Optional select options
   * @returns Promise that resolves when the selection is complete
   */
  public async select(value: string, options?: { timeout?: number }): Promise<void> {
    await this.rootLocator.selectOption(value, options);
  }

  /**
   * Checks if the component contains the specified text
   * @param text Text to search for
   * @param options Optional search options
   * @returns Promise that resolves with true if the text is found, false otherwise
   */
  public async containsText(text: string, options?: { timeout?: number; ignoreCase?: boolean }): Promise<boolean> {
    const searchText = options?.ignoreCase ? text.toLowerCase() : text;
    try {
      const content = await this.getText();
      const componentText = options?.ignoreCase ? content.toLowerCase() : content;
      return componentText.includes(searchText);
    } catch (error) {
      return false;
    }
  }

  /**
   * Highlights the component for debugging purposes
   * @param duration Duration in milliseconds to highlight the component
   * @returns Promise that resolves when the highlight is complete
   */
  public async highlight(duration: number = 1000): Promise<void> {
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
  public async getChildren(selector: string): Promise<IComponent[]> {
    const childLocators = this.rootLocator.locator(selector);
    const count = await childLocators.count();
    const children: IComponent[] = [];

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
  public async findChild(selector: string): Promise<IComponent | null> {
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
  public async exists(options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.rootLocator.waitFor({ state: 'attached', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Waits for the component to exist in the DOM
   * @param options Optional waiting options
   * @returns Promise that resolves when the component exists
   */
  public async waitForExists(options?: { timeout?: number }): Promise<void> {
    await this.rootLocator.waitFor({ state: 'attached', timeout: options?.timeout });
  }

  /**
   * Scrolls the component into view
   * @param options Optional scroll options
   * @returns Promise that resolves when the scroll is complete
   */
  public async scrollIntoView(options?: { behavior?: 'auto' | 'smooth'; block?: 'start' | 'center' | 'end' | 'nearest' }): Promise<void> {
    await this.rootLocator.scrollIntoViewIfNeeded();
  }

  /**
   * Gets a locator for a child element
   * @param selector Selector for the child element
   * @returns Locator for the child element
   */
  protected getChildLocator(selector: string): Locator {
    return this.rootLocator.locator(selector);
  }

  /**
   * Clicks on a child element
   * @param selector Selector for the child element
   * @param options Optional click options
   * @returns Promise that resolves when the click is complete
   */
  protected async clickChild(selector: string, options?: { timeout?: number; force?: boolean; position?: { x: number; y: number } }): Promise<void> {
    await this.getChildLocator(selector).click(options);
  }

  /**
   * Gets the text content of a child element
   * @param selector Selector for the child element
   * @returns Promise that resolves with the text content
   */
  protected async getChildText(selector: string): Promise<string> {
    return (await this.getChildLocator(selector).textContent()) || '';
  }

  /**
   * Fills a child form field
   * @param selector Selector for the child element
   * @param value Value to fill
   * @param options Optional fill options
   * @returns Promise that resolves when the fill is complete
   */
  protected async fillChild(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
    await this.getChildLocator(selector).fill(value, options);
  }

  /**
   * Checks if a child element is visible
   * @param selector Selector for the child element
   * @param options Optional visibility check options
   * @returns Promise that resolves with true if the child element is visible, false otherwise
   */
  protected async isChildVisible(selector: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.getChildLocator(selector).waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * LocatorComponent
 * 
 * A component implementation that wraps a Playwright Locator.
 * Used internally by BaseComponent for child components.
 */
class LocatorComponent implements IComponent {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, locator: Locator) {
    this.page = page;
    this.locator = locator;
  }

  public async isVisible(options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.locator.waitFor({ state: 'visible', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  public async waitForVisible(options?: { timeout?: number }): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout: options?.timeout });
  }

  public async click(options?: { timeout?: number; force?: boolean; position?: { x: number; y: number } }): Promise<void> {
    await this.locator.click(options);
  }

  public async hover(options?: { timeout?: number; position?: { x: number; y: number } }): Promise<void> {
    await this.locator.hover(options);
  }

  public async getText(): Promise<string> {
    return (await this.locator.textContent()) || '';
  }

  public async getAttribute(name: string): Promise<string | null> {
    return this.locator.getAttribute(name);
  }

  public async fill(text: string, options?: { timeout?: number }): Promise<void> {
    await this.locator.fill(text, options);
  }

  public async select(value: string, options?: { timeout?: number }): Promise<void> {
    await this.locator.selectOption(value, options);
  }

  public async containsText(text: string, options?: { timeout?: number; ignoreCase?: boolean }): Promise<boolean> {
    const searchText = options?.ignoreCase ? text.toLowerCase() : text;
    try {
      const content = await this.getText();
      const componentText = options?.ignoreCase ? content.toLowerCase() : content;
      return componentText.includes(searchText);
    } catch (error) {
      return false;
    }
  }

  public async highlight(duration: number = 1000): Promise<void> {
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

  public async getChildren(selector: string): Promise<IComponent[]> {
    const childLocators = this.locator.locator(selector);
    const count = await childLocators.count();
    const children: IComponent[] = [];

    for (let i = 0; i < count; i++) {
      children.push(new LocatorComponent(this.page, childLocators.nth(i)));
    }

    return children;
  }

  public async findChild(selector: string): Promise<IComponent | null> {
    const childLocator = this.locator.locator(selector);
    if (await childLocator.count() > 0) {
      return new LocatorComponent(this.page, childLocator);
    }
    return null;
  }

  public async exists(options?: { timeout?: number }): Promise<boolean> {
    try {
      await this.locator.waitFor({ state: 'attached', timeout: options?.timeout || 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  public async waitForExists(options?: { timeout?: number }): Promise<void> {
    await this.locator.waitFor({ state: 'attached', timeout: options?.timeout });
  }

  public async scrollIntoView(options?: { behavior?: 'auto' | 'smooth'; block?: 'start' | 'center' | 'end' | 'nearest' }): Promise<void> {
    await this.locator.scrollIntoViewIfNeeded();
  }
}

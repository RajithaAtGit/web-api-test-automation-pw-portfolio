/**
 * @file NavigationMenu.ts
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
import { BaseComponent } from '../base/BaseComponent';

/**
 * NavigationMenu
 * 
 * Component for the main navigation menu.
 * Implements the Composite pattern for menu structure.
 */
export class NavigationMenu extends BaseComponent {
  // Selectors for navigation menu elements
  private readonly menuItemSelector: string = '.menu-item';
  private readonly activeMenuItemSelector: string = '.menu-item.active';
  private readonly submenuSelector: string = '.submenu';
  private readonly submenuItemSelector: string = '.submenu-item';
  private readonly expandButtonSelector: string = '.expand-button';
  private readonly collapseButtonSelector: string = '.collapse-button';
  private readonly menuToggleSelector: string = '.menu-toggle';
  private readonly userProfileSelector: string = '.user-profile';
  private readonly notificationBadgeSelector: string = '.notification-badge';

  /**
   * Creates a new NavigationMenu instance
   * @param page Playwright page
   * @param selector Selector for the root element of the component
   */
  constructor(page: Page, selector: string) {
    super(page, selector);
  }

  /**
   * Navigates to a menu item by text
   * @param text Text of the menu item to navigate to
   * @returns Promise that resolves when navigation is complete
   */
  public async navigateToMenuItem(text: string): Promise<void> {
    // Find the menu item by text
    const menuItemLocator = this.getChildLocator(`${this.menuItemSelector}:has-text("${text}")`);

    // Check if the menu item exists
    if (await menuItemLocator.count() === 0) {
      throw new Error(`Menu item with text "${text}" not found`);
    }

    // Check if the menu item has a submenu that needs to be expanded
    const hasSubmenu = await menuItemLocator.locator(this.submenuSelector).count() > 0;
    if (hasSubmenu) {
      // Check if the submenu is already expanded
      const isExpanded = await menuItemLocator.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        // Expand the submenu
        await menuItemLocator.click();
        // Wait for the submenu to be visible
        await this.page.waitForSelector(`${this.menuItemSelector}:has-text("${text}") ${this.submenuSelector}`, { state: 'visible' });
      }
    } else {
      // Click the menu item to navigate
      await menuItemLocator.click();

      // Wait for navigation to complete
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Navigates to a submenu item
   * @param menuText Text of the parent menu item
   * @param submenuText Text of the submenu item to navigate to
   * @returns Promise that resolves when navigation is complete
   */
  public async navigateToSubmenuItem(menuText: string, submenuText: string): Promise<void> {
    // First, make sure the parent menu item is expanded
    const menuItemLocator = this.getChildLocator(`${this.menuItemSelector}:has-text("${menuText}")`);

    // Check if the menu item exists
    if (await menuItemLocator.count() === 0) {
      throw new Error(`Menu item with text "${menuText}" not found`);
    }

    // Check if the submenu is already expanded
    const isExpanded = await menuItemLocator.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      // Expand the submenu
      await menuItemLocator.click();
      // Wait for the submenu to be visible
      await this.page.waitForSelector(`${this.menuItemSelector}:has-text("${menuText}") ${this.submenuSelector}`, { state: 'visible' });
    }

    // Now click the submenu item
    const submenuItemLocator = menuItemLocator.locator(`${this.submenuSelector} ${this.submenuItemSelector}:has-text("${submenuText}")`);

    // Check if the submenu item exists
    if (await submenuItemLocator.count() === 0) {
      throw new Error(`Submenu item with text "${submenuText}" not found under menu "${menuText}"`);
    }

    // Click the submenu item to navigate
    await submenuItemLocator.click();

    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Gets the currently active menu item
   * @returns Promise that resolves with the text of the active menu item or null if none is active
   */
  public async getActiveMenuItem(): Promise<string | null> {
    const activeMenuItemLocator = this.getChildLocator(this.activeMenuItemSelector);

    if (await activeMenuItemLocator.count() === 0) {
      return null;
    }

    return (await activeMenuItemLocator.textContent())?.trim() || null;
  }

  /**
   * Checks if a menu item is active
   * @param text Text of the menu item to check
   * @returns Promise that resolves with true if the menu item is active, false otherwise
   */
  public async isMenuItemActive(text: string): Promise<boolean> {
    const activeMenuItem = await this.getActiveMenuItem();
    return activeMenuItem === text;
  }

  /**
   * Expands the navigation menu
   * @returns Promise that resolves when the menu is expanded
   */
  public async expandMenu(): Promise<void> {
    // Check if the menu is already expanded
    const isExpanded = await this.rootLocator.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      // Click the expand button
      await this.clickChild(this.expandButtonSelector);

      // Wait for the menu to be expanded
      await this.page.waitForSelector(`${this.rootLocator.toString()}[aria-expanded="true"]`, { state: 'visible' });
    }
  }

  /**
   * Collapses the navigation menu
   * @returns Promise that resolves when the menu is collapsed
   */
  public async collapseMenu(): Promise<void> {
    // Check if the menu is already collapsed
    const isExpanded = await this.rootLocator.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      // Click the collapse button
      await this.clickChild(this.collapseButtonSelector);

      // Wait for the menu to be collapsed
      await this.page.waitForSelector(`${this.rootLocator.toString()}[aria-expanded="false"]`, { state: 'visible' });
    }
  }

  /**
   * Toggles the navigation menu (expands if collapsed, collapses if expanded)
   * @returns Promise that resolves when the toggle is complete
   */
  public async toggleMenu(): Promise<void> {
    await this.clickChild(this.menuToggleSelector);

    // Wait for the toggle animation to complete
    await this.page.waitForTimeout(500);
  }

  /**
   * Gets all menu items
   * @returns Promise that resolves with an array of menu item texts
   */
  public async getMenuItems(): Promise<string[]> {
    const menuItems: string[] = [];
    const menuItemLocators = this.getChildLocator(this.menuItemSelector);
    const count = await menuItemLocators.count();

    for (let i = 0; i < count; i++) {
      const text = await menuItemLocators.nth(i).textContent();
      if (text) {
        menuItems.push(text.trim());
      }
    }

    return menuItems;
  }

  /**
   * Gets submenu items for a menu item
   * @param menuText Text of the parent menu item
   * @returns Promise that resolves with an array of submenu item texts
   */
  public async getSubmenuItems(menuText: string): Promise<string[]> {
    const submenuItems: string[] = [];

    // Find the menu item
    const menuItemLocator = this.getChildLocator(`${this.menuItemSelector}:has-text("${menuText}")`);

    // Check if the menu item exists
    if (await menuItemLocator.count() === 0) {
      throw new Error(`Menu item with text "${menuText}" not found`);
    }

    // Check if the menu item has a submenu
    const submenuLocator = menuItemLocator.locator(this.submenuSelector);
    if (await submenuLocator.count() === 0) {
      return submenuItems;
    }

    // Make sure the submenu is expanded
    const isExpanded = await menuItemLocator.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      await menuItemLocator.click();
      await this.page.waitForSelector(`${this.menuItemSelector}:has-text("${menuText}") ${this.submenuSelector}`, { state: 'visible' });
    }

    // Get all submenu items
    const submenuItemLocators = submenuLocator.locator(this.submenuItemSelector);
    const count = await submenuItemLocators.count();

    for (let i = 0; i < count; i++) {
      const text = await submenuItemLocators.nth(i).textContent();
      if (text) {
        submenuItems.push(text.trim());
      }
    }

    return submenuItems;
  }

  /**
   * Clicks on the user profile menu
   * @returns Promise that resolves when the user profile menu is clicked
   */
  public async clickUserProfile(): Promise<void> {
    await this.clickChild(this.userProfileSelector);

    // Wait for the user profile menu to be visible
    await this.page.waitForSelector('.user-profile-menu', { state: 'visible' });
  }

  /**
   * Gets the notification count
   * @returns Promise that resolves with the notification count or 0 if no badge is present
   */
  public async getNotificationCount(): Promise<number> {
    const badgeLocator = this.getChildLocator(this.notificationBadgeSelector);

    if (await badgeLocator.count() === 0) {
      return 0;
    }

    const badgeText = await badgeLocator.textContent();
    return badgeText ? parseInt(badgeText.trim(), 10) : 0;
  }

  /**
   * Logs out by clicking the user profile and then the logout option
   * @returns Promise that resolves when logout is complete
   */
  public async logout(): Promise<void> {
    // Click the user profile to open the menu
    await this.clickUserProfile();

    // Click the logout option
    await this.page.click('.user-profile-menu .logout-option');

    // Wait for navigation to the login page
    await this.page.waitForURL('**/login');
  }

  /**
   * Checks if the navigation menu is expanded
   * @returns Promise that resolves with true if the menu is expanded, false otherwise
   */
  public async isMenuExpanded(): Promise<boolean> {
    return (await this.rootLocator.getAttribute('aria-expanded')) === 'true';
  }

  /**
   * Searches for a menu item
   * @param searchText Text to search for
   * @returns Promise that resolves when the search is complete
   */
  public async searchMenu(searchText: string): Promise<void> {
    // Check if the search input exists
    const searchInputLocator = this.getChildLocator('input.menu-search');

    if (await searchInputLocator.count() === 0) {
      throw new Error('Search input not found in navigation menu');
    }

    // Clear the search input
    await searchInputLocator.fill('');

    // Type the search text
    await searchInputLocator.fill(searchText);

    // Wait for the search results to update
    await this.page.waitForTimeout(500);
  }
}

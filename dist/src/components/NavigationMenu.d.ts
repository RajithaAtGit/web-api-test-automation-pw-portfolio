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
export declare class NavigationMenu extends BaseComponent {
    private readonly menuItemSelector;
    private readonly activeMenuItemSelector;
    private readonly submenuSelector;
    private readonly submenuItemSelector;
    private readonly expandButtonSelector;
    private readonly collapseButtonSelector;
    private readonly menuToggleSelector;
    private readonly userProfileSelector;
    private readonly notificationBadgeSelector;
    /**
     * Creates a new NavigationMenu instance
     * @param page Playwright page
     * @param selector Selector for the root element of the component
     */
    constructor(page: Page, selector: string);
    /**
     * Navigates to a menu item by text
     * @param text Text of the menu item to navigate to
     * @returns Promise that resolves when navigation is complete
     */
    navigateToMenuItem(text: string): Promise<void>;
    /**
     * Navigates to a submenu item
     * @param menuText Text of the parent menu item
     * @param submenuText Text of the submenu item to navigate to
     * @returns Promise that resolves when navigation is complete
     */
    navigateToSubmenuItem(menuText: string, submenuText: string): Promise<void>;
    /**
     * Gets the currently active menu item
     * @returns Promise that resolves with the text of the active menu item or null if none is active
     */
    getActiveMenuItem(): Promise<string | null>;
    /**
     * Checks if a menu item is active
     * @param text Text of the menu item to check
     * @returns Promise that resolves with true if the menu item is active, false otherwise
     */
    isMenuItemActive(text: string): Promise<boolean>;
    /**
     * Expands the navigation menu
     * @returns Promise that resolves when the menu is expanded
     */
    expandMenu(): Promise<void>;
    /**
     * Collapses the navigation menu
     * @returns Promise that resolves when the menu is collapsed
     */
    collapseMenu(): Promise<void>;
    /**
     * Toggles the navigation menu (expands if collapsed, collapses if expanded)
     * @returns Promise that resolves when the toggle is complete
     */
    toggleMenu(): Promise<void>;
    /**
     * Gets all menu items
     * @returns Promise that resolves with an array of menu item texts
     */
    getMenuItems(): Promise<string[]>;
    /**
     * Gets submenu items for a menu item
     * @param menuText Text of the parent menu item
     * @returns Promise that resolves with an array of submenu item texts
     */
    getSubmenuItems(menuText: string): Promise<string[]>;
    /**
     * Clicks on the user profile menu
     * @returns Promise that resolves when the user profile menu is clicked
     */
    clickUserProfile(): Promise<void>;
    /**
     * Gets the notification count
     * @returns Promise that resolves with the notification count or 0 if no badge is present
     */
    getNotificationCount(): Promise<number>;
    /**
     * Logs out by clicking the user profile and then the logout option
     * @returns Promise that resolves when logout is complete
     */
    logout(): Promise<void>;
    /**
     * Checks if the navigation menu is expanded
     * @returns Promise that resolves with true if the menu is expanded, false otherwise
     */
    isMenuExpanded(): Promise<boolean>;
    /**
     * Searches for a menu item
     * @param searchText Text to search for
     * @returns Promise that resolves when the search is complete
     */
    searchMenu(searchText: string): Promise<void>;
}

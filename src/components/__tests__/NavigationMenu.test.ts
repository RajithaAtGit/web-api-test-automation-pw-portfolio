import { Locator, Page } from '@playwright/test';
import { NavigationMenu } from '../NavigationMenu';

// Mock Playwright Locator object
const createMockLocator = (): jest.Mocked<Locator> => {
  return {
    waitFor: jest.fn().mockResolvedValue(undefined),
    click: jest.fn().mockResolvedValue(undefined),
    hover: jest.fn().mockResolvedValue(undefined),
    textContent: jest.fn().mockResolvedValue('Test Text'),
    getAttribute: jest.fn().mockResolvedValue('test-attribute'),
    fill: jest.fn().mockResolvedValue(undefined),
    selectOption: jest.fn().mockResolvedValue(undefined),
    evaluate: jest.fn().mockImplementation((fn, ...args) => Promise.resolve(fn(...args))),
    count: jest.fn().mockResolvedValue(2),
    nth: jest.fn().mockImplementation((index) => createMockLocator()),
    locator: jest.fn().mockImplementation((selector) => createMockLocator()),
    scrollIntoViewIfNeeded: jest.fn().mockResolvedValue(undefined),
    toString: jest.fn().mockReturnValue('.navigation-menu'),
  } as unknown as jest.Mocked<Locator>;
};

// Mock Playwright Page object
const createMockPage = (): jest.Mocked<Page> => {
  return {
    locator: jest.fn().mockImplementation((selector) => createMockLocator()),
    waitForTimeout: jest.fn().mockResolvedValue(undefined),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    waitForLoadState: jest.fn().mockResolvedValue(undefined),
    waitForURL: jest.fn().mockResolvedValue(undefined),
    click: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<Page>;
};

describe('NavigationMenu', () => {
  let mockPage: jest.Mocked<Page>;
  let mockRootLocator: jest.Mocked<Locator>;
  let navigationMenu: NavigationMenu;

  beforeEach(() => {
    mockPage = createMockPage();
    mockRootLocator = createMockLocator();
    mockPage.locator.mockReturnValue(mockRootLocator);
    navigationMenu = new NavigationMenu(mockPage, '.navigation-menu');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('navigateToMenuItem', () => {
    it('should navigate to a menu item without submenu', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      const submenuLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuLocator);
      submenuLocator.count.mockResolvedValue(0);

      // Execute
      await navigationMenu.navigateToMenuItem('Dashboard');

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item:has-text("Dashboard")');
      expect(menuItemLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
    });

    it('should expand submenu if menu item has submenu', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      const submenuLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuLocator);
      submenuLocator.count.mockResolvedValue(1);

      menuItemLocator.getAttribute.mockResolvedValue('false');

      // Execute
      await navigationMenu.navigateToMenuItem('Settings');

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item:has-text("Settings")');
      expect(menuItemLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.menu-item:has-text("Settings") .submenu', { state: 'visible' });
    });

    it('should throw error if menu item not found', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(0);

      // Execute & Verify
      await expect(navigationMenu.navigateToMenuItem('NonExistentMenu'))
        .rejects.toThrow('Menu item with text "NonExistentMenu" not found');
    });
  });

  describe('navigateToSubmenuItem', () => {
    it('should navigate to a submenu item', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      menuItemLocator.getAttribute.mockResolvedValue('false');

      const submenuItemLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuItemLocator);
      submenuItemLocator.count.mockResolvedValue(1);

      // Execute
      await navigationMenu.navigateToSubmenuItem('Settings', 'Profile');

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item:has-text("Settings")');
      expect(menuItemLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.menu-item:has-text("Settings") .submenu', { state: 'visible' });
      expect(menuItemLocator.locator).toHaveBeenCalledWith('.submenu .submenu-item:has-text("Profile")');
      expect(submenuItemLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForLoadState).toHaveBeenCalledWith('networkidle');
    });

    it('should throw error if menu item not found', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(0);

      // Execute & Verify
      await expect(navigationMenu.navigateToSubmenuItem('NonExistentMenu', 'SubItem'))
        .rejects.toThrow('Menu item with text "NonExistentMenu" not found');
    });

    it('should throw error if submenu item not found', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      menuItemLocator.getAttribute.mockResolvedValue('true');

      const submenuLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuLocator);

      const submenuItemLocator = createMockLocator();
      submenuLocator.locator.mockReturnValue(submenuItemLocator);
      submenuItemLocator.count.mockResolvedValue(0);

      // Execute & Verify
      await expect(navigationMenu.navigateToSubmenuItem('Settings', 'NonExistentSubItem'))
        .rejects.toThrow('Submenu item with text "NonExistentSubItem" not found under menu "Settings"');
    });
  });

  describe('getActiveMenuItem', () => {
    it('should return the active menu item text', async () => {
      // Setup
      const activeMenuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(activeMenuItemLocator);
      activeMenuItemLocator.count.mockResolvedValue(1);
      activeMenuItemLocator.textContent.mockResolvedValue('Dashboard');

      // Execute
      const result = await navigationMenu.getActiveMenuItem();

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item.active');
      expect(result).toBe('Dashboard');
    });

    it('should return null if no menu item is active', async () => {
      // Setup
      const activeMenuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(activeMenuItemLocator);
      activeMenuItemLocator.count.mockResolvedValue(0);

      // Execute
      const result = await navigationMenu.getActiveMenuItem();

      // Verify
      expect(result).toBeNull();
    });
  });

  describe('isMenuItemActive', () => {
    it('should return true if the menu item is active', async () => {
      // Setup
      const activeMenuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(activeMenuItemLocator);
      activeMenuItemLocator.count.mockResolvedValue(1);
      activeMenuItemLocator.textContent.mockResolvedValue('Dashboard');

      // Execute
      const result = await navigationMenu.isMenuItemActive('Dashboard');

      // Verify
      expect(result).toBe(true);
    });

    it('should return false if the menu item is not active', async () => {
      // Setup
      const activeMenuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(activeMenuItemLocator);
      activeMenuItemLocator.count.mockResolvedValue(1);
      activeMenuItemLocator.textContent.mockResolvedValue('Dashboard');

      // Execute
      const result = await navigationMenu.isMenuItemActive('Settings');

      // Verify
      expect(result).toBe(false);
    });
  });

  describe('expandMenu', () => {
    it('should expand the menu if it is collapsed', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('false');

      const expandButtonLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(expandButtonLocator);

      // Execute
      await navigationMenu.expandMenu();

      // Verify
      expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('aria-expanded');
      expect(expandButtonLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.navigation-menu[aria-expanded="true"]', { state: 'visible' });
    });

    it('should not expand the menu if it is already expanded', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('true');

      // Execute
      await navigationMenu.expandMenu();

      // Verify
      expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('aria-expanded');
      expect(mockRootLocator.locator).not.toHaveBeenCalledWith('.expand-button');
    });
  });

  describe('collapseMenu', () => {
    it('should collapse the menu if it is expanded', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('true');

      const collapseButtonLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(collapseButtonLocator);

      // Execute
      await navigationMenu.collapseMenu();

      // Verify
      expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('aria-expanded');
      expect(collapseButtonLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.navigation-menu[aria-expanded="false"]', { state: 'visible' });
    });

    it('should not collapse the menu if it is already collapsed', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('false');

      // Execute
      await navigationMenu.collapseMenu();

      // Verify
      expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('aria-expanded');
      expect(mockRootLocator.locator).not.toHaveBeenCalledWith('.collapse-button');
    });
  });

  describe('toggleMenu', () => {
    it('should toggle the menu', async () => {
      // Setup
      const menuToggleLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuToggleLocator);

      // Execute
      await navigationMenu.toggleMenu();

      // Verify
      expect(menuToggleLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForTimeout).toHaveBeenCalledWith(500);
    });
  });

  describe('getMenuItems', () => {
    it('should return all menu items', async () => {
      // Setup
      const menuItemsLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemsLocator);
      menuItemsLocator.count.mockResolvedValue(3);

      const menuItem1 = createMockLocator();
      const menuItem2 = createMockLocator();
      const menuItem3 = createMockLocator();

      menuItemsLocator.nth.mockImplementation((index) => {
        if (index === 0) return menuItem1;
        if (index === 1) return menuItem2;
        return menuItem3;
      });

      menuItem1.textContent.mockResolvedValue('Dashboard');
      menuItem2.textContent.mockResolvedValue('Settings');
      menuItem3.textContent.mockResolvedValue('Reports');

      // Execute
      const result = await navigationMenu.getMenuItems();

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item');
      expect(menuItemsLocator.count).toHaveBeenCalled();
      expect(menuItemsLocator.nth).toHaveBeenCalledTimes(3);
      expect(result).toEqual(['Dashboard', 'Settings', 'Reports']);
    });
  });

  describe('getSubmenuItems', () => {
    it('should return submenu items for a menu item', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      menuItemLocator.getAttribute.mockResolvedValue('true');

      const submenuLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuLocator);
      submenuLocator.count.mockResolvedValue(1);

      const submenuItemsLocator = createMockLocator();
      submenuLocator.locator.mockReturnValue(submenuItemsLocator);
      submenuItemsLocator.count.mockResolvedValue(2);

      const submenuItem1 = createMockLocator();
      const submenuItem2 = createMockLocator();

      submenuItemsLocator.nth.mockImplementation((index) => {
        if (index === 0) return submenuItem1;
        return submenuItem2;
      });

      submenuItem1.textContent.mockResolvedValue('Profile');
      submenuItem2.textContent.mockResolvedValue('Preferences');

      // Execute
      const result = await navigationMenu.getSubmenuItems('Settings');

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.menu-item:has-text("Settings")');
      expect(menuItemLocator.locator).toHaveBeenCalledWith('.submenu');
      expect(submenuLocator.locator).toHaveBeenCalledWith('.submenu-item');
      expect(result).toEqual(['Profile', 'Preferences']);
    });

    it('should throw error if menu item not found', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(0);

      // Execute & Verify
      await expect(navigationMenu.getSubmenuItems('NonExistentMenu'))
        .rejects.toThrow('Menu item with text "NonExistentMenu" not found');
    });

    it('should return empty array if menu item has no submenu', async () => {
      // Setup
      const menuItemLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(menuItemLocator);
      menuItemLocator.count.mockResolvedValue(1);

      const submenuLocator = createMockLocator();
      menuItemLocator.locator.mockReturnValue(submenuLocator);
      submenuLocator.count.mockResolvedValue(0);

      // Execute
      const result = await navigationMenu.getSubmenuItems('Dashboard');

      // Verify
      expect(result).toEqual([]);
    });
  });

  describe('clickUserProfile', () => {
    it('should click the user profile and wait for menu to appear', async () => {
      // Setup
      const userProfileLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(userProfileLocator);

      // Execute
      await navigationMenu.clickUserProfile();

      // Verify
      expect(userProfileLocator.click).toHaveBeenCalled();
      expect(mockPage.waitForSelector).toHaveBeenCalledWith('.user-profile-menu', { state: 'visible' });
    });
  });

  describe('getNotificationCount', () => {
    it('should return the notification count', async () => {
      // Setup
      const badgeLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(badgeLocator);
      badgeLocator.count.mockResolvedValue(1);
      badgeLocator.textContent.mockResolvedValue('5');

      // Execute
      const result = await navigationMenu.getNotificationCount();

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('.notification-badge');
      expect(result).toBe(5);
    });

    it('should return 0 if no badge is present', async () => {
      // Setup
      const badgeLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(badgeLocator);
      badgeLocator.count.mockResolvedValue(0);

      // Execute
      const result = await navigationMenu.getNotificationCount();

      // Verify
      expect(result).toBe(0);
    });
  });

  describe('logout', () => {
    it('should click user profile and then logout option', async () => {
      // Setup
      const userProfileLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(userProfileLocator);

      // Execute
      await navigationMenu.logout();

      // Verify
      expect(userProfileLocator.click).toHaveBeenCalled();
      expect(mockPage.click).toHaveBeenCalledWith('.user-profile-menu .logout-option');
      expect(mockPage.waitForURL).toHaveBeenCalledWith('**/login');
    });
  });

  describe('isMenuExpanded', () => {
    it('should return true if menu is expanded', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('true');

      // Execute
      const result = await navigationMenu.isMenuExpanded();

      // Verify
      expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('aria-expanded');
      expect(result).toBe(true);
    });

    it('should return false if menu is not expanded', async () => {
      // Setup
      mockRootLocator.getAttribute.mockResolvedValue('false');

      // Execute
      const result = await navigationMenu.isMenuExpanded();

      // Verify
      expect(result).toBe(false);
    });
  });

  describe('searchMenu', () => {
    it('should fill the search input with search text', async () => {
      // Setup
      const searchInputLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(searchInputLocator);
      searchInputLocator.count.mockResolvedValue(1);

      // Execute
      await navigationMenu.searchMenu('dashboard');

      // Verify
      expect(mockRootLocator.locator).toHaveBeenCalledWith('input.menu-search');
      expect(searchInputLocator.fill).toHaveBeenCalledWith('');
      expect(searchInputLocator.fill).toHaveBeenCalledWith('dashboard');
      expect(mockPage.waitForTimeout).toHaveBeenCalledWith(500);
    });

    it('should throw error if search input not found', async () => {
      // Setup
      const searchInputLocator = createMockLocator();
      mockRootLocator.locator.mockReturnValue(searchInputLocator);
      searchInputLocator.count.mockResolvedValue(0);

      // Execute & Verify
      await expect(navigationMenu.searchMenu('dashboard'))
        .rejects.toThrow('Search input not found in navigation menu');
    });
  });
});

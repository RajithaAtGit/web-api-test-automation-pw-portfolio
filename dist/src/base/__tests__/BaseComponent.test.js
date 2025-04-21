"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("../BaseComponent");
// Create a concrete implementation of BaseComponent for testing
class TestComponent extends BaseComponent_1.BaseComponent {
    // Expose protected methods for testing
    getChildLocatorTest(selector) {
        return this.getChildLocator(selector);
    }
    async clickChildTest(selector, options) {
        return this.clickChild(selector, options);
    }
    async getChildTextTest(selector) {
        return this.getChildText(selector);
    }
    async fillChildTest(selector, value, options) {
        return this.fillChild(selector, value, options);
    }
    async isChildVisibleTest(selector, options) {
        return this.isChildVisible(selector, options);
    }
}
// Mock Playwright Locator object
const createMockLocator = () => {
    return {
        waitFor: jest.fn().mockResolvedValue(undefined),
        click: jest.fn().mockResolvedValue(undefined),
        hover: jest.fn().mockResolvedValue(undefined),
        textContent: jest.fn().mockResolvedValue('Test Text'),
        getAttribute: jest.fn().mockResolvedValue('test-attribute'),
        fill: jest.fn().mockResolvedValue(undefined),
        selectOption: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockImplementation((fn, ...args) => {
            // Create a mock element with style property
            const mockElement = {
                style: {
                    outline: '',
                    backgroundColor: ''
                }
            };
            return Promise.resolve(fn(mockElement, ...args));
        }),
        count: jest.fn().mockResolvedValue(2),
        nth: jest.fn().mockImplementation((index) => createMockLocator()),
        locator: jest.fn().mockImplementation((selector) => createMockLocator()),
        scrollIntoViewIfNeeded: jest.fn().mockResolvedValue(undefined),
    };
};
// Mock Playwright Page object
const createMockPage = () => {
    return {
        locator: jest.fn().mockImplementation((selector) => createMockLocator()),
        waitForTimeout: jest.fn().mockResolvedValue(undefined),
    };
};
describe('BaseComponent', () => {
    let mockPage;
    let mockRootLocator;
    let testComponent;
    beforeEach(() => {
        mockPage = createMockPage();
        mockRootLocator = createMockLocator();
        mockPage.locator.mockReturnValue(mockRootLocator);
        testComponent = new TestComponent(mockPage, '.test-component');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with the provided page object and selector', () => {
            expect(testComponent['page']).toBe(mockPage);
            expect(mockPage.locator).toHaveBeenCalledWith('.test-component');
            expect(testComponent['rootLocator']).toBe(mockRootLocator);
        });
    });
    describe('isVisible', () => {
        it('should return true if the component is visible', async () => {
            mockRootLocator.waitFor.mockResolvedValue(undefined);
            const result = await testComponent.isVisible();
            expect(result).toBe(true);
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: 1000 });
        });
        it('should return false if the component is not visible', async () => {
            mockRootLocator.waitFor.mockRejectedValue(new Error('Element not visible'));
            const result = await testComponent.isVisible();
            expect(result).toBe(false);
        });
        it('should use the provided timeout', async () => {
            await testComponent.isVisible({ timeout: 5000 });
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: 5000 });
        });
    });
    describe('waitForVisible', () => {
        it('should wait for the component to be visible', async () => {
            await testComponent.waitForVisible();
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: undefined });
        });
        it('should use the provided timeout', async () => {
            await testComponent.waitForVisible({ timeout: 5000 });
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: 5000 });
        });
    });
    describe('click', () => {
        it('should click on the component', async () => {
            await testComponent.click();
            expect(mockRootLocator.click).toHaveBeenCalledWith(undefined);
        });
        it('should pass click options', async () => {
            const options = { timeout: 5000, force: true };
            await testComponent.click(options);
            expect(mockRootLocator.click).toHaveBeenCalledWith(options);
        });
    });
    describe('hover', () => {
        it('should hover over the component', async () => {
            await testComponent.hover();
            expect(mockRootLocator.hover).toHaveBeenCalledWith(undefined);
        });
        it('should pass hover options', async () => {
            const options = { timeout: 5000 };
            await testComponent.hover(options);
            expect(mockRootLocator.hover).toHaveBeenCalledWith(options);
        });
    });
    describe('getText', () => {
        it('should return the text content of the component', async () => {
            mockRootLocator.textContent.mockResolvedValue('Test Text');
            const text = await testComponent.getText();
            expect(text).toBe('Test Text');
        });
        it('should return empty string if textContent returns null', async () => {
            mockRootLocator.textContent.mockResolvedValue(null);
            const text = await testComponent.getText();
            expect(text).toBe('');
        });
    });
    describe('getAttribute', () => {
        it('should return the attribute value', async () => {
            mockRootLocator.getAttribute.mockResolvedValue('test-value');
            const value = await testComponent.getAttribute('data-test');
            expect(value).toBe('test-value');
            expect(mockRootLocator.getAttribute).toHaveBeenCalledWith('data-test');
        });
        it('should return null if the attribute does not exist', async () => {
            mockRootLocator.getAttribute.mockResolvedValue(null);
            const value = await testComponent.getAttribute('data-test');
            expect(value).toBeNull();
        });
    });
    describe('fill', () => {
        it('should fill the component with text', async () => {
            await testComponent.fill('test value');
            expect(mockRootLocator.fill).toHaveBeenCalledWith('test value', undefined);
        });
        it('should pass fill options', async () => {
            const options = { timeout: 5000 };
            await testComponent.fill('test value', options);
            expect(mockRootLocator.fill).toHaveBeenCalledWith('test value', options);
        });
    });
    describe('select', () => {
        it('should select an option', async () => {
            await testComponent.select('option value');
            expect(mockRootLocator.selectOption).toHaveBeenCalledWith('option value', undefined);
        });
        it('should pass select options', async () => {
            const options = { timeout: 5000 };
            await testComponent.select('option value', options);
            expect(mockRootLocator.selectOption).toHaveBeenCalledWith('option value', options);
        });
    });
    describe('containsText', () => {
        it('should return true if the component contains the specified text', async () => {
            mockRootLocator.textContent.mockResolvedValue('Test Content');
            const result = await testComponent.containsText('Test');
            expect(result).toBe(true);
        });
        it('should return false if the component does not contain the specified text', async () => {
            mockRootLocator.textContent.mockResolvedValue('Test Content');
            const result = await testComponent.containsText('Not Found');
            expect(result).toBe(false);
        });
        it('should handle case-insensitive search', async () => {
            mockRootLocator.textContent.mockResolvedValue('Test Content');
            const result = await testComponent.containsText('test content', { ignoreCase: true });
            expect(result).toBe(true);
        });
        it('should return false if an error occurs', async () => {
            mockRootLocator.textContent.mockRejectedValue(new Error('Test error'));
            const result = await testComponent.containsText('Test');
            expect(result).toBe(false);
        });
    });
    describe('highlight', () => {
        it('should highlight the component', async () => {
            await testComponent.highlight();
            expect(mockRootLocator.evaluate).toHaveBeenCalled();
            expect(mockPage.waitForTimeout).toHaveBeenCalledWith(1000);
        });
        it('should use the provided duration', async () => {
            await testComponent.highlight(2000);
            expect(mockRootLocator.evaluate).toHaveBeenCalled();
            expect(mockPage.waitForTimeout).toHaveBeenCalledWith(2000);
        });
    });
    describe('getChildren', () => {
        it('should return an array of child components', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.count.mockResolvedValue(2);
            const children = await testComponent.getChildren('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(childLocator.count).toHaveBeenCalled();
            expect(childLocator.nth).toHaveBeenCalledTimes(2);
            expect(children.length).toBe(2);
            expect(children[0]).toBeInstanceOf(Object); // LocatorComponent is a private class
            expect(children[0].isVisible).toBeInstanceOf(Function);
        });
        it('should return an empty array if no children are found', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.count.mockResolvedValue(0);
            const children = await testComponent.getChildren('.child');
            expect(children.length).toBe(0);
        });
    });
    describe('findChild', () => {
        it('should return a child component if found', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.count.mockResolvedValue(1);
            const child = await testComponent.findChild('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(childLocator.count).toHaveBeenCalled();
            expect(child).not.toBeNull();
            expect(child?.isVisible).toBeInstanceOf(Function);
        });
        it('should return null if no child is found', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.count.mockResolvedValue(0);
            const child = await testComponent.findChild('.child');
            expect(child).toBeNull();
        });
    });
    describe('exists', () => {
        it('should return true if the component exists', async () => {
            mockRootLocator.waitFor.mockResolvedValue(undefined);
            const result = await testComponent.exists();
            expect(result).toBe(true);
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'attached', timeout: 1000 });
        });
        it('should return false if the component does not exist', async () => {
            mockRootLocator.waitFor.mockRejectedValue(new Error('Element not found'));
            const result = await testComponent.exists();
            expect(result).toBe(false);
        });
        it('should use the provided timeout', async () => {
            await testComponent.exists({ timeout: 5000 });
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'attached', timeout: 5000 });
        });
    });
    describe('waitForExists', () => {
        it('should wait for the component to exist', async () => {
            await testComponent.waitForExists();
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'attached', timeout: undefined });
        });
        it('should use the provided timeout', async () => {
            await testComponent.waitForExists({ timeout: 5000 });
            expect(mockRootLocator.waitFor).toHaveBeenCalledWith({ state: 'attached', timeout: 5000 });
        });
    });
    describe('scrollIntoView', () => {
        it('should scroll the component into view', async () => {
            await testComponent.scrollIntoView();
            expect(mockRootLocator.scrollIntoViewIfNeeded).toHaveBeenCalled();
        });
    });
    describe('protected methods', () => {
        it('should get a child locator', () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            const result = testComponent.getChildLocatorTest('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(result).toBe(childLocator);
        });
        it('should click a child element', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            await testComponent.clickChildTest('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(childLocator.click).toHaveBeenCalled();
        });
        it('should get child text', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.textContent.mockResolvedValue('Child Text');
            const text = await testComponent.getChildTextTest('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(childLocator.textContent).toHaveBeenCalled();
            expect(text).toBe('Child Text');
        });
        it('should check if a child is visible', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.waitFor.mockResolvedValue(undefined);
            const result = await testComponent.isChildVisibleTest('.child');
            expect(mockRootLocator.locator).toHaveBeenCalledWith('.child');
            expect(childLocator.waitFor).toHaveBeenCalledWith({ state: 'visible', timeout: 1000 });
            expect(result).toBe(true);
        });
        it('should return false if a child is not visible', async () => {
            const childLocator = createMockLocator();
            mockRootLocator.locator.mockReturnValue(childLocator);
            childLocator.waitFor.mockRejectedValue(new Error('Element not visible'));
            const result = await testComponent.isChildVisibleTest('.child');
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=BaseComponent.test.js.map
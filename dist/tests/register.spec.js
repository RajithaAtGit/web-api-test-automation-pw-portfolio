"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestFixtures_1 = require("@/utils/TestFixtures");
const TestDataBuilder_1 = require("@/utils/TestDataBuilder");
TestFixtures_1.test.describe('User Registration', () => {
    (0, TestFixtures_1.test)('should register a new user successfully', async ({ registerPage, page, browser }) => {
        // Create custom user data using TestDataBuilder
        const userData = TestDataBuilder_1.TestDataBuilder.createDefaultUser();
        // Get browser name to make username unique
        const browserName = browser.browserType().name();
        // Modify username to make it unique with browser name and random text (no numbers)
        // Generate a username with only text characters
        const prefixes = ['user', 'test', 'account', 'login', 'member', 'profile'];
        const suffixes = ['alpha', 'beta', 'delta', 'gamma', 'omega', 'sigma', 'theta', 'zeta'];
        // Generate 5 random letters
        let randomLetters = '';
        for (let i = 0; i < 5; i++) {
            randomLetters += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        userData.username = `${prefix}_${browserName}_${randomLetters}_${suffix}`;
        console.log(`Registering user with username: ${userData.username}`);
        // Use TestHelper to register a user with custom data
        await TestFixtures_1.TestHelper.registerUser(registerPage, userData);
        // Verify that registration was successful
        const isSuccessful = await registerPage.isRegistrationSuccessful();
        (0, TestFixtures_1.expect)(isSuccessful).toBeTruthy();
        // Additional verification: Check for success message
        const successMessage = await page.textContent('div[id="rightPanel"] p');
        (0, TestFixtures_1.expect)(successMessage).toContain('Your account was created successfully');
    });
});
//# sourceMappingURL=register.spec.js.map
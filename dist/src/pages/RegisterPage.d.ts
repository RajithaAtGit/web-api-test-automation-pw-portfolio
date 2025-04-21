/**
 * @file RegisterPage.ts
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
import { BasePage } from '@/base/BasePage';
/**
 * RegisterPage
 *
 * Page object for the registration page.
 * Implements the Facade pattern for registration operations.
 */
export declare class RegisterPage extends BasePage {
    /**
     * The URL path for this page
     */
    protected readonly path: string;
    private readonly firstNameSelector;
    private readonly lastNameSelector;
    private readonly addressSelector;
    private readonly citySelector;
    private readonly stateSelector;
    private readonly zipCodeSelector;
    private readonly phoneSelector;
    private readonly ssnSelector;
    private readonly usernameSelector;
    private readonly passwordSelector;
    private readonly confirmPasswordSelector;
    private readonly registerButtonSelector;
    private readonly registerFormSelector;
    private readonly successMessageSelector;
    private readonly errorMessageSelector;
    /**
     * Creates a new RegisterPage instance
     * @param page Playwright page
     */
    constructor(page: Page);
    /**
     * Navigates to the registration page
     * @returns Promise that resolves when navigation is complete
     */
    navigateToRegisterPage(): Promise<void>;
    /**
     * Clicks the Register link on the home page
     * @returns Promise that resolves when the link is clicked
     */
    clickRegisterLink(): Promise<void>;
    /**
     * Fills the registration form with the given information
     * @param firstName First name
     * @param lastName Last name
     * @param address Address
     * @param city City
     * @param state State
     * @param zipCode Zip code
     * @param phone Phone number
     * @param ssn Social Security Number
     * @param username Username
     * @param password Password
     * @param confirmPassword Confirm password
     * @returns Promise that resolves when the form is filled
     */
    fillRegistrationForm(firstName: string, lastName: string, address: string, city: string, state: string, zipCode: string, phone: string, ssn: string, username: string, password: string, confirmPassword: string): Promise<void>;
    submitRegistrationForm(): Promise<void>;
    /**
     * Registers a new user with the given information
     * @param firstName First name
     * @param lastName Last name
     * @param address Address
     * @param city City
     * @param state State
     * @param zipCode Zip code
     * @param phone Phone number
     * @param ssn Social Security Number
     * @param username Username
     * @param password Password
     * @param confirmPassword Confirm password
     * @returns Promise that resolves when registration is complete
     */
    register(firstName: string, lastName: string, address: string, city: string, state: string, zipCode: string, phone: string, ssn: string, username: string, password: string, confirmPassword: string): Promise<void>;
    /**
     * Waits for successful registration
     * @param timeout Timeout in milliseconds
     * @returns Promise that resolves when registration is successful
     */
    waitForRegistrationSuccess(timeout?: number): Promise<void>;
    /**
     * Checks if registration was successful
     * @returns Promise that resolves with true if registration was successful, false otherwise
     */
    isRegistrationSuccessful(): Promise<boolean>;
    /**
     * Gets the error message displayed on the registration page
     * @returns Promise that resolves with the error message or null if no error is displayed
     */
    getErrorMessage(): Promise<string | null>;
    /**
     * Checks if an error message is displayed
     * @returns Promise that resolves with true if an error message is displayed, false otherwise
     */
    hasErrorMessage(): Promise<boolean>;
    /**
     * Template method called after the page is loaded
     * Override to perform additional actions after page load
     */
    protected onPageLoaded(): Promise<void>;
}

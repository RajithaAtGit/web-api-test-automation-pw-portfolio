/**
 * @file LoginPage.ts
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
import { BasePage } from '../base/BasePage';
/**
 * LoginPage
 *
 * Page object for the login page.
 * Implements the Facade pattern for login operations.
 */
export declare class LoginPage extends BasePage {
    /**
     * The URL path for this page
     */
    protected readonly path: string;
    private readonly usernameSelector;
    private readonly passwordSelector;
    private readonly submitButtonSelector;
    private readonly errorMessageSelector;
    private readonly rememberMeSelector;
    private readonly forgotPasswordLinkSelector;
    private readonly loginFormSelector;
    /**
     * Creates a new LoginPage instance
     * @param page Playwright page
     */
    constructor(page: Page);
    /**
     * Logs in with the given credentials
     * @param username Username
     * @param password Password
     * @param rememberMe Whether to check the "Remember Me" checkbox
     * @returns Promise that resolves when login is complete
     */
    login(username: string, password: string, rememberMe?: boolean): Promise<void>;
    /**
     * Attempts to log in with the given credentials
     * This method doesn't wait for successful login, useful for testing invalid credentials
     * @param username Username
     * @param password Password
     * @param rememberMe Whether to check the "Remember Me" checkbox
     * @returns Promise that resolves when login attempt is complete
     */
    attemptLogin(username: string, password: string, rememberMe?: boolean): Promise<void>;
    /**
     * Fills the login form with the given credentials
     * @param username Username
     * @param password Password
     * @param rememberMe Whether to check the "Remember Me" checkbox
     * @returns Promise that resolves when form is filled
     */
    fillLoginForm(username: string, password: string, rememberMe?: boolean): Promise<void>;
    /**
     * Submits the login form
     * @returns Promise that resolves when form is submitted
     */
    submitLoginForm(): Promise<void>;
    /**
     * Waits for successful login
     * @param timeout Timeout in milliseconds
     * @returns Promise that resolves when login is successful
     */
    waitForLoginSuccess(timeout?: number): Promise<void>;
    /**
     * Checks if the login was successful
     * @returns Promise that resolves with true if login was successful, false otherwise
     */
    isLoginSuccessful(): Promise<boolean>;
    /**
     * Gets the error message displayed on the login page
     * @returns Promise that resolves with the error message or null if no error is displayed
     */
    getErrorMessage(): Promise<string | null>;
    /**
     * Checks if an error message is displayed
     * @returns Promise that resolves with true if an error message is displayed, false otherwise
     */
    hasErrorMessage(): Promise<boolean>;
    /**
     * Clicks the "Forgot Password" link
     * @returns Promise that resolves when the link is clicked
     */
    clickForgotPassword(): Promise<void>;
    /**
     * Checks if the login form is displayed
     * @returns Promise that resolves with true if the login form is displayed, false otherwise
     */
    isLoginFormDisplayed(): Promise<boolean>;
    /**
     * Waits for the login form to be displayed
     * @param timeout Timeout in milliseconds
     * @returns Promise that resolves when the login form is displayed
     */
    waitForLoginForm(timeout?: number): Promise<void>;
    /**
     * Checks if the page is ready for login
     * @returns Promise that resolves with true if the page is ready for login, false otherwise
     */
    isPageReady(): Promise<boolean>;
    /**
     * Template method called after the page is loaded
     * Override to perform additional actions after page load
     */
    protected onPageLoaded(): Promise<void>;
    /**
     * Saves the authentication state after successful login
     * @param path Path to save the storage state
     * @returns Promise that resolves when the storage state is saved
     */
    saveAuthState(path?: string): Promise<void>;
    /**
     * Performs multi-factor authentication if required
     * @param code MFA code
     * @returns Promise that resolves when MFA is complete
     */
    completeMFA(code: string): Promise<void>;
}

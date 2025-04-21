/**
 * @file TestDataBuilder.ts
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
/**
 * TestDataBuilder
 *
 * Utility class for building test data.
 * Implements the Builder pattern for creating test data objects.
 */
export declare class TestDataBuilder {
    /**
     * Creates a new user registration data object with random values
     * @returns User registration data
     */
    static createRandomUser(): UserData;
    /**
     * Creates a new user registration data object with default values
     * @returns User registration data
     */
    static createDefaultUser(): UserData;
}
/**
 * User data interface
 */
export interface UserData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
    confirmPassword: string;
}
/**
 * UserBuilder
 *
 * Builder class for creating user data objects.
 */
export declare class UserBuilder {
    private userData;
    /**
     * Sets the first name
     * @param firstName First name
     * @returns This builder instance
     */
    withFirstName(firstName: string): UserBuilder;
    /**
     * Sets a random first name
     * @returns This builder instance
     */
    withRandomFirstName(): UserBuilder;
    /**
     * Sets the last name
     * @param lastName Last name
     * @returns This builder instance
     */
    withLastName(lastName: string): UserBuilder;
    /**
     * Sets a random last name
     * @returns This builder instance
     */
    withRandomLastName(): UserBuilder;
    /**
     * Sets the address
     * @param address Address
     * @returns This builder instance
     */
    withAddress(address: string): UserBuilder;
    /**
     * Sets a random address
     * @returns This builder instance
     */
    withRandomAddress(): UserBuilder;
    /**
     * Sets the city
     * @param city City
     * @returns This builder instance
     */
    withCity(city: string): UserBuilder;
    /**
     * Sets a random city
     * @returns This builder instance
     */
    withRandomCity(): UserBuilder;
    /**
     * Sets the state
     * @param state State
     * @returns This builder instance
     */
    withState(state: string): UserBuilder;
    /**
     * Sets a random state
     * @returns This builder instance
     */
    withRandomState(): UserBuilder;
    /**
     * Sets the zip code
     * @param zipCode Zip code
     * @returns This builder instance
     */
    withZipCode(zipCode: string): UserBuilder;
    /**
     * Sets a random zip code
     * @returns This builder instance
     */
    withRandomZipCode(): UserBuilder;
    /**
     * Sets the phone number
     * @param phone Phone number
     * @returns This builder instance
     */
    withPhone(phone: string): UserBuilder;
    /**
     * Sets a random phone number
     * @returns This builder instance
     */
    withRandomPhone(): UserBuilder;
    /**
     * Sets the SSN
     * @param ssn Social Security Number
     * @returns This builder instance
     */
    withSSN(ssn: string): UserBuilder;
    /**
     * Sets a random SSN
     * @returns This builder instance
     */
    withRandomSSN(): UserBuilder;
    /**
     * Sets the username
     * @param username Username
     * @returns This builder instance
     */
    withUsername(username: string): UserBuilder;
    /**
     * Sets a random username
     * @returns This builder instance
     */
    withRandomUsername(): UserBuilder;
    /**
     * Sets the password
     * @param password Password
     * @returns This builder instance
     */
    withPassword(password: string): UserBuilder;
    /**
     * Sets a random password
     * @returns This builder instance
     */
    withRandomPassword(): UserBuilder;
    /**
     * Sets the confirm password
     * @param confirmPassword Confirm password
     * @returns This builder instance
     */
    withConfirmPassword(confirmPassword: string): UserBuilder;
    /**
     * Builds the user data object
     * @returns Complete user data object
     * @throws Error if any required fields are missing
     */
    build(): UserData;
}

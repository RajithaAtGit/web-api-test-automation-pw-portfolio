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
export class TestDataBuilder {
  /**
   * Creates a new user registration data object with random values
   * @returns User registration data
   */
  public static createRandomUser() {
    return new UserBuilder()
      .withRandomFirstName()
      .withRandomLastName()
      .withRandomAddress()
      .withRandomCity()
      .withRandomState()
      .withRandomZipCode()
      .withRandomPhone()
      .withRandomSSN()
      .withRandomUsername()
      .withRandomPassword()
      .build();
  }

  /**
   * Creates a new user registration data object with default values
   * @returns User registration data
   */
  public static createDefaultUser() {
    return new UserBuilder()
      .withFirstName('John')
      .withLastName('Doe')
      .withAddress('123 Test Street')
      .withCity('Testville')
      .withState('TX')
      .withZipCode('75001')
      .withPhone('1234567890')
      .withSSN('123-45-6789')
      .withUsername('john.doe.test')
      .withPassword('Test@1234')
      .build();
  }
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
export class UserBuilder {
  private userData: Partial<UserData> = {};

  /**
   * Sets the first name
   * @param firstName First name
   * @returns This builder instance
   */
  public withFirstName(firstName: string): UserBuilder {
    this.userData.firstName = firstName;
    return this;
  }

  /**
   * Sets a random first name
   * @returns This builder instance
   */
  public withRandomFirstName(): UserBuilder {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer'];
    this.userData.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    return this;
  }

  /**
   * Sets the last name
   * @param lastName Last name
   * @returns This builder instance
   */
  public withLastName(lastName: string): UserBuilder {
    this.userData.lastName = lastName;
    return this;
  }

  /**
   * Sets a random last name
   * @returns This builder instance
   */
  public withRandomLastName(): UserBuilder {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson'];
    this.userData.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return this;
  }

  /**
   * Sets the address
   * @param address Address
   * @returns This builder instance
   */
  public withAddress(address: string): UserBuilder {
    this.userData.address = address;
    return this;
  }

  /**
   * Sets a random address
   * @returns This builder instance
   */
  public withRandomAddress(): UserBuilder {
    const streetNumbers = ['123', '456', '789', '101', '202', '303', '404', '505'];
    const streetNames = ['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Ln', 'Pine Dr', 'Elm Blvd', 'Willow Way', 'Birch Ct'];
    this.userData.address = `${streetNumbers[Math.floor(Math.random() * streetNumbers.length)]} ${streetNames[Math.floor(Math.random() * streetNames.length)]}`;
    return this;
  }

  /**
   * Sets the city
   * @param city City
   * @returns This builder instance
   */
  public withCity(city: string): UserBuilder {
    this.userData.city = city;
    return this;
  }

  /**
   * Sets a random city
   * @returns This builder instance
   */
  public withRandomCity(): UserBuilder {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    this.userData.city = cities[Math.floor(Math.random() * cities.length)];
    return this;
  }

  /**
   * Sets the state
   * @param state State
   * @returns This builder instance
   */
  public withState(state: string): UserBuilder {
    this.userData.state = state;
    return this;
  }

  /**
   * Sets a random state
   * @returns This builder instance
   */
  public withRandomState(): UserBuilder {
    const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA'];
    this.userData.state = states[Math.floor(Math.random() * states.length)];
    return this;
  }

  /**
   * Sets the zip code
   * @param zipCode Zip code
   * @returns This builder instance
   */
  public withZipCode(zipCode: string): UserBuilder {
    this.userData.zipCode = zipCode;
    return this;
  }

  /**
   * Sets a random zip code
   * @returns This builder instance
   */
  public withRandomZipCode(): UserBuilder {
    // Generate a random 5-digit zip code
    this.userData.zipCode = String(10000 + Math.floor(Math.random() * 90000));
    return this;
  }

  /**
   * Sets the phone number
   * @param phone Phone number
   * @returns This builder instance
   */
  public withPhone(phone: string): UserBuilder {
    this.userData.phone = phone;
    return this;
  }

  /**
   * Sets a random phone number
   * @returns This builder instance
   */
  public withRandomPhone(): UserBuilder {
    // Generate a random 10-digit phone number
    this.userData.phone = String(1000000000 + Math.floor(Math.random() * 9000000000));
    return this;
  }

  /**
   * Sets the SSN
   * @param ssn Social Security Number
   * @returns This builder instance
   */
  public withSSN(ssn: string): UserBuilder {
    this.userData.ssn = ssn;
    return this;
  }

  /**
   * Sets a random SSN
   * @returns This builder instance
   */
  public withRandomSSN(): UserBuilder {
    // Generate a random SSN in the format XXX-XX-XXXX
    const part1 = String(100 + Math.floor(Math.random() * 900));
    const part2 = String(10 + Math.floor(Math.random() * 90));
    const part3 = String(1000 + Math.floor(Math.random() * 9000));
    this.userData.ssn = `${part1}-${part2}-${part3}`;
    return this;
  }

  /**
   * Sets the username
   * @param username Username
   * @returns This builder instance
   */
  public withUsername(username: string): UserBuilder {
    this.userData.username = username;
    return this;
  }

  /**
   * Sets a random username
   * @returns This builder instance
   */
  public withRandomUsername(): UserBuilder {
    // Generate a random username with only text characters
    const prefixes = ['user', 'test', 'account', 'login', 'member', 'profile'];
    const suffixes = ['alpha', 'beta', 'delta', 'gamma', 'omega', 'sigma', 'theta', 'zeta'];

    // Generate 5 random letters
    let randomLetters = '';
    for (let i = 0; i < 5; i++) {
      randomLetters += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    this.userData.username = `${prefix}_${randomLetters}_${suffix}`;
    return this;
  }

  /**
   * Sets the password
   * @param password Password
   * @returns This builder instance
   */
  public withPassword(password: string): UserBuilder {
    this.userData.password = password;
    this.userData.confirmPassword = password; // Set confirm password to match password
    return this;
  }

  /**
   * Sets a random password
   * @returns This builder instance
   */
  public withRandomPassword(): UserBuilder {
    // Generate a random password that meets common requirements
    const password = `Test${Math.floor(Math.random() * 10000)}!`;
    this.userData.password = password;
    this.userData.confirmPassword = password; // Set confirm password to match password
    return this;
  }

  /**
   * Sets the confirm password
   * @param confirmPassword Confirm password
   * @returns This builder instance
   */
  public withConfirmPassword(confirmPassword: string): UserBuilder {
    this.userData.confirmPassword = confirmPassword;
    return this;
  }

  /**
   * Builds the user data object
   * @returns Complete user data object
   * @throws Error if any required fields are missing
   */
  public build(): UserData {
    // Ensure all required fields are present
    const requiredFields: (keyof UserData)[] = [
      'firstName', 'lastName', 'address', 'city', 'state', 'zipCode',
      'phone', 'ssn', 'username', 'password', 'confirmPassword'
    ];

    for (const field of requiredFields) {
      if (this.userData[field] === undefined) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return this.userData as UserData;
  }
}

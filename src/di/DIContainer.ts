/**
 * @file DIContainer.ts
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
 * DIContainer
 * 
 * Dependency Injection Container for managing service registration and resolution.
 * Implements the Inversion of Control pattern for dependency management.
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  private factories: Map<string, Factory<any>> = new Map();
  private singletons: Map<string, any> = new Map();
  private parent?: DIContainer;

  /**
   * Creates a new DIContainer instance
   * @param parent Optional parent container for hierarchical resolution
   */
  constructor(parent?: DIContainer) {
    this.parent = parent;
  }

  /**
   * Gets the singleton instance of the container
   * @returns The singleton instance
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Registers a service implementation
   * @param token Service token (usually an interface name)
   * @param implementation Service implementation
   */
  public register<T>(token: string, implementation: T): void {
    this.services.set(token, implementation);
  }

  /**
   * Registers a factory function for lazy initialization
   * @param token Service token (usually an interface name)
   * @param factory Factory function that creates the service
   * @param singleton Whether the service should be a singleton
   */
  public registerFactory<T>(token: string, factory: Factory<T>, singleton: boolean = false): void {
    this.factories.set(token, factory);
    if (!singleton) {
      // Remove any existing singleton instance
      this.singletons.delete(token);
    }
  }

  /**
   * Resolves a service by token
   * @param token Service token (usually an interface name)
   * @returns The resolved service
   * @throws Error if the service cannot be resolved
   */
  public resolve<T>(token: string): T {
    // Check for singleton instance
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    // Check for direct registration
    if (this.services.has(token)) {
      return this.services.get(token) as T;
    }

    // Check for factory registration
    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      const instance = factory(this);

      // If this is a singleton factory, cache the instance
      if (this.isSingletonFactory(token)) {
        this.singletons.set(token, instance);
      }

      return instance as T;
    }

    // Try to resolve from parent container
    if (this.parent) {
      return this.parent.resolve<T>(token);
    }

    throw new Error(`Service not registered: ${token}`);
  }

  /**
   * Checks if a factory is registered as a singleton
   * @param token Service token
   * @returns True if the factory is registered as a singleton
   */
  private isSingletonFactory(token: string): boolean {
    // This is a simplified implementation
    // In a real implementation, we would track which factories are singletons
    return false;
  }

  /**
   * Creates a new scoped container with this container as parent
   * @returns A new scoped container
   */
  public createScope(): DIContainer {
    return new DIContainer(this);
  }

  /**
   * Registers a singleton service
   * @param token Service token (usually an interface name)
   * @param implementation Service implementation
   */
  public registerSingleton<T>(token: string, implementation: T): void {
    this.singletons.set(token, implementation);
  }

  /**
   * Registers a singleton factory
   * @param token Service token (usually an interface name)
   * @param factory Factory function that creates the service
   */
  public registerSingletonFactory<T>(token: string, factory: Factory<T>): void {
    this.registerFactory(token, factory, true);
  }

  /**
   * Checks if a service is registered
   * @param token Service token
   * @returns True if the service is registered
   */
  public hasRegistration(token: string): boolean {
    return this.services.has(token) || 
           this.factories.has(token) || 
           this.singletons.has(token) ||
           (this.parent ? this.parent.hasRegistration(token) : false);
  }

  /**
   * Removes a service registration
   * @param token Service token
   */
  public unregister(token: string): void {
    this.services.delete(token);
    this.factories.delete(token);
    this.singletons.delete(token);
  }

  /**
   * Clears all registrations
   */
  public clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }

  /**
   * Resolves all services that match a predicate
   * @param predicate Predicate function that tests service tokens
   * @returns Array of resolved services
   */
  public resolveAll<T>(predicate: (token: string) => boolean): T[] {
    const results: T[] = [];

    // Check all registrations
    for (const token of this.services.keys()) {
      if (predicate(token)) {
        results.push(this.resolve<T>(token));
      }
    }

    for (const token of this.factories.keys()) {
      if (predicate(token) && !this.services.has(token)) {
        results.push(this.resolve<T>(token));
      }
    }

    for (const token of this.singletons.keys()) {
      if (predicate(token) && !this.services.has(token) && !this.factories.has(token)) {
        results.push(this.resolve<T>(token));
      }
    }

    // Check parent container
    if (this.parent) {
      const parentResults = this.parent.resolveAll<T>(predicate);
      results.push(...parentResults);
    }

    return results;
  }

  /**
   * Creates a child container with specific service overrides
   * @param overrides Service overrides for the child container
   * @returns A new child container
   */
  public createChild(overrides: Record<string, any> = {}): DIContainer {
    const child = this.createScope();

    for (const [token, implementation] of Object.entries(overrides)) {
      child.register(token, implementation);
    }

    return child;
  }
}

/**
 * Factory function type
 */
export type Factory<T> = (container: DIContainer) => T;

/**
 * Service provider interface
 */
export interface ServiceProvider {
  /**
   * Registers services with the container
   * @param container DI container
   */
  register(container: DIContainer): void;
}

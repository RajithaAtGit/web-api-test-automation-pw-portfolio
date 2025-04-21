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
export declare class DIContainer {
    private static instance;
    private services;
    private factories;
    private singletons;
    private parent?;
    /**
     * Creates a new DIContainer instance
     * @param parent Optional parent container for hierarchical resolution
     */
    constructor(parent?: DIContainer);
    /**
     * Gets the singleton instance of the container
     * @returns The singleton instance
     */
    static getInstance(): DIContainer;
    /**
     * Registers a service implementation
     * @param token Service token (usually an interface name)
     * @param implementation Service implementation
     */
    register<T>(token: string, implementation: T): void;
    /**
     * Registers a factory function for lazy initialization
     * @param token Service token (usually an interface name)
     * @param factory Factory function that creates the service
     * @param singleton Whether the service should be a singleton
     */
    registerFactory<T>(token: string, factory: Factory<T>, singleton?: boolean): void;
    /**
     * Resolves a service by token
     * @param token Service token (usually an interface name)
     * @returns The resolved service
     * @throws Error if the service cannot be resolved
     */
    resolve<T>(token: string): T;
    /**
     * Checks if a factory is registered as a singleton
     * @param token Service token
     * @returns True if the factory is registered as a singleton
     */
    private isSingletonFactory;
    /**
     * Creates a new scoped container with this container as parent
     * @returns A new scoped container
     */
    createScope(): DIContainer;
    /**
     * Registers a singleton service
     * @param token Service token (usually an interface name)
     * @param implementation Service implementation
     */
    registerSingleton<T>(token: string, implementation: T): void;
    /**
     * Registers a singleton factory
     * @param token Service token (usually an interface name)
     * @param factory Factory function that creates the service
     */
    registerSingletonFactory<T>(token: string, factory: Factory<T>): void;
    /**
     * Checks if a service is registered
     * @param token Service token
     * @returns True if the service is registered
     */
    hasRegistration(token: string): boolean;
    /**
     * Removes a service registration
     * @param token Service token
     */
    unregister(token: string): void;
    /**
     * Clears all registrations
     */
    clear(): void;
    /**
     * Resolves all services that match a predicate
     * @param predicate Predicate function that tests service tokens
     * @returns Array of resolved services
     */
    resolveAll<T>(predicate: (token: string) => boolean): T[];
    /**
     * Creates a child container with specific service overrides
     * @param overrides Service overrides for the child container
     * @returns A new child container
     */
    createChild(overrides?: Record<string, any>): DIContainer;
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

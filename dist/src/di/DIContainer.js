"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
/**
 * DIContainer
 *
 * Dependency Injection Container for managing service registration and resolution.
 * Implements the Inversion of Control pattern for dependency management.
 */
class DIContainer {
    static instance;
    services = new Map();
    factories = new Map();
    singletons = new Map();
    parent;
    /**
     * Creates a new DIContainer instance
     * @param parent Optional parent container for hierarchical resolution
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Gets the singleton instance of the container
     * @returns The singleton instance
     */
    static getInstance() {
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
    register(token, implementation) {
        this.services.set(token, implementation);
    }
    /**
     * Registers a factory function for lazy initialization
     * @param token Service token (usually an interface name)
     * @param factory Factory function that creates the service
     * @param singleton Whether the service should be a singleton
     */
    registerFactory(token, factory, singleton = false) {
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
    resolve(token) {
        // Check for singleton instance
        if (this.singletons.has(token)) {
            return this.singletons.get(token);
        }
        // Check for direct registration
        if (this.services.has(token)) {
            return this.services.get(token);
        }
        // Check for factory registration
        if (this.factories.has(token)) {
            const factory = this.factories.get(token);
            const instance = factory(this);
            // If this is a singleton factory, cache the instance
            if (this.isSingletonFactory(token)) {
                this.singletons.set(token, instance);
            }
            return instance;
        }
        // Try to resolve from parent container
        if (this.parent) {
            return this.parent.resolve(token);
        }
        throw new Error(`Service not registered: ${token}`);
    }
    /**
     * Checks if a factory is registered as a singleton
     * @param token Service token
     * @returns True if the factory is registered as a singleton
     */
    isSingletonFactory(token) {
        // This is a simplified implementation
        // In a real implementation, we would track which factories are singletons
        return false;
    }
    /**
     * Creates a new scoped container with this container as parent
     * @returns A new scoped container
     */
    createScope() {
        return new DIContainer(this);
    }
    /**
     * Registers a singleton service
     * @param token Service token (usually an interface name)
     * @param implementation Service implementation
     */
    registerSingleton(token, implementation) {
        this.singletons.set(token, implementation);
    }
    /**
     * Registers a singleton factory
     * @param token Service token (usually an interface name)
     * @param factory Factory function that creates the service
     */
    registerSingletonFactory(token, factory) {
        this.registerFactory(token, factory, true);
    }
    /**
     * Checks if a service is registered
     * @param token Service token
     * @returns True if the service is registered
     */
    hasRegistration(token) {
        return this.services.has(token) ||
            this.factories.has(token) ||
            this.singletons.has(token) ||
            (this.parent ? this.parent.hasRegistration(token) : false);
    }
    /**
     * Removes a service registration
     * @param token Service token
     */
    unregister(token) {
        this.services.delete(token);
        this.factories.delete(token);
        this.singletons.delete(token);
    }
    /**
     * Clears all registrations
     */
    clear() {
        this.services.clear();
        this.factories.clear();
        this.singletons.clear();
    }
    /**
     * Resolves all services that match a predicate
     * @param predicate Predicate function that tests service tokens
     * @returns Array of resolved services
     */
    resolveAll(predicate) {
        const results = [];
        // Check all registrations
        for (const token of this.services.keys()) {
            if (predicate(token)) {
                results.push(this.resolve(token));
            }
        }
        for (const token of this.factories.keys()) {
            if (predicate(token) && !this.services.has(token)) {
                results.push(this.resolve(token));
            }
        }
        for (const token of this.singletons.keys()) {
            if (predicate(token) && !this.services.has(token) && !this.factories.has(token)) {
                results.push(this.resolve(token));
            }
        }
        // Check parent container
        if (this.parent) {
            const parentResults = this.parent.resolveAll(predicate);
            results.push(...parentResults);
        }
        return results;
    }
    /**
     * Creates a child container with specific service overrides
     * @param overrides Service overrides for the child container
     * @returns A new child container
     */
    createChild(overrides = {}) {
        const child = this.createScope();
        for (const [token, implementation] of Object.entries(overrides)) {
            child.register(token, implementation);
        }
        return child;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=DIContainer.js.map
"use strict";
/**
 * @file RestApiClient.ts
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
exports.RestApiClient = void 0;
const test_1 = require("@playwright/test");
const ConfigManager_1 = require("@/config/ConfigManager");
/**
 * RestApiClient
 *
 * Implementation of the IApiClient interface using Playwright's APIRequestContext.
 * Implements the Adapter pattern to wrap Playwright's API functionality.
 */
class RestApiClient {
    request;
    baseUrl;
    defaultHeaders = {};
    /**
     * Creates a new RestApiClient instance
     * @param request Playwright APIRequestContext
     * @param baseUrl Base URL for all requests
     */
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl || ConfigManager_1.ConfigManager.getInstance().getApiBaseUrl();
        // Set default headers
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    /**
     * Creates a new RestApiClient instance
     * @param baseUrl Base URL for all requests
     * @returns A new RestApiClient instance
     */
    static async create(baseUrl = '') {
        const configManager = ConfigManager_1.ConfigManager.getInstance();
        const effectiveBaseUrl = baseUrl || configManager.getApiBaseUrl();
        const request = await test_1.request.newContext({
            baseURL: effectiveBaseUrl,
            ignoreHTTPSErrors: true
        });
        return new RestApiClient(request, effectiveBaseUrl);
    }
    /**
     * Sends a GET request
     * @param url URL to send the request to
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async get(url, options) {
        return this.request('GET', url, undefined, options);
    }
    /**
     * Sends a POST request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async post(url, data, options) {
        return this.request('POST', url, data, options);
    }
    /**
     * Sends a PUT request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async put(url, data, options) {
        return this.request('PUT', url, data, options);
    }
    /**
     * Sends a PATCH request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async patch(url, data, options) {
        return this.request('PATCH', url, data, options);
    }
    /**
     * Sends a DELETE request
     * @param url URL to send the request to
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async delete(url, options) {
        return this.request('DELETE', url, undefined, options);
    }
    /**
     * Sends a request with the specified method
     * @param method HTTP method
     * @param url URL to send the request to
     * @param data Optional data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async request(method, url, data, options) {
        // Prepare request options
        const requestOptions = {
            method,
            headers: { ...this.defaultHeaders, ...options?.headers },
            timeout: options?.timeout,
            ignoreHTTPSErrors: options?.ignoreHTTPSErrors
        };
        // Add data to request options if provided
        if (data !== undefined) {
            requestOptions.data = data;
        }
        // Add query parameters if provided
        if (options?.params) {
            const queryParams = new URLSearchParams();
            for (const [key, value] of Object.entries(options.params)) {
                if (value !== null && value !== undefined) {
                    queryParams.append(key, String(value));
                }
            }
            const queryString = queryParams.toString();
            if (queryString) {
                url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
            }
        }
        // Send the request
        const response = await this.request.fetch(url, requestOptions);
        // Parse the response
        let responseData;
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
            responseData = await response.json();
        }
        else if (contentType.includes('text/')) {
            responseData = await response.text();
        }
        else {
            responseData = await response.body();
        }
        // Create the API response
        return this.createApiResponse(response, responseData);
    }
    /**
     * Creates an API response object from a Playwright response
     * @param response Playwright response
     * @param data Response data
     * @returns API response object
     */
    createApiResponse(response, data) {
        return {
            data,
            status: response.status(),
            headers: response.headers(),
            statusText: response.statusText(),
            originalResponse: response,
            ok: response.ok()
        };
    }
    /**
     * Sets a default header for all requests
     * @param name Header name
     * @param value Header value
     */
    setDefaultHeader(name, value) {
        this.defaultHeaders[name] = value;
    }
    /**
     * Sets default headers for all requests
     * @param headers Headers to set
     */
    setDefaultHeaders(headers) {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }
    /**
     * Sets the base URL for all requests
     * @param baseUrl Base URL
     */
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }
    /**
     * Sets the authentication token for all requests
     * @param token Authentication token
     * @param scheme Authentication scheme (default: 'Bearer')
     */
    setAuthToken(token, scheme = 'Bearer') {
        this.setDefaultHeader('Authorization', `${scheme} ${token}`);
    }
    /**
     * Creates a new instance of the API client with the same configuration
     * @returns A new API client instance
     */
    clone() {
        const clone = new RestApiClient(this.request, this.baseUrl);
        clone.setDefaultHeaders(this.defaultHeaders);
        return clone;
    }
    /**
     * Disposes the API client and releases resources
     */
    async dispose() {
        await this.request.dispose();
    }
    /**
     * Uploads a file
     * @param url URL to upload the file to
     * @param filePath Path to the file to upload
     * @param fileFieldName Name of the file field
     * @param additionalFields Additional form fields
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async uploadFile(url, filePath, fileFieldName = 'file', additionalFields, options) {
        // Create form data
        const formData = {
            [fileFieldName]: filePath,
            ...additionalFields
        };
        // Set up request options
        const requestOptions = {
            ...options,
            headers: {
                ...options?.headers,
                // Remove content-type header to let the browser set it with the boundary
                'Content-Type': undefined
            }
        };
        // Send the request
        return this.post(url, formData, requestOptions);
    }
    /**
     * Downloads a file
     * @param url URL to download the file from
     * @param destinationPath Path to save the file to
     * @param options Optional request options
     * @returns Promise that resolves when the download is complete
     */
    async downloadFile(url, destinationPath, options) {
        const response = await this.request.fetch(url, {
            method: 'GET',
            headers: { ...this.defaultHeaders, ...options?.headers },
            timeout: options?.timeout
        });
        if (!response.ok()) {
            throw new Error(`Failed to download file: ${response.statusText()}`);
        }
        // Get the file content
        const fileContent = await response.body();
        // Write the file to disk
        const fs = require('fs');
        fs.writeFileSync(destinationPath, fileContent);
    }
    /**
     * Sends a GraphQL query
     * @param url GraphQL endpoint URL
     * @param query GraphQL query
     * @param variables GraphQL variables
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    async graphql(url, query, variables, options) {
        const data = {
            query,
            variables
        };
        return this.post(url, data, options);
    }
    /**
     * Performs a health check request
     * @param url Health check endpoint URL
     * @returns Promise that resolves with true if the health check is successful, false otherwise
     */
    async healthCheck(url = '/health') {
        try {
            const response = await this.get(url);
            return response.ok;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Retries a request until it succeeds or reaches the maximum number of attempts
     * @param method HTTP method
     * @param url URL to send the request to
     * @param data Optional data to send in the request body
     * @param options Optional request options
     * @param maxAttempts Maximum number of attempts
     * @param delay Delay between attempts in milliseconds
     * @returns Promise that resolves with the response
     */
    async retryRequest(method, url, data, options, maxAttempts = 3, delay = 1000) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await this.request(method, url, data, options);
                // If the request was successful, return the response
                if (response.ok) {
                    return response;
                }
                // If the request failed with a 5xx error, retry
                if (response.status >= 500 && response.status < 600) {
                    lastError = new Error(`Request failed with status ${response.status}: ${response.statusText}`);
                    // If this is not the last attempt, wait before retrying
                    if (attempt < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                    continue;
                }
                // For other errors, return the response
                return response;
            }
            catch (error) {
                lastError = error;
                // If this is not the last attempt, wait before retrying
                if (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        // If all attempts failed, throw the last error
        throw lastError || new Error('Request failed after maximum retry attempts');
    }
}
exports.RestApiClient = RestApiClient;
//# sourceMappingURL=RestApiClient.js.map
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
import { APIRequestContext } from '@playwright/test';
import { IApiClient, ApiRequestOptions, ApiResponse, HttpMethod } from '../interfaces/IApiClient';
/**
 * RestApiClient
 *
 * Implementation of the IApiClient interface using Playwright's APIRequestContext.
 * Implements the Adapter pattern to wrap Playwright's API functionality.
 */
export declare class RestApiClient implements IApiClient {
    private readonly request;
    private baseUrl;
    private defaultHeaders;
    /**
     * Creates a new RestApiClient instance
     * @param request Playwright APIRequestContext
     * @param baseUrl Base URL for all requests
     */
    constructor(request: APIRequestContext, baseUrl?: string);
    /**
     * Creates a new RestApiClient instance
     * @param baseUrl Base URL for all requests
     * @returns A new RestApiClient instance
     */
    static create(baseUrl?: string): Promise<RestApiClient>;
    /**
     * Sends a GET request
     * @param url URL to send the request to
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Sends a POST request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Sends a PUT request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Sends a PATCH request
     * @param url URL to send the request to
     * @param data Data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Sends a DELETE request
     * @param url URL to send the request to
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Sends a request with the specified method
     * @param method HTTP method
     * @param url URL to send the request to
     * @param data Optional data to send in the request body
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    request<T>(method: HttpMethod, url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Creates an API response object from a Playwright response
     * @param response Playwright response
     * @param data Response data
     * @returns API response object
     */
    private createApiResponse;
    /**
     * Sets a default header for all requests
     * @param name Header name
     * @param value Header value
     */
    setDefaultHeader(name: string, value: string): void;
    /**
     * Sets default headers for all requests
     * @param headers Headers to set
     */
    setDefaultHeaders(headers: Record<string, string>): void;
    /**
     * Sets the base URL for all requests
     * @param baseUrl Base URL
     */
    setBaseUrl(baseUrl: string): void;
    /**
     * Sets the authentication token for all requests
     * @param token Authentication token
     * @param scheme Authentication scheme (default: 'Bearer')
     */
    setAuthToken(token: string, scheme?: string): void;
    /**
     * Creates a new instance of the API client with the same configuration
     * @returns A new API client instance
     */
    clone(): IApiClient;
    /**
     * Disposes the API client and releases resources
     */
    dispose(): Promise<void>;
    /**
     * Uploads a file
     * @param url URL to upload the file to
     * @param filePath Path to the file to upload
     * @param fileFieldName Name of the file field
     * @param additionalFields Additional form fields
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    uploadFile<T>(url: string, filePath: string, fileFieldName?: string, additionalFields?: Record<string, string>, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Downloads a file
     * @param url URL to download the file from
     * @param destinationPath Path to save the file to
     * @param options Optional request options
     * @returns Promise that resolves when the download is complete
     */
    downloadFile(url: string, destinationPath: string, options?: ApiRequestOptions): Promise<void>;
    /**
     * Sends a GraphQL query
     * @param url GraphQL endpoint URL
     * @param query GraphQL query
     * @param variables GraphQL variables
     * @param options Optional request options
     * @returns Promise that resolves with the response
     */
    graphql<T>(url: string, query: string, variables?: Record<string, any>, options?: ApiRequestOptions): Promise<ApiResponse<T>>;
    /**
     * Performs a health check request
     * @param url Health check endpoint URL
     * @returns Promise that resolves with true if the health check is successful, false otherwise
     */
    healthCheck(url?: string): Promise<boolean>;
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
    retryRequest<T>(method: HttpMethod, url: string, data?: any, options?: ApiRequestOptions, maxAttempts?: number, delay?: number): Promise<ApiResponse<T>>;
}

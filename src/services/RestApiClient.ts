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

import { APIRequestContext, APIResponse, request as playwrightRequest } from '@playwright/test';
import { IApiClient, ApiRequestOptions, ApiResponse, HttpMethod } from '../interfaces/IApiClient';
import { ConfigManager } from '@/config/ConfigManager';

/**
 * RestApiClient
 * 
 * Implementation of the IApiClient interface using Playwright's APIRequestContext.
 * Implements the Adapter pattern to wrap Playwright's API functionality.
 */
export class RestApiClient implements IApiClient {
  private readonly request: APIRequestContext;
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};

  /**
   * Creates a new RestApiClient instance
   * @param request Playwright APIRequestContext
   * @param baseUrl Base URL for all requests
   */
  constructor(request: APIRequestContext, baseUrl: string = '') {
    this.request = request;
    this.baseUrl = baseUrl || ConfigManager.getInstance().getApiBaseUrl();

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
  public static async create(baseUrl: string = ''): Promise<RestApiClient> {
    const configManager = ConfigManager.getInstance();
    const effectiveBaseUrl = baseUrl || configManager.getApiBaseUrl();

    const request = await playwrightRequest.newContext({
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
  public async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  /**
   * Sends a POST request
   * @param url URL to send the request to
   * @param data Data to send in the request body
   * @param options Optional request options
   * @returns Promise that resolves with the response
   */
  public async post<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  /**
   * Sends a PUT request
   * @param url URL to send the request to
   * @param data Data to send in the request body
   * @param options Optional request options
   * @returns Promise that resolves with the response
   */
  public async put<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }

  /**
   * Sends a PATCH request
   * @param url URL to send the request to
   * @param data Data to send in the request body
   * @param options Optional request options
   * @returns Promise that resolves with the response
   */
  public async patch<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, options);
  }

  /**
   * Sends a DELETE request
   * @param url URL to send the request to
   * @param options Optional request options
   * @returns Promise that resolves with the response
   */
  public async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Sends a request with the specified method
   * @param method HTTP method
   * @param url URL to send the request to
   * @param data Optional data to send in the request body
   * @param options Optional request options
   * @returns Promise that resolves with the response
   */
  public async request<T>(method: HttpMethod, url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Prepare request options
    const requestOptions: any = {
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
    let responseData: T;
    const contentType = response.headers()['content-type'] || '';

    if (contentType.includes('application/json')) {
      responseData = await response.json() as T;
    } else if (contentType.includes('text/')) {
      responseData = await response.text() as unknown as T;
    } else {
      responseData = await response.body() as unknown as T;
    }

    // Create the API response
    return this.createApiResponse<T>(response, responseData);
  }

  /**
   * Creates an API response object from a Playwright response
   * @param response Playwright response
   * @param data Response data
   * @returns API response object
   */
  private createApiResponse<T>(response: APIResponse, data: T): ApiResponse<T> {
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
  public setDefaultHeader(name: string, value: string): void {
    this.defaultHeaders[name] = value;
  }

  /**
   * Sets default headers for all requests
   * @param headers Headers to set
   */
  public setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Sets the base URL for all requests
   * @param baseUrl Base URL
   */
  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Sets the authentication token for all requests
   * @param token Authentication token
   * @param scheme Authentication scheme (default: 'Bearer')
   */
  public setAuthToken(token: string, scheme: string = 'Bearer'): void {
    this.setDefaultHeader('Authorization', `${scheme} ${token}`);
  }

  /**
   * Creates a new instance of the API client with the same configuration
   * @returns A new API client instance
   */
  public clone(): IApiClient {
    const clone = new RestApiClient(this.request, this.baseUrl);
    clone.setDefaultHeaders(this.defaultHeaders);
    return clone;
  }

  /**
   * Disposes the API client and releases resources
   */
  public async dispose(): Promise<void> {
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
  public async uploadFile<T>(
    url: string,
    filePath: string,
    fileFieldName: string = 'file',
    additionalFields?: Record<string, string>,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    // Create form data
    const formData = {
      [fileFieldName]: filePath,
      ...additionalFields
    };

    // Set up request options
    const requestOptions: ApiRequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        // Remove content-type header to let the browser set it with the boundary
        'Content-Type': undefined as any
      }
    };

    // Send the request
    return this.post<T>(url, formData, requestOptions);
  }

  /**
   * Downloads a file
   * @param url URL to download the file from
   * @param destinationPath Path to save the file to
   * @param options Optional request options
   * @returns Promise that resolves when the download is complete
   */
  public async downloadFile(
    url: string,
    destinationPath: string,
    options?: ApiRequestOptions
  ): Promise<void> {
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
  public async graphql<T>(
    url: string,
    query: string,
    variables?: Record<string, any>,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const data = {
      query,
      variables
    };

    return this.post<T>(url, data, options);
  }

  /**
   * Performs a health check request
   * @param url Health check endpoint URL
   * @returns Promise that resolves with true if the health check is successful, false otherwise
   */
  public async healthCheck(url: string = '/health'): Promise<boolean> {
    try {
      const response = await this.get(url);
      return response.ok;
    } catch (error) {
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
  public async retryRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    options?: ApiRequestOptions,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.request<T>(method, url, data, options);

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
      } catch (error) {
        lastError = error as Error;

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

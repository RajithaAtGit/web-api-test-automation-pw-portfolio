/**
 * @file IApiClient.ts
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
 * IApiClient Interface
 * 
 * Defines unified request methods for all HTTP verbs and response handling.
 * Implements the Adapter pattern to wrap Playwright's API functionality.
 */
export interface IApiClient {
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
}

/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  /**
   * Request headers
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Query parameters
   */
  params?: Record<string, string | number | boolean | null | undefined>;

  /**
   * Whether to follow redirects
   */
  followRedirects?: boolean;

  /**
   * Whether to ignore SSL errors
   */
  ignoreHTTPSErrors?: boolean;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  /**
   * Response data
   */
  data: T;

  /**
   * Response status code
   */
  status: number;

  /**
   * Response headers
   */
  headers: Record<string, string>;

  /**
   * Response status text
   */
  statusText: string;

  /**
   * Original response object
   */
  originalResponse: any;

  /**
   * Whether the request was successful (status code 2xx)
   */
  ok: boolean;
}

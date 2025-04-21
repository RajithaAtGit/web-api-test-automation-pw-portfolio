"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const RestApiClient_1 = require("../RestApiClient");
const ConfigManager_1 = require("../../config/ConfigManager");
// Mock ConfigManager
jest.mock('../../config/ConfigManager', () => {
    return {
        ConfigManager: {
            getInstance: jest.fn().mockReturnValue({
                getApiBaseUrl: jest.fn().mockReturnValue('https://api.example.com')
            })
        }
    };
});
// Mock fs module for downloadFile method
jest.mock('fs', () => ({
    writeFileSync: jest.fn()
}));
// Mock Playwright request
jest.mock('@playwright/test', () => {
    const mockAPIResponse = {
        status: jest.fn().mockReturnValue(200),
        statusText: jest.fn().mockReturnValue('OK'),
        headers: jest.fn().mockReturnValue({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
        text: jest.fn().mockResolvedValue('test'),
        body: jest.fn().mockResolvedValue(Buffer.from('test')),
        ok: jest.fn().mockReturnValue(true),
        dispose: jest.fn()
    };
    const mockAPIRequestContext = {
        fetch: jest.fn().mockResolvedValue(mockAPIResponse),
        dispose: jest.fn()
    };
    return {
        request: {
            newContext: jest.fn().mockResolvedValue(mockAPIRequestContext)
        }
    };
});
// Helper to create a mock APIResponse
const createMockAPIResponse = (overrides = {}) => {
    return {
        status: jest.fn().mockReturnValue(overrides.status || 200),
        statusText: jest.fn().mockReturnValue(overrides.statusText || 'OK'),
        headers: jest.fn().mockReturnValue(overrides.headers || { 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(overrides.json || { data: 'test' }),
        text: jest.fn().mockResolvedValue(overrides.text || 'test'),
        body: jest.fn().mockResolvedValue(overrides.body || Buffer.from('test')),
        ok: jest.fn().mockReturnValue(overrides.ok !== undefined ? overrides.ok : true),
        dispose: jest.fn()
    };
};
// Helper to create a mock APIRequestContext
const createMockAPIRequestContext = () => {
    return {
        fetch: jest.fn().mockResolvedValue(createMockAPIResponse()),
        dispose: jest.fn()
    };
};
describe('RestApiClient', () => {
    let mockRequestContext;
    let apiClient;
    beforeEach(() => {
        mockRequestContext = createMockAPIRequestContext();
        apiClient = new RestApiClient_1.RestApiClient(mockRequestContext);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with the provided request context and base URL', () => {
            const baseUrl = 'https://custom.example.com';
            const client = new RestApiClient_1.RestApiClient(mockRequestContext, baseUrl);
            expect(client['request']).toBe(mockRequestContext);
            expect(client['baseUrl']).toBe(baseUrl);
        });
        it('should use the ConfigManager to get the base URL if not provided', () => {
            expect(apiClient['baseUrl']).toBe('https://api.example.com');
            expect(ConfigManager_1.ConfigManager.getInstance().getApiBaseUrl).toHaveBeenCalled();
        });
        it('should set default headers', () => {
            expect(apiClient['defaultHeaders']).toEqual({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
        });
    });
    describe('create', () => {
        it('should create a new RestApiClient instance', async () => {
            const client = await RestApiClient_1.RestApiClient.create();
            expect(client).toBeInstanceOf(RestApiClient_1.RestApiClient);
            expect(test_1.request.newContext).toHaveBeenCalledWith({
                baseURL: 'https://api.example.com',
                ignoreHTTPSErrors: true
            });
        });
        it('should use the provided base URL', async () => {
            const baseUrl = 'https://custom.example.com';
            const client = await RestApiClient_1.RestApiClient.create(baseUrl);
            expect(client['baseUrl']).toBe(baseUrl);
            expect(test_1.request.newContext).toHaveBeenCalledWith({
                baseURL: baseUrl,
                ignoreHTTPSErrors: true
            });
        });
    });
    describe('HTTP methods', () => {
        it('should send a GET request', async () => {
            const response = await apiClient.get('/users');
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
                method: 'GET',
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
            expect(response.status).toBe(200);
        });
        it('should send a POST request with data', async () => {
            const data = { name: 'Test User' };
            const response = await apiClient.post('/users', data);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
                method: 'POST',
                data,
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should send a PUT request with data', async () => {
            const data = { name: 'Updated User' };
            const response = await apiClient.put('/users/1', data);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users/1', expect.objectContaining({
                method: 'PUT',
                data,
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should send a PATCH request with data', async () => {
            const data = { name: 'Patched User' };
            const response = await apiClient.patch('/users/1', data);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users/1', expect.objectContaining({
                method: 'PATCH',
                data,
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should send a DELETE request', async () => {
            const response = await apiClient.delete('/users/1');
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users/1', expect.objectContaining({
                method: 'DELETE',
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
    });
    describe('request', () => {
        it('should send a request with the specified method', async () => {
            const response = await apiClient.request('GET', '/users');
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
                method: 'GET',
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should include data in the request if provided', async () => {
            const data = { name: 'Test User' };
            await apiClient.request('POST', '/users', data);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users', expect.objectContaining({
                method: 'POST',
                data,
                headers: expect.any(Object)
            }));
        });
        it('should add query parameters to the URL', async () => {
            const options = {
                params: {
                    page: 1,
                    limit: 10,
                    search: 'test',
                    active: true,
                    nullable: null,
                    undefinable: undefined
                }
            };
            await apiClient.request('GET', '/users', undefined, options);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users?page=1&limit=10&search=test&active=true', expect.any(Object));
        });
        it('should append query parameters to existing query string', async () => {
            const options = {
                params: {
                    limit: 10
                }
            };
            await apiClient.request('GET', '/users?page=1', undefined, options);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/users?page=1&limit=10', expect.any(Object));
        });
        it('should parse JSON response', async () => {
            const mockResponse = createMockAPIResponse({
                headers: { 'content-type': 'application/json' },
                json: { name: 'Test User' }
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            const response = await apiClient.request('GET', '/users/1');
            expect(response.data).toEqual({ name: 'Test User' });
            expect(mockResponse.json).toHaveBeenCalled();
        });
        it('should parse text response', async () => {
            const mockResponse = createMockAPIResponse({
                headers: { 'content-type': 'text/plain' },
                text: 'Plain text response'
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            const response = await apiClient.request('GET', '/text');
            expect(response.data).toBe('Plain text response');
            expect(mockResponse.text).toHaveBeenCalled();
        });
        it('should parse binary response', async () => {
            const mockResponse = createMockAPIResponse({
                headers: { 'content-type': 'application/octet-stream' },
                body: Buffer.from('Binary data')
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            const response = await apiClient.request('GET', '/binary');
            expect(response.data).toEqual(Buffer.from('Binary data'));
            expect(mockResponse.body).toHaveBeenCalled();
        });
    });
    describe('createApiResponse', () => {
        it('should create an API response object from a Playwright response', async () => {
            const mockResponse = createMockAPIResponse({
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                ok: true
            });
            const data = { name: 'Test User' };
            const apiResponse = apiClient['createApiResponse'](mockResponse, data);
            expect(apiResponse).toEqual({
                data,
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                originalResponse: mockResponse,
                ok: true
            });
        });
    });
    describe('setDefaultHeader', () => {
        it('should set a default header', () => {
            apiClient.setDefaultHeader('X-Test-Header', 'test-value');
            expect(apiClient['defaultHeaders']['X-Test-Header']).toBe('test-value');
        });
    });
    describe('setDefaultHeaders', () => {
        it('should set multiple default headers', () => {
            const headers = {
                'X-Test-Header-1': 'test-value-1',
                'X-Test-Header-2': 'test-value-2'
            };
            apiClient.setDefaultHeaders(headers);
            expect(apiClient['defaultHeaders']).toEqual(expect.objectContaining(headers));
        });
        it('should preserve existing headers', () => {
            const existingHeaders = { ...apiClient['defaultHeaders'] };
            const newHeaders = { 'X-Test-Header': 'test-value' };
            apiClient.setDefaultHeaders(newHeaders);
            expect(apiClient['defaultHeaders']).toEqual({
                ...existingHeaders,
                ...newHeaders
            });
        });
    });
    describe('setBaseUrl', () => {
        it('should set the base URL', () => {
            const baseUrl = 'https://new.example.com';
            apiClient.setBaseUrl(baseUrl);
            expect(apiClient['baseUrl']).toBe(baseUrl);
        });
    });
    describe('setAuthToken', () => {
        it('should set the Authorization header with Bearer scheme by default', () => {
            apiClient.setAuthToken('test-token');
            expect(apiClient['defaultHeaders']['Authorization']).toBe('Bearer test-token');
        });
        it('should set the Authorization header with the specified scheme', () => {
            apiClient.setAuthToken('test-token', 'Basic');
            expect(apiClient['defaultHeaders']['Authorization']).toBe('Basic test-token');
        });
    });
    describe('clone', () => {
        it('should create a new instance with the same configuration', () => {
            apiClient.setDefaultHeader('X-Test-Header', 'test-value');
            const clone = apiClient.clone();
            expect(clone).toBeInstanceOf(RestApiClient_1.RestApiClient);
            expect(clone['request']).toBe(apiClient['request']);
            expect(clone['baseUrl']).toBe(apiClient['baseUrl']);
            expect(clone['defaultHeaders']).toEqual(apiClient['defaultHeaders']);
        });
    });
    describe('dispose', () => {
        it('should dispose the request context', async () => {
            await apiClient.dispose();
            expect(mockRequestContext.dispose).toHaveBeenCalled();
        });
    });
    describe('uploadFile', () => {
        it('should upload a file', async () => {
            const filePath = '/path/to/file.txt';
            const response = await apiClient.uploadFile('/upload', filePath);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/upload', expect.objectContaining({
                method: 'POST',
                data: { file: filePath },
                headers: expect.objectContaining({
                    'Content-Type': undefined
                })
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should use the specified file field name', async () => {
            const filePath = '/path/to/file.txt';
            const fileFieldName = 'document';
            await apiClient.uploadFile('/upload', filePath, fileFieldName);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/upload', expect.objectContaining({
                data: { [fileFieldName]: filePath }
            }));
        });
        it('should include additional fields', async () => {
            const filePath = '/path/to/file.txt';
            const additionalFields = { description: 'Test file' };
            await apiClient.uploadFile('/upload', filePath, 'file', additionalFields);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/upload', expect.objectContaining({
                data: { file: filePath, ...additionalFields }
            }));
        });
    });
    describe('downloadFile', () => {
        it('should download a file', async () => {
            const fs = require('fs');
            const destinationPath = '/path/to/destination.txt';
            const mockResponse = createMockAPIResponse({
                body: Buffer.from('file content')
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            await apiClient.downloadFile('/download', destinationPath);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/download', expect.objectContaining({
                method: 'GET',
                headers: expect.any(Object)
            }));
            expect(mockResponse.body).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(destinationPath, Buffer.from('file content'));
        });
        it('should throw an error if the download fails', async () => {
            const destinationPath = '/path/to/destination.txt';
            const mockResponse = createMockAPIResponse({
                ok: false,
                statusText: 'Not Found'
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            await expect(apiClient.downloadFile('/download', destinationPath)).rejects.toThrow('Failed to download file: Not Found');
        });
    });
    describe('graphql', () => {
        it('should send a GraphQL query', async () => {
            const query = 'query { user(id: 1) { name } }';
            const variables = { id: 1 };
            const response = await apiClient.graphql('/graphql', query, variables);
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/graphql', expect.objectContaining({
                method: 'POST',
                data: { query, variables },
                headers: expect.any(Object)
            }));
            expect(response.data).toEqual({ data: 'test' });
        });
    });
    describe('healthCheck', () => {
        it('should return true if the health check is successful', async () => {
            const result = await apiClient.healthCheck();
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/health', expect.any(Object));
            expect(result).toBe(true);
        });
        it('should return false if the health check fails', async () => {
            const mockResponse = createMockAPIResponse({
                ok: false
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            const result = await apiClient.healthCheck();
            expect(result).toBe(false);
        });
        it('should return false if an error is thrown', async () => {
            mockRequestContext.fetch.mockRejectedValueOnce(new Error('Network error'));
            const result = await apiClient.healthCheck();
            expect(result).toBe(false);
        });
        it('should use the specified URL', async () => {
            await apiClient.healthCheck('/custom-health');
            expect(mockRequestContext.fetch).toHaveBeenCalledWith('/custom-health', expect.any(Object));
        });
    });
    describe('retryRequest', () => {
        it('should return the response if the request succeeds on the first attempt', async () => {
            const response = await apiClient.retryRequest('GET', '/users');
            expect(mockRequestContext.fetch).toHaveBeenCalledTimes(1);
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should retry the request if it fails with a 5xx error', async () => {
            const mockFailedResponse = createMockAPIResponse({
                status: 500,
                statusText: 'Internal Server Error',
                ok: false
            });
            const mockSuccessResponse = createMockAPIResponse({
                status: 200,
                statusText: 'OK',
                ok: true
            });
            mockRequestContext.fetch
                .mockResolvedValueOnce(mockFailedResponse)
                .mockResolvedValueOnce(mockSuccessResponse);
            const response = await apiClient.retryRequest('GET', '/users', undefined, undefined, 3, 10);
            expect(mockRequestContext.fetch).toHaveBeenCalledTimes(2);
            expect(response.data).toEqual({ data: 'test' });
        });
        it('should not retry the request if it fails with a non-5xx error', async () => {
            const mockResponse = createMockAPIResponse({
                status: 404,
                statusText: 'Not Found',
                ok: false
            });
            mockRequestContext.fetch.mockResolvedValueOnce(mockResponse);
            const response = await apiClient.retryRequest('GET', '/users');
            expect(mockRequestContext.fetch).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(404);
        });
        it('should throw an error if all retry attempts fail', async () => {
            const mockResponse = createMockAPIResponse({
                status: 500,
                statusText: 'Internal Server Error',
                ok: false
            });
            mockRequestContext.fetch.mockResolvedValue(mockResponse);
            await expect(apiClient.retryRequest('GET', '/users', undefined, undefined, 3, 10))
                .rejects.toThrow('Request failed with status 500: Internal Server Error');
            expect(mockRequestContext.fetch).toHaveBeenCalledTimes(3);
        });
        it('should throw an error if the request throws an exception', async () => {
            const error = new Error('Network error');
            mockRequestContext.fetch.mockRejectedValue(error);
            await expect(apiClient.retryRequest('GET', '/users', undefined, undefined, 3, 10))
                .rejects.toThrow('Network error');
            expect(mockRequestContext.fetch).toHaveBeenCalledTimes(3);
        });
    });
});
//# sourceMappingURL=RestApiClient.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestDataBuilder_1 = require("../TestDataBuilder");
// Mock APIRequestContext
const createMockAPIRequestContext = () => {
    return {
        post: jest.fn().mockResolvedValue({
            ok: jest.fn().mockReturnValue(true),
            json: jest.fn().mockResolvedValue({ id: 'test-id', name: 'Test Entity' }),
            statusText: jest.fn().mockReturnValue('OK'),
        }),
        delete: jest.fn().mockResolvedValue({
            ok: jest.fn().mockReturnValue(true),
        }),
    };
};
// Mock TestDataContext
const createMockTestDataContext = () => {
    return {
        testId: 'test-123',
        createdEntities: [],
    };
};
describe('TestDataBuilder', () => {
    let mockRequest;
    let mockTestData;
    let testDataBuilder;
    beforeEach(() => {
        mockRequest = createMockAPIRequestContext();
        mockTestData = createMockTestDataContext();
        testDataBuilder = new TestDataBuilder_1.TestDataBuilder(mockRequest, mockTestData);
        // Reset all mocks
        jest.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with the provided request and testData', () => {
            expect(testDataBuilder['request']).toBe(mockRequest);
            expect(testDataBuilder['testData']).toBe(mockTestData);
            expect(testDataBuilder['factories']).toBeInstanceOf(Map);
        });
    });
    describe('registerFactory', () => {
        it('should register a factory for an entity type', () => {
            const factory = jest.fn();
            testDataBuilder.registerFactory('test', factory);
            expect(testDataBuilder['factories'].get('test')).toBe(factory);
        });
    });
    describe('createEntity', () => {
        it('should create an entity using a registered factory', async () => {
            // Create a mock factory
            const mockEntity = {
                id: 'test-id',
                type: 'test',
                data: { name: 'Test Entity' },
                cleanup: jest.fn(),
            };
            const factory = jest.fn().mockResolvedValue(mockEntity);
            // Register the factory
            testDataBuilder.registerFactory('test', factory);
            // Create an entity
            const customData = { name: 'Custom Name' };
            const entity = await testDataBuilder.createEntity('test', customData);
            // Verify the factory was called with the correct arguments
            expect(factory).toHaveBeenCalledWith(mockRequest, customData, mockTestData);
            // Verify the entity was returned and registered for cleanup
            expect(entity).toBe(mockEntity);
            expect(mockTestData.createdEntities).toContain(mockEntity);
        });
        it('should throw an error if no factory is registered for the entity type', async () => {
            await expect(testDataBuilder.createEntity('nonexistent'))
                .rejects.toThrow('No factory registered for entity type: nonexistent');
        });
    });
    describe('createEntities', () => {
        it('should create multiple entities using a registered factory', async () => {
            // Create mock entities
            const mockEntities = [
                {
                    id: 'test-id-1',
                    type: 'test',
                    data: { name: 'Test Entity 1' },
                    cleanup: jest.fn(),
                },
                {
                    id: 'test-id-2',
                    type: 'test',
                    data: { name: 'Test Entity 2' },
                    cleanup: jest.fn(),
                },
            ];
            // Mock createEntity to return the mock entities
            let callIndex = 0;
            jest.spyOn(testDataBuilder, 'createEntity').mockImplementation((entityType, customData) => {
                return Promise.resolve(mockEntities[callIndex++]);
            });
            // Create entities
            const customDataFn = jest.fn().mockImplementation((index) => ({ name: `Custom Name ${index + 1}` }));
            const entities = await testDataBuilder.createEntities('test', 2, customDataFn);
            // Verify createEntity was called with the correct arguments
            expect(testDataBuilder.createEntity).toHaveBeenCalledTimes(2);
            expect(testDataBuilder.createEntity).toHaveBeenCalledWith('test', { name: 'Custom Name 1' });
            expect(testDataBuilder.createEntity).toHaveBeenCalledWith('test', { name: 'Custom Name 2' });
            // Verify the entities were returned
            expect(entities).toEqual(mockEntities);
        });
        it('should use an empty object as custom data if no customDataFn is provided', async () => {
            // Mock createEntity
            jest.spyOn(testDataBuilder, 'createEntity').mockResolvedValue({
                id: 'test-id',
                type: 'test',
                data: { name: 'Test Entity' },
                cleanup: jest.fn(),
            });
            // Create entities
            await testDataBuilder.createEntities('test', 1);
            // Verify createEntity was called with an empty object
            expect(testDataBuilder.createEntity).toHaveBeenCalledWith('test', {});
        });
    });
    describe('createUser', () => {
        it('should create a user with default data', async () => {
            // Mock the API response
            const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockUser),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a user
            const user = await testDataBuilder.createUser();
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/users', {
                data: expect.objectContaining({
                    username: expect.stringContaining(`user_${mockTestData.testId}`),
                    email: expect.stringContaining(`user_${mockTestData.testId}`),
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                }),
            });
            // Verify the user entity was created and registered for cleanup
            expect(user.id).toBe(mockUser.id);
            expect(user.type).toBe('user');
            expect(user.data).toBe(mockUser);
            expect(user.cleanup).toBeDefined();
            expect(mockTestData.createdEntities).toContain(user);
        });
        it('should create a user with custom data', async () => {
            // Mock the API response
            const mockUser = { id: 'user-123', username: 'customuser', email: 'custom@example.com' };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockUser),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a user with custom data
            const customData = {
                username: 'customuser',
                email: 'custom@example.com',
                firstName: 'Custom',
                lastName: 'User',
            };
            const user = await testDataBuilder.createUser(customData);
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/users', {
                data: expect.objectContaining({
                    username: 'customuser',
                    email: 'custom@example.com',
                    password: 'Password123!',
                    firstName: 'Custom',
                    lastName: 'User',
                }),
            });
            // Verify the user entity was created
            expect(user.id).toBe(mockUser.id);
            expect(user.data).toBe(mockUser);
        });
        it('should throw an error if the API request fails', async () => {
            // Mock the API response to fail
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(false),
                statusText: jest.fn().mockReturnValue('Bad Request'),
            });
            // Attempt to create a user
            await expect(testDataBuilder.createUser())
                .rejects.toThrow('Failed to create user: Bad Request');
        });
        it('should call the cleanup function when cleaning up the entity', async () => {
            // Mock the API response
            const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockUser),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a user
            const user = await testDataBuilder.createUser();
            // Call the cleanup function
            await user.cleanup();
            // Verify the API was called to delete the user
            expect(mockRequest.delete).toHaveBeenCalledWith(`/api/users/${mockUser.id}`);
        });
    });
    describe('createProduct', () => {
        it('should create a product with default data', async () => {
            // Mock the API response
            const mockProduct = { id: 'product-123', name: 'Test Product', price: 99.99 };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockProduct),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a product
            const product = await testDataBuilder.createProduct();
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/products', {
                data: expect.objectContaining({
                    name: expect.stringContaining(`Product ${mockTestData.testId}`),
                    description: 'Test product description',
                    price: 99.99,
                    category: 'Test Category',
                    sku: expect.stringContaining(`SKU-${mockTestData.testId}`),
                }),
            });
            // Verify the product entity was created and registered for cleanup
            expect(product.id).toBe(mockProduct.id);
            expect(product.type).toBe('product');
            expect(product.data).toBe(mockProduct);
            expect(product.cleanup).toBeDefined();
            expect(mockTestData.createdEntities).toContain(product);
        });
        it('should create a product with custom data', async () => {
            // Mock the API response
            const mockProduct = { id: 'product-123', name: 'Custom Product', price: 199.99 };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockProduct),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a product with custom data
            const customData = {
                name: 'Custom Product',
                price: 199.99,
                category: 'Custom Category',
            };
            const product = await testDataBuilder.createProduct(customData);
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/products', {
                data: expect.objectContaining({
                    name: 'Custom Product',
                    description: 'Test product description',
                    price: 199.99,
                    category: 'Custom Category',
                }),
            });
            // Verify the product entity was created
            expect(product.id).toBe(mockProduct.id);
            expect(product.data).toBe(mockProduct);
        });
        it('should throw an error if the API request fails', async () => {
            // Mock the API response to fail
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(false),
                statusText: jest.fn().mockReturnValue('Bad Request'),
            });
            // Attempt to create a product
            await expect(testDataBuilder.createProduct())
                .rejects.toThrow('Failed to create product: Bad Request');
        });
        it('should call the cleanup function when cleaning up the entity', async () => {
            // Mock the API response
            const mockProduct = { id: 'product-123', name: 'Test Product', price: 99.99 };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockProduct),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create a product
            const product = await testDataBuilder.createProduct();
            // Call the cleanup function
            await product.cleanup();
            // Verify the API was called to delete the product
            expect(mockRequest.delete).toHaveBeenCalledWith(`/api/products/${mockProduct.id}`);
        });
    });
    describe('createOrder', () => {
        it('should create an order with the provided user and products', async () => {
            // Mock the API response
            const mockOrder = { id: 'order-123', userId: 'user-123', products: [{ productId: 'product-123', quantity: 1 }] };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockOrder),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create an order
            const userId = 'user-123';
            const productIds = ['product-123'];
            const order = await testDataBuilder.createOrder(userId, productIds);
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/orders', {
                data: expect.objectContaining({
                    userId: 'user-123',
                    products: [{ productId: 'product-123', quantity: 1 }],
                    shippingAddress: {
                        street: '123 Test St',
                        city: 'Test City',
                        state: 'TS',
                        zipCode: '12345',
                        country: 'Test Country',
                    },
                }),
            });
            // Verify the order entity was created and registered for cleanup
            expect(order.id).toBe(mockOrder.id);
            expect(order.type).toBe('order');
            expect(order.data).toBe(mockOrder);
            expect(order.cleanup).toBeDefined();
            expect(mockTestData.createdEntities).toContain(order);
        });
        it('should create an order with custom data', async () => {
            // Mock the API response
            const mockOrder = { id: 'order-123', userId: 'user-123', products: [{ productId: 'product-123', quantity: 2 }] };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockOrder),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create an order with custom data
            const userId = 'user-123';
            const productIds = ['product-123'];
            const customData = {
                products: [{ productId: 'product-123', quantity: 2 }],
                shippingAddress: {
                    street: 'Custom Street',
                    city: 'Custom City',
                    state: 'CS',
                    zipCode: '54321',
                    country: 'Custom Country',
                },
            };
            const order = await testDataBuilder.createOrder(userId, productIds, customData);
            // Verify the API was called with the correct data
            expect(mockRequest.post).toHaveBeenCalledWith('/api/orders', {
                data: expect.objectContaining({
                    userId: 'user-123',
                    products: [{ productId: 'product-123', quantity: 2 }],
                    shippingAddress: {
                        street: 'Custom Street',
                        city: 'Custom City',
                        state: 'CS',
                        zipCode: '54321',
                        country: 'Custom Country',
                    },
                }),
            });
            // Verify the order entity was created
            expect(order.id).toBe(mockOrder.id);
            expect(order.data).toBe(mockOrder);
        });
        it('should throw an error if the API request fails', async () => {
            // Mock the API response to fail
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(false),
                statusText: jest.fn().mockReturnValue('Bad Request'),
            });
            // Attempt to create an order
            await expect(testDataBuilder.createOrder('user-123', ['product-123']))
                .rejects.toThrow('Failed to create order: Bad Request');
        });
        it('should call the cleanup function when cleaning up the entity', async () => {
            // Mock the API response
            const mockOrder = { id: 'order-123', userId: 'user-123', products: [{ productId: 'product-123', quantity: 1 }] };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockOrder),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Create an order
            const order = await testDataBuilder.createOrder('user-123', ['product-123']);
            // Call the cleanup function
            await order.cleanup();
            // Verify the API was called to delete the order
            expect(mockRequest.delete).toHaveBeenCalledWith(`/api/orders/${mockOrder.id}`);
        });
    });
    describe('createOrderScenario', () => {
        it('should create a user, products, and an order', async () => {
            // Mock createUser
            const mockUser = {
                id: 'user-123',
                type: 'user',
                data: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
                cleanup: jest.fn(),
            };
            jest.spyOn(testDataBuilder, 'createUser').mockResolvedValue(mockUser);
            // Mock createEntities
            const mockProducts = [
                {
                    id: 'product-123',
                    type: 'product',
                    data: { id: 'product-123', name: 'Test Product 1', price: 10.0 },
                    cleanup: jest.fn(),
                },
                {
                    id: 'product-456',
                    type: 'product',
                    data: { id: 'product-456', name: 'Test Product 2', price: 20.0 },
                    cleanup: jest.fn(),
                },
            ];
            jest.spyOn(testDataBuilder, 'createEntities').mockResolvedValue(mockProducts);
            // Mock createOrder
            const mockOrder = {
                id: 'order-123',
                type: 'order',
                data: { id: 'order-123', userId: 'user-123', products: [{ productId: 'product-123', quantity: 1 }, { productId: 'product-456', quantity: 1 }] },
                cleanup: jest.fn(),
            };
            jest.spyOn(testDataBuilder, 'createOrder').mockResolvedValue(mockOrder);
            // Create an order scenario
            const result = await testDataBuilder.createOrderScenario(2, { username: 'customuser' });
            // Verify the methods were called with the correct arguments
            expect(testDataBuilder.createUser).toHaveBeenCalledWith({ username: 'customuser' });
            expect(testDataBuilder.createEntities).toHaveBeenCalledWith('product', 2, expect.any(Function));
            expect(testDataBuilder.createOrder).toHaveBeenCalledWith('user-123', ['product-123', 'product-456']);
            // Verify the result contains the created entities
            expect(result).toEqual({
                user: mockUser,
                products: mockProducts,
                order: mockOrder,
            });
        });
    });
    describe('initialize', () => {
        it('should register factories for user, product, and order', () => {
            // Spy on registerFactory
            jest.spyOn(testDataBuilder, 'registerFactory');
            // Initialize the builder
            testDataBuilder.initialize();
            // Verify registerFactory was called for each entity type
            expect(testDataBuilder.registerFactory).toHaveBeenCalledTimes(3);
            expect(testDataBuilder.registerFactory).toHaveBeenCalledWith('user', expect.any(Function));
            expect(testDataBuilder.registerFactory).toHaveBeenCalledWith('product', expect.any(Function));
            expect(testDataBuilder.registerFactory).toHaveBeenCalledWith('order', expect.any(Function));
        });
        it('should register a factory that creates a user', async () => {
            // Initialize the builder
            testDataBuilder.initialize();
            // Get the user factory
            const userFactory = testDataBuilder['factories'].get('user');
            expect(userFactory).toBeDefined();
            // Mock the API response
            const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockUser),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Call the factory
            const customData = { username: 'customuser' };
            const entity = await userFactory(mockRequest, customData, mockTestData);
            // Verify the entity was created correctly
            expect(entity.id).toBe(mockUser.id);
            expect(entity.type).toBe('user');
            expect(entity.data).toBe(mockUser);
            expect(entity.cleanup).toBeDefined();
        });
        it('should register a factory that creates a product', async () => {
            // Initialize the builder
            testDataBuilder.initialize();
            // Get the product factory
            const productFactory = testDataBuilder['factories'].get('product');
            expect(productFactory).toBeDefined();
            // Mock the API response
            const mockProduct = { id: 'product-123', name: 'Test Product', price: 99.99 };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockProduct),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Call the factory
            const customData = { name: 'Custom Product' };
            const entity = await productFactory(mockRequest, customData, mockTestData);
            // Verify the entity was created correctly
            expect(entity.id).toBe(mockProduct.id);
            expect(entity.type).toBe('product');
            expect(entity.data).toBe(mockProduct);
            expect(entity.cleanup).toBeDefined();
        });
        it('should register a factory that creates an order', async () => {
            // Initialize the builder
            testDataBuilder.initialize();
            // Get the order factory
            const orderFactory = testDataBuilder['factories'].get('order');
            expect(orderFactory).toBeDefined();
            // Mock createUser and createProduct
            const mockUser = {
                id: 'user-123',
                type: 'user',
                data: { id: 'user-123', username: 'testuser', email: 'test@example.com' },
                cleanup: jest.fn(),
            };
            jest.spyOn(testDataBuilder, 'createUser').mockResolvedValue(mockUser);
            const mockProduct = {
                id: 'product-123',
                type: 'product',
                data: { id: 'product-123', name: 'Test Product', price: 99.99 },
                cleanup: jest.fn(),
            };
            jest.spyOn(testDataBuilder, 'createProduct').mockResolvedValue(mockProduct);
            // Mock the API response
            const mockOrder = { id: 'order-123', userId: 'user-123', products: [{ productId: 'product-123', quantity: 1 }] };
            mockRequest.post.mockResolvedValue({
                ok: jest.fn().mockReturnValue(true),
                json: jest.fn().mockResolvedValue(mockOrder),
                statusText: jest.fn().mockReturnValue('OK'),
            });
            // Call the factory
            const customData = {};
            const entity = await orderFactory(mockRequest, customData, mockTestData);
            // Verify the entity was created correctly
            expect(entity.id).toBe(mockOrder.id);
            expect(entity.type).toBe('order');
            expect(entity.data).toBe(mockOrder);
            expect(entity.cleanup).toBeDefined();
        });
    });
});
//# sourceMappingURL=TestDataBuilder.test.js.map
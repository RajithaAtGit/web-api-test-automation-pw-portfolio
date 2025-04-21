import { DIContainer, Factory, ServiceProvider } from '../DIContainer';

describe('DIContainer', () => {
  let container: DIContainer;

  beforeEach(() => {
    container = new DIContainer();
  });

  afterEach(() => {
    // Reset the singleton instance for each test
    (DIContainer as any).instance = undefined;
  });

  describe('getInstance', () => {
    it('should return the same instance each time', () => {
      const instance1 = DIContainer.getInstance();
      const instance2 = DIContainer.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should create a new instance if one does not exist', () => {
      const instance = DIContainer.getInstance();
      expect(instance).toBeInstanceOf(DIContainer);
    });
  });

  describe('register', () => {
    it('should register a service implementation', () => {
      const service = { name: 'test-service' };
      container.register('TestService', service);
      expect(container['services'].get('TestService')).toBe(service);
    });
  });

  describe('registerFactory', () => {
    it('should register a factory function', () => {
      const factory: Factory<any> = () => ({ name: 'factory-service' });
      container.registerFactory('FactoryService', factory);
      expect(container['factories'].get('FactoryService')).toBe(factory);
    });

    it('should remove any existing singleton instance if not a singleton factory', () => {
      const service = { name: 'singleton-service' };
      container['singletons'].set('Service', service);
      
      const factory: Factory<any> = () => ({ name: 'factory-service' });
      container.registerFactory('Service', factory, false);
      
      expect(container['singletons'].has('Service')).toBe(false);
    });

    it('should not remove existing singleton instance if a singleton factory', () => {
      const service = { name: 'singleton-service' };
      container['singletons'].set('Service', service);
      
      const factory: Factory<any> = () => ({ name: 'factory-service' });
      container.registerFactory('Service', factory, true);
      
      expect(container['singletons'].has('Service')).toBe(true);
    });
  });

  describe('resolve', () => {
    it('should resolve a registered service', () => {
      const service = { name: 'test-service' };
      container.register('TestService', service);
      
      const resolved = container.resolve<any>('TestService');
      expect(resolved).toBe(service);
    });

    it('should resolve a service from a factory', () => {
      const factory: Factory<any> = () => ({ name: 'factory-service' });
      container.registerFactory('FactoryService', factory);
      
      const resolved = container.resolve<any>('FactoryService');
      expect(resolved).toEqual({ name: 'factory-service' });
    });

    it('should resolve a singleton instance', () => {
      const service = { name: 'singleton-service' };
      container.registerSingleton('SingletonService', service);
      
      const resolved = container.resolve<any>('SingletonService');
      expect(resolved).toBe(service);
    });

    it('should resolve from parent container if not found in current container', () => {
      const parentService = { name: 'parent-service' };
      const parentContainer = new DIContainer();
      parentContainer.register('ParentService', parentService);
      
      const childContainer = new DIContainer(parentContainer);
      
      const resolved = childContainer.resolve<any>('ParentService');
      expect(resolved).toBe(parentService);
    });

    it('should throw an error if service is not registered', () => {
      expect(() => container.resolve('NonExistentService')).toThrow('Service not registered: NonExistentService');
    });

    it('should cache singleton factory instances', () => {
      // Mock the isSingletonFactory method to return true
      jest.spyOn(container as any, 'isSingletonFactory').mockReturnValue(true);
      
      const factory: Factory<any> = jest.fn(() => ({ name: 'singleton-factory-service' }));
      container.registerFactory('SingletonFactoryService', factory);
      
      // First resolution should call the factory
      const resolved1 = container.resolve<any>('SingletonFactoryService');
      expect(factory).toHaveBeenCalledTimes(1);
      expect(resolved1).toEqual({ name: 'singleton-factory-service' });
      
      // Second resolution should use the cached instance
      const resolved2 = container.resolve<any>('SingletonFactoryService');
      expect(factory).toHaveBeenCalledTimes(1); // Still only called once
      expect(resolved2).toBe(resolved1); // Same instance
    });
  });

  describe('isSingletonFactory', () => {
    it('should return false by default', () => {
      const result = (container as any).isSingletonFactory('TestService');
      expect(result).toBe(false);
    });
  });

  describe('createScope', () => {
    it('should create a new container with the current container as parent', () => {
      const scopedContainer = container.createScope();
      expect(scopedContainer).toBeInstanceOf(DIContainer);
      expect(scopedContainer['parent']).toBe(container);
    });
  });

  describe('registerSingleton', () => {
    it('should register a singleton service', () => {
      const service = { name: 'singleton-service' };
      container.registerSingleton('SingletonService', service);
      expect(container['singletons'].get('SingletonService')).toBe(service);
    });
  });

  describe('registerSingletonFactory', () => {
    it('should register a factory as a singleton', () => {
      const factory: Factory<any> = () => ({ name: 'singleton-factory-service' });
      
      // Spy on registerFactory to verify it's called with singleton=true
      const spy = jest.spyOn(container, 'registerFactory');
      
      container.registerSingletonFactory('SingletonFactoryService', factory);
      
      expect(spy).toHaveBeenCalledWith('SingletonFactoryService', factory, true);
    });
  });

  describe('hasRegistration', () => {
    it('should return true if service is registered directly', () => {
      container.register('TestService', {});
      expect(container.hasRegistration('TestService')).toBe(true);
    });

    it('should return true if factory is registered', () => {
      container.registerFactory('FactoryService', () => ({}));
      expect(container.hasRegistration('FactoryService')).toBe(true);
    });

    it('should return true if singleton is registered', () => {
      container.registerSingleton('SingletonService', {});
      expect(container.hasRegistration('SingletonService')).toBe(true);
    });

    it('should return true if service is registered in parent container', () => {
      const parentContainer = new DIContainer();
      parentContainer.register('ParentService', {});
      
      const childContainer = new DIContainer(parentContainer);
      
      expect(childContainer.hasRegistration('ParentService')).toBe(true);
    });

    it('should return false if service is not registered', () => {
      expect(container.hasRegistration('NonExistentService')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('should remove service registration', () => {
      container.register('TestService', {});
      container.unregister('TestService');
      expect(container['services'].has('TestService')).toBe(false);
    });

    it('should remove factory registration', () => {
      container.registerFactory('FactoryService', () => ({}));
      container.unregister('FactoryService');
      expect(container['factories'].has('FactoryService')).toBe(false);
    });

    it('should remove singleton registration', () => {
      container.registerSingleton('SingletonService', {});
      container.unregister('SingletonService');
      expect(container['singletons'].has('SingletonService')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all registrations', () => {
      container.register('TestService', {});
      container.registerFactory('FactoryService', () => ({}));
      container.registerSingleton('SingletonService', {});
      
      container.clear();
      
      expect(container['services'].size).toBe(0);
      expect(container['factories'].size).toBe(0);
      expect(container['singletons'].size).toBe(0);
    });
  });

  describe('resolveAll', () => {
    it('should resolve all services that match the predicate', () => {
      container.register('TestService1', { id: 1 });
      container.register('TestService2', { id: 2 });
      container.register('OtherService', { id: 3 });
      
      const results = container.resolveAll<any>(token => token.startsWith('Test'));
      
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ id: 1 });
      expect(results).toContainEqual({ id: 2 });
    });

    it('should include services from factories', () => {
      container.register('TestService1', { id: 1 });
      container.registerFactory('TestService2', () => ({ id: 2 }));
      
      const results = container.resolveAll<any>(token => token.startsWith('Test'));
      
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ id: 1 });
      expect(results).toContainEqual({ id: 2 });
    });

    it('should include services from singletons', () => {
      container.register('TestService1', { id: 1 });
      container.registerSingleton('TestService2', { id: 2 });
      
      const results = container.resolveAll<any>(token => token.startsWith('Test'));
      
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ id: 1 });
      expect(results).toContainEqual({ id: 2 });
    });

    it('should include services from parent container', () => {
      const parentContainer = new DIContainer();
      parentContainer.register('TestService1', { id: 1 });
      
      const childContainer = new DIContainer(parentContainer);
      childContainer.register('TestService2', { id: 2 });
      
      const results = childContainer.resolveAll<any>(token => token.startsWith('Test'));
      
      expect(results).toHaveLength(2);
      expect(results).toContainEqual({ id: 1 });
      expect(results).toContainEqual({ id: 2 });
    });

    it('should not include duplicate services', () => {
      container.register('TestService', { id: 1 });
      container.registerFactory('TestService', () => ({ id: 2 }));
      
      const results = container.resolveAll<any>(token => token === 'TestService');
      
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({ id: 1 });
    });
  });

  describe('createChild', () => {
    it('should create a child container with the current container as parent', () => {
      const childContainer = container.createChild();
      expect(childContainer).toBeInstanceOf(DIContainer);
      expect(childContainer['parent']).toBe(container);
    });

    it('should register overrides in the child container', () => {
      const overrides = {
        'TestService': { name: 'override-service' }
      };
      
      const childContainer = container.createChild(overrides);
      
      expect(childContainer['services'].get('TestService')).toEqual({ name: 'override-service' });
    });
  });

  describe('ServiceProvider', () => {
    it('should register services with the container', () => {
      class TestServiceProvider implements ServiceProvider {
        register(container: DIContainer): void {
          container.register('TestService', { name: 'provider-service' });
        }
      }
      
      const provider = new TestServiceProvider();
      provider.register(container);
      
      expect(container.resolve<any>('TestService')).toEqual({ name: 'provider-service' });
    });
  });
});
// Jest setup file

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Uncomment to suppress console logs during tests
  // log: jest.fn(),
  // info: jest.fn(),
  // debug: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock process.env with default test values
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  BASE_URL: 'http://localhost:3000',
  API_BASE_URL: 'http://localhost:3000/api',
};

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
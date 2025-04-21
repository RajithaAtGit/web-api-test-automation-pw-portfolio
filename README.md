# Web API Test Automation Framework with Playwright

**Author: R N W Gunawardana**

A comprehensive test automation framework using Playwright and TypeScript that implements SOLID principles and design patterns for maintainable, extensible test automation.

## Features

- **Page Object Model Architecture** - Encapsulates page elements and actions into maintainable classes
- **API Testing Integration** - Enables comprehensive testing across UI and API layers
- **Data-Driven Test Implementation** - Separates test logic from test data
- **Custom Reporter Extensions** - Enhances Playwright's native reporting
- **Cross-Browser/Device Configuration** - Ensures application works consistently across browsers
- **GitHub Actions CI/CD Pipeline** - Automates test execution on code changes
- **Test Data Strategy** - Implements factories, generators, and cleanup mechanisms
- **Docker Containerization** - Packages tests with dependencies for consistent execution

## Architecture

The framework is built with a layered architecture following SOLID principles:

### Core Interfaces

- **IPage** - Defines methods for page navigation with auto-waiting
- **IComponent** - Creates methods for visibility detection with reliable wait mechanisms
- **IApiClient** - Defines unified request methods for all HTTP verbs
- **IReporter** - Defines test lifecycle hooks and reporting capabilities

### Abstract Base Classes

- **BasePage** - Implements template methods for common operations
- **BaseComponent** - Creates methods for page context association
- **BaseTest** - Implements test lifecycle management

### Dependency Injection and Infrastructure

- **DIContainer** - Implements service registration and resolution
- **ConfigManager** - Creates environment-specific configuration
- **TestFixtures** - Implements authentication state setup and test data preparation

### Page Objects and Components

- **LoginPage** - Implements form interaction with reliable input handling
- **RegisterPage** - Implements registration form interaction and validation
- **NavigationMenu** - Implements menu item selection and current section detection

### Services and Utilities

- **TestDataBuilder** - Implements factory registration system for test data
- **RestApiClient** - Creates method-specific request helpers
- **SimpleReporter** - Implements test categorization and organization

## Architecture Diagrams

### Framework Architecture

The following diagram illustrates the overall architecture of the test automation framework:

![Architecture Diagram](./Diagram/Architecture%20Diagram.png)

### Class Structure with SOLID Principles and Design Patterns

This diagram shows how SOLID principles and design patterns are implemented in the class structure:

![Class Diagram with SOLID and Design Patterns](./Diagram/Class%20Diagram%20with%20SOLID%20and%20Design%20Patterns.png)

### Test Execution Flow

This diagram demonstrates the test execution flow and how various design patterns interact during test execution:

![Test Execution Flow with Design Patterns](./Diagram/Test%20Execution%20Flow%20with%20Design%20Patterns.png)

## Design Patterns

The framework implements several design patterns:

- **Facade Pattern** - Simplifies complex UI interactions in page objects
- **Composite Pattern** - Builds complex UI structures with components
- **Adapter Pattern** - Wraps Playwright's API functionality
- **Observer Pattern** - Monitors test execution events
- **Template Method Pattern** - Defines skeleton of operations in base classes
- **Bridge Pattern** - Separates abstraction from implementation in components
- **Strategy Pattern** - Supports different testing approaches
- **Factory Method Pattern** - Creates test contexts and data
- **Builder Pattern** - Constructs complex test data
- **Singleton Pattern** - Ensures consistent configuration

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RajithaAtGit/web-api-test-automation-pw-portfolio.git
   cd web-api-test-automation-pw-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests for a specific browser:
```bash
npx playwright test --project=chromium
```

### Running with Docker

Run all tests:
```bash
docker-compose up test
```

Run tests for a specific browser:
```bash
docker-compose up chromium
```

Run tests with UI mode (requires X11 forwarding):
```bash
docker-compose up test-ui
```

## Project Structure

```
├── src/
│   ├── interfaces/       # Core interfaces
│   ├── base/             # Abstract base classes
│   ├── pages/            # Page objects
│   ├── components/       # UI components
│   ├── services/         # Service implementations
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration management
│   └── di/               # Dependency injection
├── tests/                # Test files
├── test-results/         # Test results and artifacts
├── .github/workflows/    # GitHub Actions CI/CD
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

## Configuration

The framework can be configured using environment variables:

- `BASE_URL` - Base URL for UI tests
- `API_BASE_URL` - Base URL for API tests
- `HEADLESS` - Run tests in headless mode (true/false)
- `SLOW_MO` - Slow down test execution (milliseconds)
- `DEFAULT_TIMEOUT` - Default timeout for operations (milliseconds)
- `CAPTURE_VIDEO` - Capture video of test execution (true/false)
- `CAPTURE_TRACE` - Capture trace of test execution (true/false)
- `CAPTURE_SCREENSHOT_ON_FAILURE` - Capture screenshot on test failure (true/false)

## Creating Tests

### UI Test Example

```typescript
import { test } from '../src/base/BaseTest';
import { LoginPage } from '../src/pages/LoginPage';
import { RegisterPage } from '../src/pages/RegisterPage';

test('User can register a new account', async ({ page, reporter }) => {
  // Create page objects
  const registerPage = new RegisterPage(page);

  // Navigate to registration page
  await registerPage.navigateToRegisterPage();

  // Fill registration form
  await registerPage.fillRegistrationForm(
    'John',                // First Name
    'Doe',                 // Last Name
    '123 Test Street',     // Address
    'Testville',           // City
    'TX',                  // State
    '75001',               // Zip Code
    '1234567890',          // Phone #
    '123-45-6789',         // SSN
    'john.doe.test',       // Username
    'Test@1234',           // Password
    'Test@1234'            // Confirm Password
  );

  // Submit registration form
  await registerPage.submitRegistrationForm();

  // Verify registration was successful
  const isSuccessful = await registerPage.isRegistrationSuccessful();
  expect(isSuccessful).toBeTruthy();

  // Take screenshot for report
  await reporter.addScreenshot(await page.screenshot(), 'registration_success');
});
```

### API Test Example

```typescript
import { test } from '../src/base/BaseTest';

test('API can create and retrieve user', async ({ apiClient, testData }) => {
  // Create test data
  const userData = {
    username: `user_${testData.testId}`,
    email: `user_${testData.testId}@example.com`,
    password: 'Password123!'
  };

  // Create user via API
  const createResponse = await apiClient.post('/api/users', userData);
  expect(createResponse.status).toBe(201);

  // Get user ID from response
  const userId = createResponse.data.id;

  // Retrieve user via API
  const getResponse = await apiClient.get(`/api/users/${userId}`);
  expect(getResponse.status).toBe(200);
  expect(getResponse.data.username).toBe(userData.username);
});
```

## Roadmap

The framework development is organized into three phases:

### Phase 1 - MVP (Completed)

- Core framework setup with TypeScript configuration and linting
- Page Object Model implementation for key application flows
- Basic API testing integration with shared authentication
- Initial CI setup with GitHub Actions for single browser execution
- Environment configuration management for dev/staging
- Simple HTML reporting with screenshots of failures
- Cross-browser setup for Chrome and Firefox
- Basic test data management with factory patterns
- Documentation of framework architecture and setup instructions
- Dockerfile for containerized execution

### Phase 2 - Expansion (In Progress)

- Extended browser coverage including Safari and mobile viewports
- Enhanced API testing with request/response interceptors
- Advanced data-driven testing with external data sources
- Visual testing implementation with baseline management
- CI/CD enhancements with parallel execution and sharding
- Comprehensive reporting with embedded videos and traces
- Mock Service Worker implementation for controlled API testing
- Performance metrics collection and assertions
- Accessibility testing integration
- Enhanced documentation with contributor guides

### Phase 3 - Showcase (Planned)

- AI-assisted test maintenance with self-healing capabilities
- Cloud execution infrastructure on AWS/Azure
- Security testing automation integrated with OWASP tools
- Test impact analysis for efficient test execution
- Custom Playwright command extensions for domain-specific actions
- Test observability platform with dashboards
- Advanced Docker configurations with Kubernetes support
- Integration with AI/ML for test generation and optimization
- Comprehensive performance testing including Core Web Vitals
- Enterprise documentation with architecture diagrams and best practices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Conclusion

This test automation framework provides a solid foundation for test automation with Playwright and TypeScript. It follows SOLID principles and design patterns to ensure maintainability and extensibility. The framework supports UI testing, API testing, and hybrid testing approaches, with comprehensive reporting and test data management.

The example tests demonstrate how to use the framework for different testing scenarios, and the documentation provides guidance for users. The framework is ready for use in real-world projects and can be extended with additional features as needed.

## License

This project is licensed under a Proprietary and Confidential license - see the [LICENSE](./LICENSE) file for details.

## Author and Copyright

**Author:** R N W Gunawardana

Copyright © 2025 R N W Gunawardana. All rights reserved.

## AI Training Notice

This codebase may be utilized for training artificial intelligence and machine learning models aimed at improving software development tools and practices. The training process may involve the analysis of code patterns, structures, and documentation to enhance AI capabilities in code comprehension and generation. If this code is used for such purposes, appropriate credit or compensation should be given to the original author where applicable.

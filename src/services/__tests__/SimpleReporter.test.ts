import * as fs from 'fs';
import * as path from 'path';
import { SimpleReporter } from '../SimpleReporter';
import { LogLevel, Severity, TestInfo, TestResult, TestRunInfo, TestRunResult, TestStatus, StepInfo, StepResult } from '../../interfaces/IReporter';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn()
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  relative: jest.fn((from, to) => to.replace(from, ''))
}));

// Mock console methods
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.debug = jest.fn();
});

afterEach(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.debug = originalConsole.debug;
  jest.clearAllMocks();
});

describe('SimpleReporter', () => {
  let reporter: SimpleReporter;
  const outputDir = './test-output';

  beforeEach(() => {
    reporter = new SimpleReporter(outputDir);
  });

  describe('constructor', () => {
    it('should initialize with the provided output directory', () => {
      expect(reporter['outputDir']).toBe(outputDir);
      expect(reporter['screenshotsDir']).toBe(`${outputDir}/screenshots`);
      expect(reporter['tracesDir']).toBe(`${outputDir}/traces`);
      expect(reporter['videosDir']).toBe(`${outputDir}/videos`);
      expect(reporter['reportsDir']).toBe(`${outputDir}/reports`);
    });

    it('should create output directories if they do not exist', () => {
      expect(fs.existsSync).toHaveBeenCalledTimes(5);
      expect(fs.mkdirSync).toHaveBeenCalledTimes(5);
    });
  });

  describe('test lifecycle methods', () => {
    const testRunInfo: TestRunInfo = {
      startTime: new Date(),
      testCount: 10,
      projectName: 'Test Project',
      environment: 'test',
      browser: 'chrome'
    };

    const testRunResult: TestRunResult = {
      startTime: new Date(),
      endTime: new Date(),
      passedCount: 8,
      failedCount: 2,
      skippedCount: 0,
      totalCount: 10,
      duration: 1000
    };

    const testInfo: TestInfo = {
      id: 'test-1',
      title: 'Test 1',
      fullTitle: 'Test Suite > Test 1',
      file: 'test.spec.ts',
      line: 10,
      tags: {},
      retry: 0
    };

    const testResult: TestResult = {
      ...testInfo,
      status: TestStatus.PASSED,
      startTime: new Date(),
      endTime: new Date(),
      duration: 100,
      screenshots: [],
      traces: [],
      videos: [],
      attachments: []
    };

    const stepInfo: StepInfo = {
      id: 'step-1',
      title: 'Step 1',
      testId: 'test-1',
      category: 'action'
    };

    const stepResult: StepResult = {
      ...stepInfo,
      status: TestStatus.PASSED,
      startTime: new Date(),
      endTime: new Date(),
      duration: 50
    };

    it('should handle test run start', () => {
      reporter.onTestRunStart(testRunInfo);
      expect(reporter['testRunInfo']).toBe(testRunInfo);
      expect(reporter['testResults']).toEqual([]);
      expect(reporter['stepResults']).toEqual([]);
    });

    it('should handle test run end', () => {
      reporter.onTestRunEnd(testRunResult);
      expect(reporter['testRunResult']).toBe(testRunResult);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(2); // HTML and JSON reports
    });

    it('should handle test start', () => {
      reporter.onTestStart(testInfo);
      expect(reporter['currentTest']).toBe(testInfo);
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining(testInfo.id));
    });

    it('should handle test end', () => {
      reporter.onTestEnd(testResult);
      expect(reporter['currentTest']).toBeNull();
      expect(reporter['testResults']).toContain(testResult);
    });

    it('should handle step start', () => {
      reporter.onStepStart(stepInfo);
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('should handle step end', () => {
      reporter.onStepEnd(stepResult);
      expect(reporter['stepResults']).toContain(stepResult);
    });
  });

  describe('artifact methods', () => {
    beforeEach(() => {
      const testInfo: TestInfo = {
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0
      };

      reporter.onTestStart(testInfo);

      reporter['testResults'] = [{
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0,
        status: TestStatus.PASSED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        screenshots: [],
        traces: [],
        videos: [],
        attachments: []
      }];
    });

    it('should add screenshot', () => {
      const screenshot = Buffer.from('screenshot data');
      const name = 'screenshot.png';

      reporter.addScreenshot(screenshot, name);

      expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining(name), screenshot);
      expect(reporter['testResults'][0].screenshots).toHaveLength(1);
    });

    it('should add trace', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const tracePath = '/path/to/trace.zip';
      const name = 'trace.zip';

      reporter.addTrace(tracePath, name);

      expect(fs.copyFileSync).toHaveBeenCalledWith(tracePath, expect.stringContaining(name));
      expect(reporter['testResults'][0].traces).toHaveLength(1);
    });

    it('should add video', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const videoPath = '/path/to/video.webm';
      const name = 'video.webm';

      reporter.addVideo(videoPath, name);

      expect(fs.copyFileSync).toHaveBeenCalledWith(videoPath, expect.stringContaining(name));
      expect(reporter['testResults'][0].videos).toHaveLength(1);
    });

    it('should add attachment', () => {
      const buffer = Buffer.from('attachment data');
      const name = 'attachment.bin';
      const contentType = 'application/octet-stream';

      reporter.addAttachment(buffer, name, contentType);

      expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringContaining(name), buffer);
      expect(reporter['testResults'][0].attachments).toHaveLength(1);
    });
  });

  describe('logging and tagging methods', () => {
    beforeEach(() => {
      const testInfo: TestInfo = {
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0
      };

      reporter.onTestStart(testInfo);

      reporter['testResults'] = [{
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0,
        status: TestStatus.PASSED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        screenshots: [],
        traces: [],
        videos: [],
        attachments: []
      }];
    });

    it('should log messages with different levels', () => {
      // Reset console mocks before this test
      jest.clearAllMocks();

      reporter.log('Info message');
      expect(console.log).toHaveBeenCalledTimes(1);

      reporter.log('Error message', LogLevel.ERROR);
      expect(console.error).toHaveBeenCalledTimes(1);

      reporter.log('Warning message', LogLevel.WARN);
      expect(console.warn).toHaveBeenCalledTimes(1);

      reporter.log('Debug message', LogLevel.DEBUG);
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('should set tags', () => {
      reporter.setTag('key', 'value');

      expect(reporter['currentTest']?.tags['key']).toBe('value');
      expect(reporter['testResults'][0].tags['key']).toBe('value');
    });

    it('should set category', () => {
      const spy = jest.spyOn(reporter, 'setTag');

      reporter.setCategory('regression');

      expect(spy).toHaveBeenCalledWith('category', 'regression');
    });

    it('should set severity', () => {
      const spy = jest.spyOn(reporter, 'setTag');

      reporter.setSeverity(Severity.CRITICAL);

      expect(spy).toHaveBeenCalledWith('severity', Severity.CRITICAL);
    });

    it('should set owner', () => {
      const spy = jest.spyOn(reporter, 'setTag');

      reporter.setOwner('John Doe');

      expect(spy).toHaveBeenCalledWith('owner', 'John Doe');
    });

    it('should set property', () => {
      const spy = jest.spyOn(reporter, 'setTag');
      const value = { key: 'value' };

      reporter.setProperty('config', value);

      expect(spy).toHaveBeenCalledWith('property:config', JSON.stringify(value));
    });
  });

  describe('helper methods', () => {
    it('should create a safe directory name from test title', () => {
      const testInfo: TestInfo = {
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1 with special characters: !@#$%^&*()',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0
      };

      const directory = reporter['getTestDirectory'](testInfo);

      expect(directory).toBe(`${outputDir}/screenshots/test_suite_test_1_with_special_characters_test-1`);
    });

    it('should find test result by ID', () => {
      const testResult: TestResult = {
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0,
        status: TestStatus.PASSED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        screenshots: [],
        traces: [],
        videos: [],
        attachments: []
      };

      reporter['testResults'] = [testResult];

      const result = reporter['findTestResult']('test-1');

      expect(result).toBe(testResult);
    });

    it('should get status text', () => {
      expect(reporter['getStatusText'](TestStatus.PASSED)).toBe('PASSED');
      expect(reporter['getStatusText'](TestStatus.FAILED)).toBe('FAILED');
      expect(reporter['getStatusText'](TestStatus.SKIPPED)).toBe('SKIPPED');
      expect(reporter['getStatusText'](TestStatus.TIMEDOUT)).toBe('TIMED OUT');
    });

    it('should get log level for status', () => {
      expect(reporter['getLogLevelForStatus'](TestStatus.PASSED)).toBe(LogLevel.INFO);
      expect(reporter['getLogLevelForStatus'](TestStatus.FAILED)).toBe(LogLevel.ERROR);
      expect(reporter['getLogLevelForStatus'](TestStatus.SKIPPED)).toBe(LogLevel.WARN);
      expect(reporter['getLogLevelForStatus'](TestStatus.TIMEDOUT)).toBe(LogLevel.ERROR);
    });
  });

  describe('report generation', () => {
    beforeEach(() => {
      reporter['testRunResult'] = {
        startTime: new Date(),
        endTime: new Date(),
        passedCount: 8,
        failedCount: 2,
        skippedCount: 0,
        totalCount: 10,
        duration: 1000
      };

      reporter['testResults'] = [{
        id: 'test-1',
        title: 'Test 1',
        fullTitle: 'Test Suite > Test 1',
        file: 'test.spec.ts',
        line: 10,
        tags: {},
        retry: 0,
        status: TestStatus.PASSED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        screenshots: [],
        traces: [],
        videos: [],
        attachments: []
      }];
    });

    it('should generate HTML report', () => {
      reporter['generateHtmlReport']();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/reports/report.html`,
        expect.any(String)
      );
    });

    it('should generate JSON report', () => {
      reporter['generateJsonReport']();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/reports/report.json`,
        expect.any(String)
      );
    });
  });
});

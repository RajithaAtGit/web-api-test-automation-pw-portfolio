/**
 * @file IReporter.ts
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
 * IReporter Interface
 * 
 * Defines methods for test reporting, including test lifecycle hooks, screenshot and trace collection,
 * and test categorization. Implements the Observer pattern to monitor test execution events.
 */
export interface IReporter {
  /**
   * Called when a test run starts
   * @param testRunInfo Information about the test run
   */
  onTestRunStart(testRunInfo: TestRunInfo): void;

  /**
   * Called when a test run ends
   * @param testRunResult Result of the test run
   */
  onTestRunEnd(testRunResult: TestRunResult): void;

  /**
   * Called when a test starts
   * @param testInfo Information about the test
   */
  onTestStart(testInfo: TestInfo): void;

  /**
   * Called when a test ends
   * @param testResult Result of the test
   */
  onTestEnd(testResult: TestResult): void;

  /**
   * Called when a test step starts
   * @param stepInfo Information about the test step
   */
  onStepStart(stepInfo: StepInfo): void;

  /**
   * Called when a test step ends
   * @param stepResult Result of the test step
   */
  onStepEnd(stepResult: StepResult): void;

  /**
   * Adds a screenshot to the report
   * @param screenshot Screenshot data
   * @param name Optional name for the screenshot
   * @param description Optional description for the screenshot
   */
  addScreenshot(screenshot: Buffer | string, name?: string, description?: string): void;

  /**
   * Adds a trace to the report
   * @param trace Trace data or path
   * @param name Optional name for the trace
   */
  addTrace(trace: any, name?: string): void;

  /**
   * Adds a video to the report
   * @param video Video data or path
   * @param name Optional name for the video
   */
  addVideo(video: any, name?: string): void;

  /**
   * Adds an attachment to the report
   * @param attachment Attachment data or path
   * @param name Name for the attachment
   * @param contentType Content type of the attachment
   */
  addAttachment(attachment: any, name: string, contentType: string): void;

  /**
   * Logs a message to the report
   * @param message Message to log
   * @param level Log level
   */
  log(message: string, level?: LogLevel): void;

  /**
   * Sets a tag for the current test
   * @param name Tag name
   * @param value Optional tag value
   */
  setTag(name: string, value?: string): void;

  /**
   * Sets the category for the current test
   * @param category Category name
   */
  setCategory(category: string): void;

  /**
   * Sets the severity for the current test
   * @param severity Severity level
   */
  setSeverity(severity: Severity): void;

  /**
   * Sets the owner of the current test
   * @param owner Owner name
   */
  setOwner(owner: string): void;

  /**
   * Sets a custom property for the current test
   * @param name Property name
   * @param value Property value
   */
  setProperty(name: string, value: any): void;
}

/**
 * Log levels for reporting
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Severity levels for tests
 */
export enum Severity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  NORMAL = 'normal',
  MINOR = 'minor',
  TRIVIAL = 'trivial'
}

/**
 * Information about a test run
 */
export interface TestRunInfo {
  /**
   * Start time of the test run
   */
  startTime: Date;

  /**
   * Number of tests to run
   */
  testCount: number;

  /**
   * Project name
   */
  projectName: string;

  /**
   * Environment name
   */
  environment: string;

  /**
   * Browser name
   */
  browser: string;
}

/**
 * Result of a test run
 */
export interface TestRunResult {
  /**
   * Start time of the test run
   */
  startTime: Date;

  /**
   * End time of the test run
   */
  endTime: Date;

  /**
   * Number of tests that passed
   */
  passedCount: number;

  /**
   * Number of tests that failed
   */
  failedCount: number;

  /**
   * Number of tests that were skipped
   */
  skippedCount: number;

  /**
   * Total number of tests
   */
  totalCount: number;

  /**
   * Duration of the test run in milliseconds
   */
  duration: number;
}

/**
 * Information about a test
 */
export interface TestInfo {
  /**
   * Test ID
   */
  id: string;

  /**
   * Test title
   */
  title: string;

  /**
   * Full test title including parent titles
   */
  fullTitle: string;

  /**
   * File path of the test
   */
  file: string;

  /**
   * Line number of the test in the file
   */
  line: number;

  /**
   * Test tags
   */
  tags: Record<string, string>;

  /**
   * Test retry number (0 for first attempt)
   */
  retry: number;
}

/**
 * Result of a test
 */
export interface TestResult extends TestInfo {
  /**
   * Test status
   */
  status: TestStatus;

  /**
   * Start time of the test
   */
  startTime: Date;

  /**
   * End time of the test
   */
  endTime: Date;

  /**
   * Duration of the test in milliseconds
   */
  duration: number;

  /**
   * Error message if the test failed
   */
  errorMessage?: string;

  /**
   * Error stack trace if the test failed
   */
  errorStack?: string;

  /**
   * Screenshots taken during the test
   */
  screenshots: Array<{ name: string; path: string; description?: string }>;

  /**
   * Traces collected during the test
   */
  traces: Array<{ name: string; path: string }>;

  /**
   * Videos recorded during the test
   */
  videos: Array<{ name: string; path: string }>;

  /**
   * Attachments added during the test
   */
  attachments: Array<{ name: string; path: string; contentType: string }>;
}

/**
 * Test status
 */
export enum TestStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  TIMEDOUT = 'timedout'
}

/**
 * Information about a test step
 */
export interface StepInfo {
  /**
   * Step ID
   */
  id: string;

  /**
   * Step title
   */
  title: string;

  /**
   * Parent test ID
   */
  testId: string;

  /**
   * Parent step ID if this is a nested step
   */
  parentStepId?: string;

  /**
   * Step category
   */
  category?: string;
}

/**
 * Result of a test step
 */
export interface StepResult extends StepInfo {
  /**
   * Step status
   */
  status: TestStatus;

  /**
   * Start time of the step
   */
  startTime: Date;

  /**
   * End time of the step
   */
  endTime: Date;

  /**
   * Duration of the step in milliseconds
   */
  duration: number;

  /**
   * Error message if the step failed
   */
  errorMessage?: string;

  /**
   * Error stack trace if the step failed
   */
  errorStack?: string;
}

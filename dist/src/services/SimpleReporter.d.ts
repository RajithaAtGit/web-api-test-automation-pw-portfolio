/**
 * @file SimpleReporter.ts
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
import { IReporter, LogLevel, Severity, TestInfo, TestResult, TestRunInfo, TestRunResult, StepInfo, StepResult } from '../interfaces/IReporter';
/**
 * SimpleReporter
 *
 * Implementation of the IReporter interface for basic test reporting.
 * Implements the Observer pattern for execution monitoring.
 */
export declare class SimpleReporter implements IReporter {
    private readonly outputDir;
    private readonly screenshotsDir;
    private readonly tracesDir;
    private readonly videosDir;
    private readonly reportsDir;
    private currentTest;
    private testResults;
    private testRunInfo;
    private testRunResult;
    private stepResults;
    /**
     * Creates a new SimpleReporter instance
     * @param outputDir Output directory for reports and artifacts
     */
    constructor(outputDir?: string);
    /**
     * Creates output directories
     */
    private createDirectories;
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
    /**
     * Gets the directory for a test
     * @param testInfo Test information
     * @returns Path to the test directory
     */
    private getTestDirectory;
    /**
     * Finds a test result by ID
     * @param testId Test ID
     * @returns Test result or undefined if not found
     */
    private findTestResult;
    /**
     * Gets the text representation of a test status
     * @param status Test status
     * @returns Text representation of the status
     */
    private getStatusText;
    /**
     * Gets the log level for a test status
     * @param status Test status
     * @returns Log level
     */
    private getLogLevelForStatus;
    /**
     * Generates an HTML report
     */
    private generateHtmlReport;
    /**
     * Generates a JSON report
     */
    private generateJsonReport;
}

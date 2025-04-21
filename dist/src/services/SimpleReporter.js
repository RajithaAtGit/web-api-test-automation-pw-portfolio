"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleReporter = void 0;
const IReporter_1 = require("../interfaces/IReporter");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * SimpleReporter
 *
 * Implementation of the IReporter interface for basic test reporting.
 * Implements the Observer pattern for execution monitoring.
 */
class SimpleReporter {
    outputDir;
    screenshotsDir;
    tracesDir;
    videosDir;
    reportsDir;
    currentTest = null;
    testResults = [];
    testRunInfo = null;
    testRunResult = null;
    stepResults = [];
    /**
     * Creates a new SimpleReporter instance
     * @param outputDir Output directory for reports and artifacts
     */
    constructor(outputDir = './test-results') {
        this.outputDir = outputDir;
        this.screenshotsDir = path.join(outputDir, 'screenshots');
        this.tracesDir = path.join(outputDir, 'traces');
        this.videosDir = path.join(outputDir, 'videos');
        this.reportsDir = path.join(outputDir, 'reports');
        // Create directories if they don't exist
        this.createDirectories();
    }
    /**
     * Creates output directories
     */
    createDirectories() {
        [this.outputDir, this.screenshotsDir, this.tracesDir, this.videosDir, this.reportsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    /**
     * Called when a test run starts
     * @param testRunInfo Information about the test run
     */
    onTestRunStart(testRunInfo) {
        this.testRunInfo = testRunInfo;
        this.testResults = [];
        this.stepResults = [];
        this.log(`Test run started at ${testRunInfo.startTime.toISOString()}`, IReporter_1.LogLevel.INFO);
        this.log(`Running ${testRunInfo.testCount} tests in ${testRunInfo.projectName} (${testRunInfo.environment})`, IReporter_1.LogLevel.INFO);
        this.log(`Browser: ${testRunInfo.browser}`, IReporter_1.LogLevel.INFO);
    }
    /**
     * Called when a test run ends
     * @param testRunResult Result of the test run
     */
    onTestRunEnd(testRunResult) {
        this.testRunResult = testRunResult;
        this.log(`Test run completed at ${testRunResult.endTime.toISOString()}`, IReporter_1.LogLevel.INFO);
        this.log(`Duration: ${testRunResult.duration}ms`, IReporter_1.LogLevel.INFO);
        this.log(`Results: ${testRunResult.passedCount} passed, ${testRunResult.failedCount} failed, ${testRunResult.skippedCount} skipped`, IReporter_1.LogLevel.INFO);
        // Generate HTML report
        this.generateHtmlReport();
        // Generate JSON report
        this.generateJsonReport();
    }
    /**
     * Called when a test starts
     * @param testInfo Information about the test
     */
    onTestStart(testInfo) {
        this.currentTest = testInfo;
        this.log(`Test started: ${testInfo.fullTitle}`, IReporter_1.LogLevel.INFO);
        // Create test directory for artifacts
        const testDir = this.getTestDirectory(testInfo);
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
    }
    /**
     * Called when a test ends
     * @param testResult Result of the test
     */
    onTestEnd(testResult) {
        this.currentTest = null;
        this.testResults.push(testResult);
        const statusText = this.getStatusText(testResult.status);
        this.log(`Test ${statusText}: ${testResult.fullTitle} (${testResult.duration}ms)`, this.getLogLevelForStatus(testResult.status));
        if (testResult.status === IReporter_1.TestStatus.FAILED && testResult.errorMessage) {
            this.log(`Error: ${testResult.errorMessage}`, IReporter_1.LogLevel.ERROR);
            if (testResult.errorStack) {
                this.log(`Stack: ${testResult.errorStack}`, IReporter_1.LogLevel.DEBUG);
            }
        }
    }
    /**
     * Called when a test step starts
     * @param stepInfo Information about the test step
     */
    onStepStart(stepInfo) {
        this.log(`Step started: ${stepInfo.title}`, IReporter_1.LogLevel.DEBUG);
    }
    /**
     * Called when a test step ends
     * @param stepResult Result of the test step
     */
    onStepEnd(stepResult) {
        this.stepResults.push(stepResult);
        const statusText = this.getStatusText(stepResult.status);
        this.log(`Step ${statusText}: ${stepResult.title} (${stepResult.duration}ms)`, this.getLogLevelForStatus(stepResult.status));
        if (stepResult.status === IReporter_1.TestStatus.FAILED && stepResult.errorMessage) {
            this.log(`Error: ${stepResult.errorMessage}`, IReporter_1.LogLevel.ERROR);
        }
    }
    /**
     * Adds a screenshot to the report
     * @param screenshot Screenshot data
     * @param name Optional name for the screenshot
     * @param description Optional description for the screenshot
     */
    addScreenshot(screenshot, name, description) {
        if (!this.currentTest) {
            this.log('Cannot add screenshot: No test is currently running', IReporter_1.LogLevel.WARN);
            return;
        }
        const testDir = this.getTestDirectory(this.currentTest);
        const screenshotName = name || `screenshot-${Date.now()}.png`;
        const screenshotPath = path.join(testDir, screenshotName);
        try {
            if (typeof screenshot === 'string') {
                // If screenshot is a path, copy the file
                if (fs.existsSync(screenshot)) {
                    fs.copyFileSync(screenshot, screenshotPath);
                }
                else {
                    // If screenshot is a base64 string, decode and write it
                    const buffer = Buffer.from(screenshot, 'base64');
                    fs.writeFileSync(screenshotPath, buffer);
                }
            }
            else {
                // If screenshot is a buffer, write it directly
                fs.writeFileSync(screenshotPath, screenshot);
            }
            // Update the test result with the screenshot
            const testResult = this.findTestResult(this.currentTest.id);
            if (testResult) {
                testResult.screenshots.push({
                    name: screenshotName,
                    path: screenshotPath,
                    description
                });
            }
            this.log(`Screenshot saved: ${screenshotPath}`, IReporter_1.LogLevel.DEBUG);
        }
        catch (error) {
            this.log(`Failed to save screenshot: ${error}`, IReporter_1.LogLevel.ERROR);
        }
    }
    /**
     * Adds a trace to the report
     * @param trace Trace data or path
     * @param name Optional name for the trace
     */
    addTrace(trace, name) {
        if (!this.currentTest) {
            this.log('Cannot add trace: No test is currently running', IReporter_1.LogLevel.WARN);
            return;
        }
        const testDir = this.getTestDirectory(this.currentTest);
        const traceName = name || `trace-${Date.now()}.zip`;
        const tracePath = path.join(testDir, traceName);
        try {
            if (typeof trace === 'string' && fs.existsSync(trace)) {
                // If trace is a path, copy the file
                fs.copyFileSync(trace, tracePath);
            }
            else {
                // For other types, just log that we don't support them yet
                this.log(`Trace format not supported: ${typeof trace}`, IReporter_1.LogLevel.WARN);
                return;
            }
            // Update the test result with the trace
            const testResult = this.findTestResult(this.currentTest.id);
            if (testResult) {
                testResult.traces.push({
                    name: traceName,
                    path: tracePath
                });
            }
            this.log(`Trace saved: ${tracePath}`, IReporter_1.LogLevel.DEBUG);
        }
        catch (error) {
            this.log(`Failed to save trace: ${error}`, IReporter_1.LogLevel.ERROR);
        }
    }
    /**
     * Adds a video to the report
     * @param video Video data or path
     * @param name Optional name for the video
     */
    addVideo(video, name) {
        if (!this.currentTest) {
            this.log('Cannot add video: No test is currently running', IReporter_1.LogLevel.WARN);
            return;
        }
        const testDir = this.getTestDirectory(this.currentTest);
        const videoName = name || `video-${Date.now()}.webm`;
        const videoPath = path.join(testDir, videoName);
        try {
            if (typeof video === 'string' && fs.existsSync(video)) {
                // If video is a path, copy the file
                fs.copyFileSync(video, videoPath);
            }
            else {
                // For other types, just log that we don't support them yet
                this.log(`Video format not supported: ${typeof video}`, IReporter_1.LogLevel.WARN);
                return;
            }
            // Update the test result with the video
            const testResult = this.findTestResult(this.currentTest.id);
            if (testResult) {
                testResult.videos.push({
                    name: videoName,
                    path: videoPath
                });
            }
            this.log(`Video saved: ${videoPath}`, IReporter_1.LogLevel.DEBUG);
        }
        catch (error) {
            this.log(`Failed to save video: ${error}`, IReporter_1.LogLevel.ERROR);
        }
    }
    /**
     * Adds an attachment to the report
     * @param attachment Attachment data or path
     * @param name Name for the attachment
     * @param contentType Content type of the attachment
     */
    addAttachment(attachment, name, contentType) {
        if (!this.currentTest) {
            this.log('Cannot add attachment: No test is currently running', IReporter_1.LogLevel.WARN);
            return;
        }
        const testDir = this.getTestDirectory(this.currentTest);
        const attachmentPath = path.join(testDir, name);
        try {
            if (typeof attachment === 'string' && fs.existsSync(attachment)) {
                // If attachment is a path, copy the file
                fs.copyFileSync(attachment, attachmentPath);
            }
            else if (Buffer.isBuffer(attachment)) {
                // If attachment is a buffer, write it directly
                fs.writeFileSync(attachmentPath, attachment);
            }
            else if (typeof attachment === 'string') {
                // If attachment is a string, write it as text
                fs.writeFileSync(attachmentPath, attachment);
            }
            else {
                // For other types, try to stringify and save as JSON
                fs.writeFileSync(attachmentPath, JSON.stringify(attachment, null, 2));
            }
            // Update the test result with the attachment
            const testResult = this.findTestResult(this.currentTest.id);
            if (testResult) {
                testResult.attachments.push({
                    name,
                    path: attachmentPath,
                    contentType
                });
            }
            this.log(`Attachment saved: ${attachmentPath}`, IReporter_1.LogLevel.DEBUG);
        }
        catch (error) {
            this.log(`Failed to save attachment: ${error}`, IReporter_1.LogLevel.ERROR);
        }
    }
    /**
     * Logs a message to the report
     * @param message Message to log
     * @param level Log level
     */
    log(message, level = IReporter_1.LogLevel.INFO) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        // Log to console
        switch (level) {
            case IReporter_1.LogLevel.ERROR:
                console.error(logMessage);
                break;
            case IReporter_1.LogLevel.WARN:
                console.warn(logMessage);
                break;
            case IReporter_1.LogLevel.DEBUG:
                console.debug(logMessage);
                break;
            case IReporter_1.LogLevel.INFO:
            default:
                console.log(logMessage);
                break;
        }
        // Append to log file
        const logFile = path.join(this.outputDir, 'test-run.log');
        fs.appendFileSync(logFile, logMessage + '\n');
    }
    /**
     * Sets a tag for the current test
     * @param name Tag name
     * @param value Optional tag value
     */
    setTag(name, value) {
        if (!this.currentTest) {
            this.log('Cannot set tag: No test is currently running', IReporter_1.LogLevel.WARN);
            return;
        }
        // Update the test info with the tag
        this.currentTest.tags[name] = value || '';
        // Update the test result with the tag
        const testResult = this.findTestResult(this.currentTest.id);
        if (testResult) {
            testResult.tags[name] = value || '';
        }
        this.log(`Tag set: ${name}=${value || ''}`, IReporter_1.LogLevel.DEBUG);
    }
    /**
     * Sets the category for the current test
     * @param category Category name
     */
    setCategory(category) {
        this.setTag('category', category);
    }
    /**
     * Sets the severity for the current test
     * @param severity Severity level
     */
    setSeverity(severity) {
        this.setTag('severity', severity);
    }
    /**
     * Sets the owner of the current test
     * @param owner Owner name
     */
    setOwner(owner) {
        this.setTag('owner', owner);
    }
    /**
     * Sets a custom property for the current test
     * @param name Property name
     * @param value Property value
     */
    setProperty(name, value) {
        this.setTag(`property:${name}`, JSON.stringify(value));
    }
    /**
     * Gets the directory for a test
     * @param testInfo Test information
     * @returns Path to the test directory
     */
    getTestDirectory(testInfo) {
        // Create a safe directory name from the test title
        const safeName = testInfo.fullTitle
            .replace(/[^a-z0-9]/gi, '_')
            .replace(/_+/g, '_')
            .toLowerCase();
        return path.join(this.screenshotsDir, `${safeName}_${testInfo.id}`);
    }
    /**
     * Finds a test result by ID
     * @param testId Test ID
     * @returns Test result or undefined if not found
     */
    findTestResult(testId) {
        return this.testResults.find(result => result.id === testId);
    }
    /**
     * Gets the text representation of a test status
     * @param status Test status
     * @returns Text representation of the status
     */
    getStatusText(status) {
        switch (status) {
            case IReporter_1.TestStatus.PASSED:
                return 'PASSED';
            case IReporter_1.TestStatus.FAILED:
                return 'FAILED';
            case IReporter_1.TestStatus.SKIPPED:
                return 'SKIPPED';
            case IReporter_1.TestStatus.TIMEDOUT:
                return 'TIMED OUT';
            default:
                return status;
        }
    }
    /**
     * Gets the log level for a test status
     * @param status Test status
     * @returns Log level
     */
    getLogLevelForStatus(status) {
        switch (status) {
            case IReporter_1.TestStatus.PASSED:
                return IReporter_1.LogLevel.INFO;
            case IReporter_1.TestStatus.FAILED:
            case IReporter_1.TestStatus.TIMEDOUT:
                return IReporter_1.LogLevel.ERROR;
            case IReporter_1.TestStatus.SKIPPED:
                return IReporter_1.LogLevel.WARN;
            default:
                return IReporter_1.LogLevel.INFO;
        }
    }
    /**
     * Generates an HTML report
     */
    generateHtmlReport() {
        if (!this.testRunResult) {
            return;
        }
        const reportPath = path.join(this.reportsDir, 'report.html');
        // Generate a simple HTML report
        let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .summary { margin-bottom: 20px; }
          .test { margin-bottom: 10px; padding: 10px; border-radius: 5px; }
          .passed { background-color: #dff0d8; }
          .failed { background-color: #f2dede; }
          .skipped { background-color: #fcf8e3; }
          .timedout { background-color: #f2dede; }
          .error { color: #a94442; margin-top: 5px; }
          .attachments { margin-top: 10px; }
          .attachment { margin-right: 10px; }
        </style>
      </head>
      <body>
        <h1>Test Report</h1>
        <div class="summary">
          <p>Start Time: ${this.testRunResult.startTime.toISOString()}</p>
          <p>End Time: ${this.testRunResult.endTime.toISOString()}</p>
          <p>Duration: ${this.testRunResult.duration}ms</p>
          <p>Total Tests: ${this.testRunResult.totalCount}</p>
          <p>Passed: ${this.testRunResult.passedCount}</p>
          <p>Failed: ${this.testRunResult.failedCount}</p>
          <p>Skipped: ${this.testRunResult.skippedCount}</p>
        </div>
        <h2>Tests</h2>
    `;
        // Add test results
        for (const result of this.testResults) {
            html += `
        <div class="test ${result.status.toLowerCase()}">
          <h3>${result.fullTitle}</h3>
          <p>Status: ${this.getStatusText(result.status)}</p>
          <p>Duration: ${result.duration}ms</p>
      `;
            // Add error message if test failed
            if (result.status === IReporter_1.TestStatus.FAILED && result.errorMessage) {
                html += `<div class="error"><strong>Error:</strong> ${result.errorMessage}</div>`;
            }
            // Add attachments
            if (result.screenshots.length > 0 || result.traces.length > 0 || result.videos.length > 0) {
                html += `<div class="attachments"><strong>Attachments:</strong>`;
                // Add screenshots
                for (const screenshot of result.screenshots) {
                    const relativePath = path.relative(this.reportsDir, screenshot.path).replace(/\\/g, '/');
                    html += `<a class="attachment" href="${relativePath}" target="_blank">${screenshot.name}</a>`;
                }
                // Add traces
                for (const trace of result.traces) {
                    const relativePath = path.relative(this.reportsDir, trace.path).replace(/\\/g, '/');
                    html += `<a class="attachment" href="${relativePath}" target="_blank">${trace.name}</a>`;
                }
                // Add videos
                for (const video of result.videos) {
                    const relativePath = path.relative(this.reportsDir, video.path).replace(/\\/g, '/');
                    html += `<a class="attachment" href="${relativePath}" target="_blank">${video.name}</a>`;
                }
                html += `</div>`;
            }
            html += `</div>`;
        }
        html += `
      </body>
      </html>
    `;
        fs.writeFileSync(reportPath, html);
        this.log(`HTML report generated: ${reportPath}`, IReporter_1.LogLevel.INFO);
    }
    /**
     * Generates a JSON report
     */
    generateJsonReport() {
        if (!this.testRunResult) {
            return;
        }
        const reportPath = path.join(this.reportsDir, 'report.json');
        const report = {
            testRun: this.testRunResult,
            tests: this.testResults,
            steps: this.stepResults
        };
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        this.log(`JSON report generated: ${reportPath}`, IReporter_1.LogLevel.INFO);
    }
}
exports.SimpleReporter = SimpleReporter;
//# sourceMappingURL=SimpleReporter.js.map
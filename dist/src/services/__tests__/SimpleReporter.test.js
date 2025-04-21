"use strict";
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
const fs = __importStar(require("fs"));
const SimpleReporter_1 = require("../SimpleReporter");
const IReporter_1 = require("../../interfaces/IReporter");
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
    let reporter;
    const outputDir = './test-output';
    beforeEach(() => {
        reporter = new SimpleReporter_1.SimpleReporter(outputDir);
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
        const testRunInfo = {
            startTime: new Date(),
            testCount: 10,
            projectName: 'Test Project',
            environment: 'test',
            browser: 'chrome'
        };
        const testRunResult = {
            startTime: new Date(),
            endTime: new Date(),
            passedCount: 8,
            failedCount: 2,
            skippedCount: 0,
            totalCount: 10,
            duration: 1000
        };
        const testInfo = {
            id: 'test-1',
            title: 'Test 1',
            fullTitle: 'Test Suite > Test 1',
            file: 'test.spec.ts',
            line: 10,
            tags: {},
            retry: 0
        };
        const testResult = {
            ...testInfo,
            status: IReporter_1.TestStatus.PASSED,
            startTime: new Date(),
            endTime: new Date(),
            duration: 100,
            screenshots: [],
            traces: [],
            videos: [],
            attachments: []
        };
        const stepInfo = {
            id: 'step-1',
            title: 'Step 1',
            testId: 'test-1',
            category: 'action'
        };
        const stepResult = {
            ...stepInfo,
            status: IReporter_1.TestStatus.PASSED,
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
            const testInfo = {
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
                    status: IReporter_1.TestStatus.PASSED,
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
            fs.existsSync.mockReturnValue(true);
            const tracePath = '/path/to/trace.zip';
            const name = 'trace.zip';
            reporter.addTrace(tracePath, name);
            expect(fs.copyFileSync).toHaveBeenCalledWith(tracePath, expect.stringContaining(name));
            expect(reporter['testResults'][0].traces).toHaveLength(1);
        });
        it('should add video', () => {
            fs.existsSync.mockReturnValue(true);
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
            const testInfo = {
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
                    status: IReporter_1.TestStatus.PASSED,
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
            reporter.log('Error message', IReporter_1.LogLevel.ERROR);
            expect(console.error).toHaveBeenCalledTimes(1);
            reporter.log('Warning message', IReporter_1.LogLevel.WARN);
            expect(console.warn).toHaveBeenCalledTimes(1);
            reporter.log('Debug message', IReporter_1.LogLevel.DEBUG);
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
            reporter.setSeverity(IReporter_1.Severity.CRITICAL);
            expect(spy).toHaveBeenCalledWith('severity', IReporter_1.Severity.CRITICAL);
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
            const testInfo = {
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
            const testResult = {
                id: 'test-1',
                title: 'Test 1',
                fullTitle: 'Test Suite > Test 1',
                file: 'test.spec.ts',
                line: 10,
                tags: {},
                retry: 0,
                status: IReporter_1.TestStatus.PASSED,
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
            expect(reporter['getStatusText'](IReporter_1.TestStatus.PASSED)).toBe('PASSED');
            expect(reporter['getStatusText'](IReporter_1.TestStatus.FAILED)).toBe('FAILED');
            expect(reporter['getStatusText'](IReporter_1.TestStatus.SKIPPED)).toBe('SKIPPED');
            expect(reporter['getStatusText'](IReporter_1.TestStatus.TIMEDOUT)).toBe('TIMED OUT');
        });
        it('should get log level for status', () => {
            expect(reporter['getLogLevelForStatus'](IReporter_1.TestStatus.PASSED)).toBe(IReporter_1.LogLevel.INFO);
            expect(reporter['getLogLevelForStatus'](IReporter_1.TestStatus.FAILED)).toBe(IReporter_1.LogLevel.ERROR);
            expect(reporter['getLogLevelForStatus'](IReporter_1.TestStatus.SKIPPED)).toBe(IReporter_1.LogLevel.WARN);
            expect(reporter['getLogLevelForStatus'](IReporter_1.TestStatus.TIMEDOUT)).toBe(IReporter_1.LogLevel.ERROR);
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
                    status: IReporter_1.TestStatus.PASSED,
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
            expect(fs.writeFileSync).toHaveBeenCalledWith(`${outputDir}/reports/report.html`, expect.any(String));
        });
        it('should generate JSON report', () => {
            reporter['generateJsonReport']();
            expect(fs.writeFileSync).toHaveBeenCalledWith(`${outputDir}/reports/report.json`, expect.any(String));
        });
    });
});
//# sourceMappingURL=SimpleReporter.test.js.map
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStatus = exports.Severity = exports.LogLevel = void 0;
/**
 * Log levels for reporting
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Severity levels for tests
 */
var Severity;
(function (Severity) {
    Severity["BLOCKER"] = "blocker";
    Severity["CRITICAL"] = "critical";
    Severity["NORMAL"] = "normal";
    Severity["MINOR"] = "minor";
    Severity["TRIVIAL"] = "trivial";
})(Severity || (exports.Severity = Severity = {}));
/**
 * Test status
 */
var TestStatus;
(function (TestStatus) {
    TestStatus["PASSED"] = "passed";
    TestStatus["FAILED"] = "failed";
    TestStatus["SKIPPED"] = "skipped";
    TestStatus["TIMEDOUT"] = "timedout";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
//# sourceMappingURL=IReporter.js.map
"use strict";
/**
 * ChronosHandler - Centralized Time Management Utility
 *
 * This utility provides a single source of truth for all time-related operations
 * in the system, ensuring consistent handling of dates, timestamps, and durations.
 * It follows the TIME/Chronos Protocol to guarantee temporal integrity across
 * system boundaries.
 *
 * BOUNDARY CONSCIOUSNESS: This module explicitly acknowledges the boundary between
 * in-memory date representations and their serialized forms, providing explicit
 * methods for crossing these boundaries safely.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChronosHandler = void 0;
var ChronosHandler = /** @class */ (function () {
    function ChronosHandler() {
    }
    /**
     * Get the current date and time
     * Provides a single source of truth for "now" throughout the application
     *
     * @returns Current date and time
     */
    ChronosHandler.now = function () {
        return new Date();
    };
    /**
     * Convert a Date object to ISO8601 string format
     *
     * @param date The date to convert
     * @returns ISO8601 formatted string
     */
    ChronosHandler.toISO = function (date) {
        return date.toISOString();
    };
    /**
     * Convert an ISO8601 string to a Date object
     *
     * @param isoString ISO8601 formatted date string
     * @returns Date object
     */
    ChronosHandler.fromISO = function (isoString) {
        return new Date(isoString);
    };
    /**
     * Calculate the difference between two dates in seconds
     *
     * @param from Starting date
     * @param to Ending date
     * @returns Difference in seconds
     */
    ChronosHandler.diffInSeconds = function (from, to) {
        return (to.getTime() - from.getTime()) / 1000;
    };
    /**
     * Calculate the difference between two dates in milliseconds
     *
     * @param from Starting date
     * @param to Ending date
     * @returns Difference in milliseconds
     */
    ChronosHandler.diffInMilliseconds = function (from, to) {
        return to.getTime() - from.getTime();
    };
    /**
     * Calculate the difference between two dates in minutes
     *
     * @param from Starting date
     * @param to Ending date
     * @returns Difference in minutes
     */
    ChronosHandler.diffInMinutes = function (from, to) {
        return this.diffInSeconds(from, to) / 60;
    };
    /**
     * Calculate the difference between two dates in hours
     *
     * @param from Starting date
     * @param to Ending date
     * @returns Difference in hours
     */
    ChronosHandler.diffInHours = function (from, to) {
        return this.diffInMinutes(from, to) / 60;
    };
    /**
     * Calculate the difference between two dates in days
     *
     * @param from Starting date
     * @param to Ending date
     * @returns Difference in days
     */
    ChronosHandler.diffInDays = function (from, to) {
        return this.diffInHours(from, to) / 24;
    };
    /**
     * Add seconds to a date
     *
     * @param date Base date
     * @param seconds Seconds to add
     * @returns New date with seconds added
     */
    ChronosHandler.addSeconds = function (date, seconds) {
        var result = new Date(date);
        result.setSeconds(result.getSeconds() + seconds);
        return result;
    };
    /**
     * Add minutes to a date
     *
     * @param date Base date
     * @param minutes Minutes to add
     * @returns New date with minutes added
     */
    ChronosHandler.addMinutes = function (date, minutes) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    };
    /**
     * Add hours to a date
     *
     * @param date Base date
     * @param hours Hours to add
     * @returns New date with hours added
     */
    ChronosHandler.addHours = function (date, hours) {
        var result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    };
    /**
     * Add days to a date
     *
     * @param date Base date
     * @param days Days to add
     * @returns New date with days added
     */
    ChronosHandler.addDays = function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };
    /**
     * Validate if a string is a valid ISO8601 format
     *
     * @param isoString String to validate
     * @returns True if valid ISO8601 format
     */
    ChronosHandler.validateISO = function (isoString) {
        // Check basic format
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(isoString)) {
            return false;
        }
        // Validate by parsing
        return !isNaN(Date.parse(isoString));
    };
    /**
     * Format a date for display
     *
     * @param date Date to format
     * @returns Formatted date string
     */
    ChronosHandler.formatDate = function (date) {
        return date.toLocaleDateString();
    };
    /**
     * Format a time for display
     *
     * @param date Date to format
     * @returns Formatted time string
     */
    ChronosHandler.formatTime = function (date) {
        return date.toLocaleTimeString();
    };
    /**
     * Format a date and time for display
     *
     * @param date Date to format
     * @returns Formatted date and time string
     */
    ChronosHandler.formatDateTime = function (date) {
        return date.toLocaleString();
    };
    /**
     * Get the epoch duration in ticks
     */
    ChronosHandler.getEpochDuration = function () {
        return this.epochDuration;
    };
    return ChronosHandler;
}());
exports.ChronosHandler = ChronosHandler;

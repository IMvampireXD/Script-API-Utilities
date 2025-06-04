import { system } from "@minecraft/server";

/**
 * Time Helper Class
 *
 * @author https://github.com/AloneLs
 * @license MIT
 * @description Helper for working with Minecraft's tick-based time system (20 ticks = 1 second).
 */
export class TimeHelper {
  /** Conversion factor: ticks to seconds (20 ticks = 1 second) */
  public static readonly TICKS_PER_SECOND: number = 20;

  /** Conversion factor: seconds to ticks (1 second = 20 ticks) */
  public static readonly SECONDS_PER_TICK: number = 1 / 20;

  /** Conversion factor: ticks to minutes (1200 ticks = 1 minute) */
  public static readonly TICKS_PER_MINUTE: number = 1200;

  /** Conversion factor: ticks to hours (72000 ticks = 1 hour) */
  public static readonly TICKS_PER_HOUR: number = 72000;

  /** Conversion factor: ticks to days (1728000 ticks = 1 day) */
  public static readonly TICKS_PER_DAY: number = 1728000;

  private _ticks: number;

  /**
   * Creates a new TimeHelper instance.
   * @param ticks - The initial time value in ticks. Defaults to the current system time.
   */
  constructor(ticks: number = system.currentTick) {
    this._ticks = ticks;
  }

  // ----------------------------
  // Instance Properties
  // ----------------------------

  /**
   * Gets the time value in ticks.
   */
  public get ticks(): number {
    return this._ticks;
  }

  /**
   * Sets the time value in ticks.
   */
  public set ticks(value: number) {
    this._ticks = value;
  }

  /**
   * Gets the time value in seconds.
   */
  public get seconds(): number {
    return this._ticks * TimeHelper.SECONDS_PER_TICK;
  }

  /**
   * Sets the time value in seconds.
   */
  public set seconds(value: number) {
    this._ticks = value * TimeHelper.TICKS_PER_SECOND;
  }

  /**
   * Gets the time value in minutes.
   */
  public get minutes(): number {
    return this._ticks / TimeHelper.TICKS_PER_MINUTE;
  }

  /**
   * Sets the time value in minutes.
   */
  public set minutes(value: number) {
    this._ticks = value * TimeHelper.TICKS_PER_MINUTE;
  }

  /**
   * Gets the time value in hours.
   */
  public get hours(): number {
    return this._ticks / TimeHelper.TICKS_PER_HOUR;
  }

  /**
   * Sets the time value in hours.
   */
  public set hours(value: number) {
    this._ticks = value * TimeHelper.TICKS_PER_HOUR;
  }

  /**
   * Gets the time value in days.
   */
  public get days(): number {
    return this._ticks / TimeHelper.TICKS_PER_DAY;
  }

  /**
   * Sets the time value in days.
   */
  public set days(value: number) {
    this._ticks = value * TimeHelper.TICKS_PER_DAY;
  }

  // ----------------------------
  // Instance Methods
  // ----------------------------

  /**
   * Adds time to the current instance.
   * @param ticks - The number of ticks to add.
   * @returns The updated TimeHelper instance for chaining.
   */
  public addTicks(ticks: number): this {
    this._ticks += ticks;
    return this;
  }

  /**
   * Adds seconds to the current instance.
   * @param seconds - The number of seconds to add.
   * @returns The updated TimeHelper instance for chaining.
   */
  public addSeconds(seconds: number): this {
    return this.addTicks(seconds * TimeHelper.TICKS_PER_SECOND);
  }

  /**
   * Adds minutes to the current instance.
   * @param minutes - The number of minutes to add.
   * @returns The updated TimeHelper instance for chaining.
   */
  public addMinutes(minutes: number): this {
    return this.addTicks(minutes * TimeHelper.TICKS_PER_MINUTE);
  }

  /**
   * Adds hours to the current instance.
   * @param hours - The number of hours to add.
   * @returns The updated TimeHelper instance for chaining.
   */
  public addHours(hours: number): this {
    return this.addTicks(hours * TimeHelper.TICKS_PER_HOUR);
  }

  /**
   * Adds days to the current instance.
   * @param days - The number of days to add.
   * @returns The updated TimeHelper instance for chaining.
   */
  public addDays(days: number): this {
    return this.addTicks(days * TimeHelper.TICKS_PER_DAY);
  }

  /**
   * Subtracts time from the current instance.
   * @param ticks - The number of ticks to subtract.
   * @returns The updated TimeHelper instance for chaining.
   */
  public subtractTicks(ticks: number): this {
    this._ticks -= ticks;
    return this;
  }

  /**
   * Subtracts seconds from the current instance.
   * @param seconds - The number of seconds to subtract.
   * @returns The updated TimeHelper instance for chaining.
   */
  public subtractSeconds(seconds: number): this {
    return this.subtractTicks(seconds * TimeHelper.TICKS_PER_SECOND);
  }

  /**
   * Subtracts minutes from the current instance.
   * @param minutes - The number of minutes to subtract.
   * @returns The updated TimeHelper instance for chaining.
   */
  public subtractMinutes(minutes: number): this {
    return this.subtractTicks(minutes * TimeHelper.TICKS_PER_MINUTE);
  }

  /**
   * Subtracts hours from the current instance.
   * @param hours - The number of hours to subtract.
   * @returns The updated TimeHelper instance for chaining.
   */
  public subtractHours(hours: number): this {
    return this.subtractTicks(hours * TimeHelper.TICKS_PER_HOUR);
  }

  /**
   * Subtracts days from the current instance.
   * @param days - The number of days to subtract.
   * @returns The updated TimeHelper instance for chaining.
   */
  public subtractDays(days: number): this {
    return this.subtractTicks(days * TimeHelper.TICKS_PER_DAY);
  }

  /**
   * Creates a new TimeHelper instance with the same time value.
   * @returns A new TimeHelper instance.
   */
  public clone(): TimeHelper {
    return new TimeHelper(this._ticks);
  }

  /**
   * Returns a string representation of the time in HH:MM:SS format.
   * @returns The formatted time string.
   */
  public toString(): string {
    return TimeHelper.formatHMS(this._ticks);
  }

  // ----------------------------
  // Static Methods
  // ----------------------------

  /**
   * Gets the current game time in ticks.
   * @returns The current system tick count.
   */
  public static currentTicks(): number {
    return system.currentTick;
  }

  /**
   * Gets the current game time as a TimeHelper instance.
   * @returns A TimeHelper instance representing the current time.
   */
  public static now(): TimeHelper {
    return new TimeHelper(system.currentTick);
  }

  /**
   * Converts ticks to seconds.
   * @param ticks - The time in ticks.
   * @returns The equivalent time in seconds.
   */
  public static ticksToSeconds(ticks: number): number {
    return ticks * this.SECONDS_PER_TICK;
  }

  /**
   * Converts seconds to ticks.
   * @param seconds - The time in seconds.
   * @returns The equivalent time in ticks.
   */
  public static secondsToTicks(seconds: number): number {
    return seconds * this.TICKS_PER_SECOND;
  }

  /**
   * Converts ticks to minutes.
   * @param ticks - The time in ticks.
   * @returns The equivalent time in minutes.
   */
  public static ticksToMinutes(ticks: number): number {
    return ticks / this.TICKS_PER_MINUTE;
  }

  /**
   * Converts minutes to ticks.
   * @param minutes - The time in minutes.
   * @returns The equivalent time in ticks.
   */
  public static minutesToTicks(minutes: number): number {
    return minutes * this.TICKS_PER_MINUTE;
  }

  /**
   * Converts ticks to hours.
   * @param ticks - The time in ticks.
   * @returns The equivalent time in hours.
   */
  public static ticksToHours(ticks: number): number {
    return ticks / this.TICKS_PER_HOUR;
  }

  /**
   * Converts hours to ticks.
   * @param hours - The time in hours.
   * @returns The equivalent time in ticks.
   */
  public static hoursToTicks(hours: number): number {
    return hours * this.TICKS_PER_HOUR;
  }

  /**
   * Converts ticks to days.
   * @param ticks - The time in ticks.
   * @returns The equivalent time in days.
   */
  public static ticksToDays(ticks: number): number {
    return ticks / this.TICKS_PER_DAY;
  }

  /**
   * Converts days to ticks.
   * @param days - The time in days.
   * @returns The equivalent time in ticks.
   */
  public static daysToTicks(days: number): number {
    return days * this.TICKS_PER_DAY;
  }

  /**
   * Formats ticks into a human-readable string (HH:MM:SS).
   * @param ticks - The time in ticks.
   * @returns The formatted time string.
   */
  public static formatHMS(ticks: number): string {
    const totalSeconds = this.ticksToSeconds(ticks);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Formats ticks into a human-readable string with days (DD:HH:MM:SS).
   * @param ticks - The time in ticks.
   * @returns The formatted time string.
   */
  public static formatDHMS(ticks: number): string {
    const days = Math.floor(this.ticksToDays(ticks));
    const remainingTicks = ticks % this.TICKS_PER_DAY;
    const hms = this.formatHMS(remainingTicks);

    return `${days.toString().padStart(2, "0")}:${hms}`;
  }

  /**
   * Delays execution for a specified number of ticks.
   * @param ticks - The number of ticks to delay.
   * @returns A promise that resolves after the delay.
   */
  public static delayTicks(ticks: number): Promise<void> {
    return new Promise((resolve) => {
      system.runTimeout(() => resolve(), ticks);
    });
  }

  /**
   * Delays execution for a specified number of seconds.
   * @param seconds - The number of seconds to delay.
   * @returns A promise that resolves after the delay.
   */
  public static delaySeconds(seconds: number): Promise<void> {
    return this.delayTicks(this.secondsToTicks(seconds));
  }

  /**
   * Delays execution for a specified number of minutes.
   * @param minutes - The number of minutes to delay.
   * @returns A promise that resolves after the delay.
   */
  public static delayMinutes(minutes: number): Promise<void> {
    return this.delayTicks(this.minutesToTicks(minutes));
  }

  /**
   * Creates a timer that runs at a specified interval.
   * @param callback - The function to execute at each interval.
   * @param intervalTicks - The interval in ticks.
   * @returns An object with a dispose method to cancel the timer.
   */
  public static setIntervalTicks(
    callback: () => void,
    intervalTicks: number,
  ): { dispose: () => void } {
    const timer = system.runInterval(callback, intervalTicks);
    return {
      dispose: () => system.clearRun(timer),
    };
  }

  /**
   * Creates a timer that runs at a specified interval in seconds.
   * @param callback - The function to execute at each interval.
   * @param intervalSeconds - The interval in seconds.
   * @returns An object with a dispose method to cancel the timer.
   */
  public static setIntervalSeconds(
    callback: () => void,
    intervalSeconds: number,
  ): { dispose: () => void } {
    return this.setIntervalTicks(callback, this.secondsToTicks(intervalSeconds));
  }

  /**
   * Creates a timer that runs once after a delay.
   * @param callback - The function to execute after the delay.
   * @param delayTicks - The delay in ticks.
   * @returns An object with a dispose method to cancel the timer.
   */
  public static setTimeoutTicks(callback: () => void, delayTicks: number): { dispose: () => void } {
    const timer = system.runTimeout(callback, delayTicks);
    return {
      dispose: () => system.clearRun(timer),
    };
  }

  /**
   * Creates a timer that runs once after a delay in seconds.
   * @param callback - The function to execute after the delay.
   * @param delaySeconds - The delay in seconds.
   * @returns An object with a dispose method to cancel the timer.
   */
  public static setTimeoutSeconds(
    callback: () => void,
    delaySeconds: number,
  ): { dispose: () => void } {
    return this.setTimeoutTicks(callback, this.secondsToTicks(delaySeconds));
  }
}

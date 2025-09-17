
/**
 * A simple class to measure the time it takes to perform an operation.
 */
export class Timings {
	static lastTime = -1;
	static lastOperation = '';

	/**
	 * Begin measuring the time it takes to perform an operation.
	 * @remarks
	 * If another operation is already being measured, the measurement will be ended.
	 *
	 * @param operation The name of the operation.
	 */
	static begin(operation) {
		this.end();
		this.lastTime = new Date().getTime();
		this.lastOperation = operation;
	}

	/**
	 * End measuring the time it takes to perform an operation and log the result.
	 * @remarks
	 * If no operation is being measured, this method will do nothing.
	 */
	static end() {
		const time = new Date().getTime();
		if (this.lastTime > 0) {
			Timings.log.debug(
				`Operation ${this.lastOperation} took ${time - this.lastTime}ms`
			);
		}
		this.lastTime = -1;
	}
}

export class TimeUtils {

	/**
	 * Delays execution for a number of game ticks.
	 * @param {number} ticks Number of ticks to wait (1 tick = 20 sec)
	 * @returns {Promise<void>}
	 */
	static sleep(ticks) {
		return new Promise((resolve) => system.runTimeout(resolve, ticks));
	}

	/**
	 * Repeats a callback a specified number of times.
	 * @param {() => void} callback The function to run
	 * @param {number} times Number of times to run the function
	 */
	static repeat(callback, times) {
		for (let i = 0; i < times; i++) {
			callback();
		}
	}

	/**
	 * 
	 * Convert milliseconds into game ticks.
	 * @param {number} milliseconds- Time in milliseconds.
	 * @returns {number} Number of game ticks.
	 * @example
	 * fromMillisecondsToTicks(1000) // => 20
	 * fromMillisecondsToTicks(500)  // => 10
	 */
	static fromMillisecondsToTicks(milliseconds) {
		return Math.floor(milliseconds / (1000 / 20))
	}

	/**
	 * Converts hours to seconds.
	 * @param {number} hours - The number of hours to convert.
	 * @returns {number} The equivalent number of seconds.
	 * @remarks 1 hour is equal to 3600 seconds.
	 */
	static fromHoursToSecs(hours) {
		return hours * 3600;
	}

	/**
	 * Converts minutes to seconds.
	 * @param {number} minutes - The number of minutes to convert.
	 * @returns {number} The equivalent number of seconds.
	 * @remarks 1 minute is equal to 60 seconds.
	 */
	static fromMinsToSecs(minutes) {
		return minutes * 60;
	}

	/**
	 * Converts days to seconds.
	 * @param {number} days - The number of days to convert.
	 * @returns {number} The equivalent number of seconds.
	 * @remarks 1 day is equal to 86400 seconds.
	 */
	static fromDaysToSecs(days) {
		return days * 86400;
	}

	/**
	 * Converts milliseconds to seconds.
	 * @param {number} milliseconds - The number of milliseconds to convert.
	 * @returns {number} The equivalent number of seconds.
	 * @remarks 1000 milliseconds are equal to 1 second.
	 */
	static fromMillisToSecs(milliseconds) {
		return milliseconds / 1000;
	}

	/**
	 * Converts Minecraft ticks to seconds.
	 * @param {number} ticks - The number of Minecraft ticks to convert.
	 * @returns {number} The equivalent number of seconds.
	 * @remarks 20 Minecraft ticks are equal to 1 second.
	 */
	static fromTicksToSecs(ticks) {
		return ticks / 20;
	}

	/**
	 * Converts seconds to hours.
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {number} The equivalent number of hours.
	 * @remarks 3600 seconds are equal to 1 hour.
	 */
	static fromSecsToHours(seconds) {
		return seconds / 3600;
	}

	/**
	 * Converts seconds to minutes.
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {number} The equivalent number of minutes.
	 * @remarks 60 seconds are equal to 1 minute.
	 */
	static fromSecsToMins(seconds) {
		return seconds / 60;
	}

	/**
	 * Converts seconds to days.
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {number} The equivalent number of days.
	 * @remarks 86400 seconds are equal to 1 day.
	 */
	static fromSecsToDays(seconds) {
		return seconds / 86400;
	}

	/**
	 * Converts seconds to milliseconds.
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {number} The equivalent number of milliseconds.
	 * @remarks 1 second is equal to 1000 milliseconds.
	 */
	static fromSecsToMillis(seconds) {
		return seconds * 1000;
	}

	/**
	 * Converts seconds to Minecraft ticks.
	 * @param {number} seconds - The number of seconds to convert.
	 * @returns {number} The equivalent number of Minecraft ticks.
	 * @remarks 1 second is equal to 20 Minecraft ticks.
	 */
	static fromSecondsToTicks(seconds) {
		return seconds * 20;
	}
}
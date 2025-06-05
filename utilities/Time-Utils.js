class TimeUtils {
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

export default TimeUtils;

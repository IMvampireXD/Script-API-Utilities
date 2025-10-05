export class Lerp {

	static lerp(a, b, t) {
		return a + (b - a) * t;
	}
	static sigmoidLerp(a, b, t, curveFactor = 2) {
		const midpoint = 0.5;
		const distanceToMid = Math.abs(b - midpoint);
		const easeFactor = 1 - Math.pow(distanceToMid * 2, curveFactor);
		const adaptiveT = 0.02 + easeFactor * 0.2;
		return a + (b - a) * adaptiveT;
	}
	static cuboidLerp(a, b, t) {
		return a + (b - a) * (4 * Math.pow(t - 0.5, 3) + 0.5);
	}
	static directionalLerp(a, b, t) {
		const optimal = 0.2;
		const movingTowards = Math.abs(b - optimal) < Math.abs(a - optimal);
		const slowSpeed = 0.15;
		const fastSpeed = 1.0;
		const k = movingTowards ? fastSpeed : slowSpeed;
		const frac = Math.min(1, k * t);

		return a + (b - a) * frac;
	}
}

export class MathUtils {

	static roundToNearestQuarter(value) {
		return ((value * 4 + 0.5) | 0) / 4;
	}

	static roundToDecimal(value, decimalPlaces) {
		const multiplier = 10 ** decimalPlaces;
		return Math.round(value * multiplier) / multiplier;
	}

	// dist/minecraft-math.js -> lib/general/clamp.js
	static clampNumber(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}

	/**
	 * Converts degrees to radians
	 * @param {number} degrees The angle in degrees
	 * @returns The angle in radians
	 */
	static toRadians(degrees) {
		return (degrees * Math.PI) / 180;
	}

	/**
	 * Converts radians to degrees
	 * @param {number} radians The angle in degrees
	 * @returns The angle in degrees
	 */
	static toDegrees(radians) {
		return (radians * 180) / Math.PI;
	}
}

export class AngleUtils {
	/**
	 * Finds the X-Z angle (yaw) between to Vectors. 0 degrees is at Z
	 * @param {import("@minecraft/server").Vector3} a
	 * @param {import("@minecraft/server").Vector3} b
	 */
	static findYawBetween(a, b) {
		const dx = -a.x + b.x;
		const dz = -a.z + b.z;

		const angle = MathUtils.toDegrees(Math.atan2(dz, dx));

		return angle;
	}

	/**
	 * Finds the Y angle (pitch) between to Vectors.
	 * @param {import("@minecraft/server").Vector3} a
	 * @param {import("@minecraft/server").Vector3} b
	 */
	static findPitchBetween(a, b) {
		const dx = -a.x + b.x;
		const dz = -a.z + b.z;
		const dy = -a.y + b.y;

		const d = Math.sqrt(dx * dx + dz * dz);

		const angle = MathUtils.toDegrees(Math.atan2(dy, d));

		return angle;
	}

	/**
	 * Interpolates 2 angles on a circular board in the shortest path
	 * @param {number} a
	 * @param {number} b
	 * @param {number} t
	 * @returns {number} the interpolated value
	 */
	static interpolateCircular(a, b, t) {
		let delta = b - a;

		if (delta > 180) delta -= 360;
		if (delta < 180) delta += 360;

		return a + delta * t;
	}

	static normalizeAngle(angle) {
		return ((angle + 180) % 360) - 180;
	}

	static angularDifference(angle1, angle2) {
		let diff = normalizeAngle(angle1 - angle2);
		return Math.abs(diff);
	}

	static isAngleInRange(angle, centerAngle, range) {
		const diff = angularDifference(angle, centerAngle);
		return diff <= range / 2;
	}

}

/**
 * Random Utility Class
 * @author https://github.com/IWantANeko
 * @license MIT
 * @description set of useful random functions (int, float, range, chance, get, weighted).
 */
export class Random {
	constructor() {
		throw new Error("Random is a static utility class and cannot be instantiated.");
	}

	/**
	 * Returns a random integer between min and max (inclusive).
	 * @param {number} min - Minimum integer value.
	 * @param {number} max - Maximum integer value.
	 * @returns {number}
	 */
	static int(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Returns a random float between min and max.
	 * @param {number} min - Minimum float value.
	 * @param {number} max - Maximum float value.
	 * @returns {number}
	 */
	static float(min, max) {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Returns a random float between -range and +range.
	 * @param {number} range - The range limit.
	 * @returns {number}
	 */
	static range(range) {
		return Math.random() * 2 * range - range;
	}

	/**
	 * Returns true with the given probability.
	 * @param {number} chance - A value between 0 and 1 representing the probability.
	 * @returns {boolean}
	 */
	static chance(chance) {
		return Math.random() <= chance;
	}

	/**
	 * Returns a random element from the given arguments.
	 * @template T
	 * @param {...T} args - Elements to choose from.
	 * @returns {T}
	 */
	static get(...args) {
		return args[this.int(0, args.length - 1)];
	}

	/**
	 * Returns a random value based on weighted probabilities.
	 * @template T
	 * @param {...{ weight: number, value: T }} chances - Weighted values.
	 * @returns {T}
	 */
	static weighted(...chances) {
		if (chances.length === 1) return chances[0].value;
		const totalWeight = chances.reduce((sum, chance) => sum + chance.weight, 0);
		for (const chance of chances) {
			if (this.chance(chance.weight / totalWeight)) {
				return chance.value;
			}
		}
		return chances[0].value;
	}
}

/**
 * Represents a numeric range with a minimum and maximum value.
 * @author https://github.com/IWantANeko
 * @license MIT
 */
export class NumberRange {
	/**
	 * @param {number} min - The minimum value of the range.
	 * @param {number} max - The maximum value of the range.
	 */
	constructor(min, max) {
		/** @readonly @type {number} */
		this.min = min;
		/** @readonly @type {number} */
		this.max = max;
	}

	/**
	 * Get a random integer within the range (inclusive).
	 * @returns {number} Random integer between min and max.
	 * @example
	 * new NumberRange(1, 6).getRandomValue()
	 */
	getRandomValue() {
		const min = Math.ceil(this.min);
		const max = Math.floor(this.max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Returns the median value of the number range.
	 *
	 * @returns {number} The median of the range.
	 *
	 * @example
	 * new NumberRange(1,3).getMedian() // returns 2
	 */
	getMedian() {
		return (this.min + this.max) / 2;
	}

	/**
	 * Returns the range as a tuple array [min, max].
	 * @returns {[number, number]}
	 */
	toArray() {
		return [this.min, this.max];
	}

	/**
	 * Returns the range as a string, separated by the provided separator.
	 * @param {string} [separator=', '] - The separator string.
	 * @returns {string}
	 */
	toString(separator = ", ") {
		return `${this.min}${separator}${this.max}`;
	}

	/**
	 * Returns a copy of the current range.
	 * @returns {NumberRange}
	 */
	copy() {
		return new NumberRange(this.min, this.max);
	}

	/**
	 * Checks whether a number is within the range (inclusive).
	 * @param {number} value - The number to check.
	 * @returns {boolean}
	 */
	isInRange(value) {
		return value >= this.min && value <= this.max;
	}

	/**
	 * Returns how far the value is outside the range.
	 * Returns 0 if the value is within the range.
	 * @param {number} value - The number to evaluate.
	 * @returns {number}
	 */
	offset(value) {
		return value < this.min ? this.min - value : value > this.max ? value - this.max : 0;
	}

	/**
	 * Clamps the value to the range.
	 * If it's below min, returns min. If above max, returns max.
	 * @param {number} value - The number to clamp.
	 * @returns {number}
	 */
	cut(value) {
		return value < this.min ? this.min : value > this.max ? this.max : value;
	}
}

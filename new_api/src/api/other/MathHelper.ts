/**
 * Math Helper Class
 * 
 * @author https://github.com/IWantANeko (Recoded by https://github.com/AloneLs)
 * @license MIT
 * @description Represents a numeric range with utility methods for randomization and calculations.
 */
export class MathHelper {
    /** @readonly @type {number} */
    public readonly min: number;
    /** @readonly @type {number} */
    public readonly max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    /* ------------------------- */
    /*   Instance Methods        */
    /* ------------------------- */

    /**
     * Returns the median value of the number range.
     * @returns {number} The median of the range.
     * @example new NumberRange(1,3).getMedian() // returns 2
     */
    public getMedian(): number {
        return (this.min + this.max) / 2;
    }

    /**
     * Returns the range as a tuple array [min, max].
     * @returns {[number, number]}
     */
    public toArray(): [number, number] {
        return [this.min, this.max];
    }

    /**
     * Returns the range as a string, separated by the provided separator.
     * @param {string} [separator=', '] - The separator string.
     * @returns {string}
     */
    public toString(separator: string = ', '): string {
        return `${this.min}${separator}${this.max}`;
    }

    /**
     * Returns a copy of the current range.
     * @returns {MathHelper}
     */
    public copy(): MathHelper {
        return new MathHelper(this.min, this.max);
    }

    /**
     * Checks whether a number is within the range (inclusive).
     * @param {number} value - The number to check.
     * @returns {boolean}
     */
    public isInRange(value: number): boolean {
        return value >= this.min && value <= this.max;
    }

    /**
     * Returns how far the value is outside the range.
     * Returns 0 if the value is within the range.
     * @param {number} value - The number to evaluate.
     * @returns {number}
     */
    public offset(value: number): number {
        return value < this.min ? this.min - value : value > this.max ? value - this.max : 0;
    }

    /**
     * Clamps the value to the range.
     * If it's below min, returns min. If above max, returns max.
     * @param {number} value - The number to clamp.
     * @returns {number}
     */
    public cut(value: number): number {
        return value < this.min ? this.min : value > this.max ? this.max : value;
    }

    /**
     * Returns a random integer between the instance's min and max (inclusive).
     * @returns {number}
     */
    public int(): number {
        return MathHelper.int(this.min, this.max);
    }

    /**
     * Returns a random float between the instance's min and max.
     * @returns {number}
     */
    public float(): number {
        return MathHelper.float(this.min, this.max);
    }

    /**
     * Returns a random float between -(max - min) and +(max - min).
     * @returns {number}
     */
    public range(): number {
        return MathHelper.range(this.max - this.min);
    }

    /**
     * Returns true with the given probability.
     * @param {number} chance - A value between 0 and 1 representing the probability.
     * @returns {boolean}
     */
    public chance(chance: number): boolean {
        return MathHelper.chance(chance);
    }

    /**
     * Returns a random element from the given arguments.
     * @template T
     * @param {...T} args - Elements to choose from.
     * @returns {T}
     */
    public get<T>(...args: T[]): T | undefined {
        return MathHelper.get(...args);
    }

    /**
     * Returns a random value based on weighted probabilities.
     * @template T
     * @param {...{ weight: number, value: T }} chances - Weighted values.
     * @returns {T}
     */
    public weighted<T>(...chances: { weight: number; value: T }[]): T | undefined {
        return MathHelper.weighted(...chances);
    }

    /* ------------------------- */
    /*   Static Methods          */
    /* ------------------------- */

    /**
     * Returns a random integer between min and max (inclusive).
     * @param {number} min - Minimum integer value.
     * @param {number} max - Maximum integer value.
     * @returns {number}
     */
    public static int(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Returns a random float between min and max.
     * @param {number} min - Minimum float value.
     * @param {number} max - Maximum float value.
     * @returns {number}
     */
    public static float(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random float between -range and +range.
     * @param {number} range - The range limit.
     * @returns {number}
     */
    public static range(range: number): number {
        return Math.random() * 2 * range - range;
    }

    /**
     * Returns true with the given probability.
     * @param {number} chance - A value between 0 and 1 representing the probability.
     * @returns {boolean}
     */
    public static chance(chance: number): boolean {
        return Math.random() <= chance;
    }

    /**
     * Returns a random element from the given arguments.
     * @template T
     * @param {...T} args - Elements to choose from.
     * @returns {T}
     */
    public static get<T>(...args: T[]): T | undefined {
        return args[this.int(0, args.length - 1)];
    }

    /**
     * Returns a random value based on weighted probabilities.
     * @template T
     * @param {...{ weight: number, value: T }} chances - Weighted values.
     * @returns {T}
     */
    public static weighted<T>(...chances: { weight: number; value: T }[]): T | undefined {
        if (chances.length === 0) return undefined;
        if (chances.length === 1) return chances[0]!.value;

        const totalWeight = chances.reduce((sum, chance) => sum + chance.weight, 0);

        for (const chance of chances) {
            if (this.chance(chance.weight / totalWeight))
                return chance.value;
        }

        return chances[0]!.value;
    }

    /**
     * @param {number} x - The number that will be modified
     * @param {number} decimal - The number of decimal places to keep
     * @example
     * trunc(5.1617667, 2)  //output: 5.16
     */
    public static trunc(x: number, decimal: number) {
        let y = 10 ** decimal;
        return Math.trunc(x * y) / y;
    }

    /**
     * Clamps a number between min and max values
     * @param val - Value to clamp
     * @param min - Minimum bound
     * @param max - Maximum bound
     * @returns Clamped value
     */
    public static clampNumber(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }
}
export class ArrayUtils {

	/**
	 * Randomly shuffle the elements of an array, using the Fisher-Yates algorithm.
	 * 
	 * @param {Array} array - The array to shuffle.
	 * @returns {Array} A new array with elements shuffled randomly.
	 */
	static shuffleArray(array) {
		const result = [...array];
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	}

	/**
	 * Gets a random element from an array.
	 * 
	 * @example
	 * const colors = ['red', 'green', 'blue'];
	 * const randomColor = ArrayUtils.getRandomElement(colors);
	 * console.log(randomColor); // e.g. 'green'
	 */
	static getRandomElement(array) {
		if (!Array.isArray(arr) || array.length === 0) return undefined;
		const index = Math.floor(Math.random() * array.length);
		return array[index];
	}

	/**
	 * Removes an element from an array at a specified index by using the swap-pop technique:
	 * swaps it with the last element, then pops (O(1)). Order is NOT preserved.
	 * @param {Array} array - The array to remove an element from.
	 * @param {number} index - The index of the element to remove.
	 * @returns {boolean} `true` if an element was removed, or `false` if index invalid.
	 */
	static swapPop(array, index) {
		const lastIndex = array.length - 1;
		if (index < 0 || index > lastIndex) return false;
		if (lastIndex !== index) array[index] = array[lastIndex];
		array.pop();
		return true;
	}
}

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
}

export class ObjectUtils {
	/**
	 * Creates a deep clone of an object using JSON serialization
	 * allowing not to edit original object when modifying the deep cloned object
	 */
	static deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	/**
	 * Returns boolean whether the value is a plain object or not.
	 */
	static isObject(value) {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}

}

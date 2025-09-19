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

	/**
	 * @author ConMaster2112
	 * 
	 * Useful for dynamically enhancing objects and prototypes,
	 * allowing flexible inheritance and method overriding.
	 */
	static OverTakesJS(prototype, object) {
		const clone = Object.create(Object.getPrototypeOf(prototype), Object.getOwnPropertyDescriptors(prototype));
		Object.setPrototypeOf(object, clone);
		Object.defineProperties(prototype, Object.getOwnPropertyDescriptors(object));
		return clone;
	}

	/**
	 * @author frostice482
	 *
	 * Renames function name
	 * @param fn Function
	 * @param name New function name
	 * @returns function
	 */
	static renameFn(fn, name) {
		return Object.defineProperty(fn, "name", { value: name });
	}

	/**
	 * Finds keys in an object where the value contains the given string.
	 * @param {string} string The string to search for
	 * @param {Object.<string, string[]>} obj The object to search in
	 * @returns {string[]} Matching keys
	 */
	static getKey(string, obj) {
		return Object.keys(obj).filter((s) => obj[s].includes(string));
	}

}

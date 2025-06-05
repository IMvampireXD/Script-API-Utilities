export class StringUtils {

	/**
	 * Check whether the value is a string or not. 
	 * @returns {boolean}
	 */
	static isString(value) {
		return typeof value === 'string' || value instanceof String;
	}

	/**
	 * Converts a string to a typeId format.
	 * Example: "The End" -> "the_end"
	 * @param {string} string
	 * @returns {string} typeId
	 */
	static formatToTypeId(string) {
		return string
			.replace(/§[0-9a-frkuonm]/gi, "")
			.replace(/[^\w\s]/g, "")
			.trim()
			.replace(/\s+/g, "_")
			.toLowerCase();
	}

	/**
	 * Converts a typeId to a display name format.
	 * Example: "the_end" -> "The End"
	 * @param {string} typeId
	 * @returns {string} string
	 */
	static formatToDisplayName(typeId) {
		return typeId
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	/**
	 * Returns an random string as of specifed length
	 * @author frostice482
	 * @param {number} length Length of string
	 * @returns {string} Random string
	 */
	static randomString(
		length,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	) {
		const arr = Array(length);
		const clen = charset.length;
		for (let i = 0; i < length; i++) arr[i] = charset[Math.floor(Math.random() * clen)];
		return arr.join("");
	}

	/**
	 * Converts a Roman numeral to an integer.
	 * @param {string} roman - Roman number
	 * @returns {number} Integer
	 */
	static romanToInt(roman) {
		const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
		roman = roman.toUpperCase();
		let n = 0;
		for (let i = 0; i < roman.length; i++) {
			const curr = m[roman[i]],
				next = m[roman[i + 1]];
			n += next > curr ? -curr : curr;
		}
		return n;
	}

	/**
	 * Converts an integer to Roman numeral.
	 * @param {number} int - Integer
	 * @param {boolean} toLowerCase - If true, returns lowercase output.
	 * @returns {string} - Roman number string.
	 */
	static intToRoman(int, toLowerCase = false) {
		const v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
			s = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
		let r = "";
		for (let i = 0; i < v.length; i++) while (int >= v[i]) (r += s[i]), (int -= v[i]);
		return toLowerCase ? r.toLowerCase() : r;
	}

	/**
	 * Gets the first letter of each words in string.
	 * @author Remember M9
	 * @example
	 * const initials = initialsOf('§3§lMinecraft Bedrock addons§r'); // output: 'MBA'
	 *
	 * @param {string} text - String to get several words from
	 * @param {number} length - Max string length to return
	 */
	static initialsOf(text = "", length = 3) {
		const space = /\s+/g;
		const post = /\s+|§./g;
		const invalid = /\"|\\/;
		let result = "";
		if (
			invalid.test(text) ||
			text.length > 30 ||
			(text = text?.replace?.(post, " ").trim() ?? "").split(space).join("").length < 4
		) {
			throw new Error("Create a different Name!");
		}
		result = text.split(space).reduce((res, s) => res + s[0], "");
		if (result.length <= 1) result += text.replace(space, "")[1];
		return result.substring(0, length).toUpperCase();
	}

	/**
	 * Get the byte size of a string.
	 * @param {string} str - The input string.
	 * @returns {number} - The byte size of the string.
	 */
	static getByteSize(str) {
		let byteSize = 0;

		for (let i = 0; i < str.length; i++) {
			const charCode = str.charCodeAt(i);
			// Count each byte based on UTF-8 encoding rules
			if (charCode <= 0x7f) {
				byteSize += 1;
			} else if (charCode <= 0x7ff) {
				byteSize += 2;
			} else if (charCode <= 0xffff) {
				byteSize += 3;
			} else {
				byteSize += 4;
			}
		}
		return byteSize;
	}

	/**
	 * Split a string into chunks with a maximum byte size.
	 * @param {string} str - The input string.
	 * @param {number} chunkSize - The maximum byte size for each chunk.
	 * @returns {string[]} - An array of string chunks.
	 */
	static splitStringIntoChunks(str, chunkSize) {
		const chunks = [];
		let currentChunk = "";

		for (let i = 0; i < str.length; i++) {
			const char = str[i];
			const charCode = char.charCodeAt(0);
			if ((currentChunk.length + char.length) * 2 > chunkSize) {
				chunks.push(currentChunk);
				currentChunk = "";
			}
			currentChunk += char;
		}
		if (currentChunk.length > 0) {
			chunks.push(currentChunk);
		}
		return chunks;
	}

	/**
	 * Splits a string by separator
	 *
	 * @param {string} input - The string to split
	 * @param {string} separator - The separator to split by
	 * @returns {string[]} Array of split strings
	 *
	 * @throws {Error} If input or separator are not strings
	 */
	static splitBySeparator(input, separator = ":/:") {
		if (typeof input !== "string" || typeof separator !== "string") {
			throw new Error("Argument must be string");
		}
		if (separator === "") {
			return [input];
		}

		return input
			.split(separator)
			.map((part) => part.trim())
			.filter((part) => part.length > 0);
	}
}

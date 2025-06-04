/**
 * String Helper Class
 *
 * @author https://github.com/IWantANeko, frostice482, Remember M9 (Recoded by https://github.com/AloneLs)
 * @license MIT
 * @description Set of useful string manipulation and formatting functions
 */
export class StringHelper {
  // Private constants
  private static readonly RomanSymbols: { value: number; symbol: string }[] = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  /**
   * Converts a string to a typeId format.
   * Example: "The End" -> "the_end"
   * @param {string} string - The input string to convert
   * @returns {string} The formatted typeId string
   */
  public static formatToTypeId(string: string): string {
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
   * @param {string} typeId - The typeId string to convert
   * @returns {string} The formatted display name
   */
  public static formatToDisplayName(typeId: string): string {
    return typeId
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Generates a random string of specified length
   * @author frostice482
   * @param {number} length - Length of the output string
   * @param {string} [charset="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"] - Character set to use
   * @returns {string} Randomly generated string
   */
  public static randomString(
    length: number,
    charset: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ): string {
    const arr = Array(length);

    for (let i = 0; i < length; i++) {
      arr[i] = charset[Math.floor(Math.random() * charset.length)];
    }

    return arr.join("");
  }

  /**
   * Converts a Roman numeral to an integer
   * @param {string} roman - Roman numeral string
   * @returns {number} Converted integer value
   * @throws {Error} If input contains invalid Roman numerals
   */
  public static romanToInt(roman: string): number {
    if (typeof roman !== "string") throw new Error("Input must be a string");

    const normalized = roman.toUpperCase().trim();

    if (normalized.length === 0) throw new Error("Input string cannot be empty");

    const validChars = ["I", "V", "X", "L", "C", "D", "M"] as const;
    type RomanChar = (typeof validChars)[number];

    const valueMap: Record<RomanChar, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let total = 0;
    let prevValue = 0;

    for (let i = normalized.length - 1; i >= 0; i--) {
      const char = normalized[i] as RomanChar;

      if (!validChars.includes(char)) throw new Error(`Invalid Roman numeral character: ${char}`);

      const currentValue = valueMap[char];

      if (currentValue < prevValue) total -= currentValue;
      else total += currentValue;

      prevValue = currentValue;
    }

    if (this.intToRoman(total) !== normalized) throw new Error("Invalid Roman numeral sequence");

    return total;
  }

  /**
   * Converts an integer to Roman numeral
   * @param {number} num - Integer to convert
   * @param {boolean} [toLowerCase=false] - Whether to return lowercase result
   * @returns {string | number} Roman numeral string. Number if num > 3999.
   */
  public static intToRoman(num: number, toLowerCase: boolean = false): string | number {
    if (!Number.isInteger(num)) throw new Error("Input must be an integer");

    if (num < 1 || num > 3999) return num;

    let result = "";
    let remaining = num;

    for (const { value, symbol } of this.RomanSymbols) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
      }

      if (remaining === 0) break;
    }

    return toLowerCase ? result.toLowerCase() : result;
  }

  /**
   * Gets the first letter of each word in a string
   * @author Remember M9
   * @example
   * const initials = StringHelper.initialsOf('§3§lMinecraft Bedrock addons§r'); // returns 'MBA'
   * @param {string} [text=""] - Input string
   * @param {number} [length=3] - Maximum length of output string
   * @returns {string} Initials string
   * @throws {Error} If input is invalid
   */
  public static initialsOf(text: string = "", length: number = 3): string {
    const space = /\s+/g;
    const post = /\s+|§./g;

    let result = "";

    if (
      /\"|\\/.test(text) ||
      text.length > 30 ||
      (text = text?.replace?.(post, " ").trim() ?? "").split(space).join("").length < 4
    )
      throw new Error("Create a different Name!");

    result = text.split(space).reduce((res, s) => res + s[0], "");

    if (result.length <= 1) result += text.replace(space, "")[1];

    return result.substring(0, length).toUpperCase();
  }

  /**
   * Formats a number with thousands separators
   * @example
   * StringHelper.formatNumber(1234567); // returns "1,234,567"
   * @param {number} number - Number to format
   * @returns {string} Formatted number string
   */
  public static formatNumber(number: number): string {
    const string = String(number);

    let result = "";

    for (let i = string.length - 1, j = 0; i >= 0; i--, j++) {
      result = string[i] + result;

      if ((j + 1) % 3 === 0 && i !== 0) result = "," + result;
    }

    return result;
  }
}

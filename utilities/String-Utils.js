export class StringUtils {
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
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Returns an random string as of specifed length
      * @author frostice482
      * @param {number} length Length of string
      * @returns {string} Random string 
      */
    static randomString(length, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
        const arr = Array(length)
        const clen = charset.length
        for (let i = 0; i < length; i++) arr[i] = charset[Math.floor(Math.random() * clen)]
        return arr.join("")
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
            const curr = m[roman[i]], next = m[roman[i + 1]];
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
        for (let i = 0; i < v.length; i++)
            while (int >= v[i]) r += s[i], int -= v[i];
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
    static initialsOf(text = '', length = 3) {
        const space = /\s+/g;
        const post = /\s+|§./g;
        const invalid = /\"|\\/;
        let result = '';
        if (invalid.test(text) || text.length > 30 || (text = text?.replace?.(post, ' ').trim() ?? '').split(space).join('').length < 4) {
            throw new Error('Create a different Name!');
        }
        result = text.split(space).reduce((res, s) => res + s[0], '');
        if (result.length <= 1) result += text.replace(space, '')[1];
        return result.substring(0, length).toUpperCase();
    }

}

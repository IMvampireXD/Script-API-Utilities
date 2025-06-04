class NumberUtils {
  static abbreviateNumber(value) {
    if (value >= 1000) {
      const suffixes = ["", "k", "M", "B", "T"];
      const suffixNum = Math.floor(("" + value).length / 3);
      let shortValue = parseFloat(
        (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2),
      );
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
      }
      return shortValue + suffixes[suffixNum];
    }
    return value;
  }
  /**
   * Formats a given number by inserting commas as thousands separators.
   *
   * @param {number} number - The number to format.
   * @returns {string} The formatted number as a string with commas.
   *
   * @example
   * formatNumber(1234567); // Returns "1,234,567"
   *
   */
  static formatNumber(number) {
    const string = String(number);
    let out = "";

    for (let i = string.length - 1, j = 0; i >= 0; i--, j++) {
      out = string[i] + out;
      if ((j + 1) % 3 === 0 && i !== 0) {
        out = "," + out;
      }
    }
    return out;
  }
}

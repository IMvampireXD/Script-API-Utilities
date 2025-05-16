class NumberUtils {
  static abbreviateNumber(value) {
    if (value >= 1000) {
      const suffixes = ['', 'k', 'M', 'B', 'T'];
      const suffixNum = Math.floor(('' + value).length / 3);
      let shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
      }
      return shortValue + suffixes[suffixNum];
    }
    return value;
  }
}

export default class MathExtended {
  public static percentageChange(a: number, b: number) {
    if (a === 0) {
      if (b === 0) {
        return 0
      }
      return Infinity
    }
    return ((b - a) / a) * 100
  }
}

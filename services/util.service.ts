export class UtilService {
  static cleanArray<T>(arr: T[]) {
    return arr.filter(item => Boolean(item));
  }
}

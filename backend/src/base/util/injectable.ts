export function Injectable() {
  return function (target: object) {
    void target
  }
}

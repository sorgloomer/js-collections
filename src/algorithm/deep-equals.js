export function deep_equals(a, b) {

  function compare(a, b) {
    return a === b;
  }

  return compare(a, b);
}
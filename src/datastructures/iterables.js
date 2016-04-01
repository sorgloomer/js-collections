export function* map(iterable, fn) {
  for (let x of iterable) yield fn(x);
}

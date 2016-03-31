export function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function comparisonBy_f(selector) {
  return (a, b) => compare(selector(a), selector(b));
}

function comparisonBy_s(pluck) {
  return comparisonBy_f(x => x[pluck]);
}

export function comparisonBy(selector) {
  if (typeof selector === "function") {
    return comparisonBy_f(selector);
  } else {
    return comparisonBy_s(selector);
  }
}

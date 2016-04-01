
import { compare } from "./utils";


export const DefaultRing = Object.freeze({
  sub(a, b) { return this.add(a, this.invert(b)); }
});

export const RealRing = Object.freeze({
  __proto__: DefaultRing,
  zero: 0,
  compare,
  add(a, b) { return a + b; },
  invert(x) { return -x; }
});

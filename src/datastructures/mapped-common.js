import { map } from "iterables";
import { stable_stringify } from "stable-json";

export function transformValues(coll, mapper) {
  return map(coll.values(), mapper);
}


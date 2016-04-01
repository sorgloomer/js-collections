import { map } from "iterables";
import { stable_stringify } from "stable-json";
import { transformValues } from "mapped-common";

export class MappedMap {
  constructor(iterable = null, mapper = stable_stringify) {
    this._map = new Map();
    this._mapper = mapper;

    if (iterable) {
      this.setAll(iterable);
    }
  }

  clear() {
    return this._map.clear();
  }
  get size() {
    return this._map.size;
  }

  has(key) {
    return this._map.has(this._mapper(key));
  }

  set(key, value) {
    return this._map.set(this._mapper(key), [key, value]);
  }

  setAll(iterable) {
    for (let item of iterable) {
      this.set(item[0], item[1]);
    }
  }

  delete(key) {
    return this._map.delete(this._mapper(key));
  }

  entries() {
    return transformValues(this, x => [x[0], x[1]]);
  }
  keys() {
    return transformValues(this, x => x[0]);
  }
  values() {
    return transformValues(this, x => x[1]);
  }
  forEach(fn, thisArg) {
    this._map.forEach((k,v) => fn(v[0], v[1], this), thisArg);
  }
}

const MappedMap_prototype = MappedMap.prototype;
MappedMap_prototype[Symbol.iterator] = MappedMap_prototype.entries;


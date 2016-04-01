import { map } from "iterables";
import { stable_stringify } from "stable-json";
import { transformValues } from "mapped-common";

export class MappedSet {
  constructor(iterable = null, mapper = stable_stringify) {
    this._map = new Map();
    this._mapper = mapper;

    if (iterable) {
      this.addAll(iterable);
    }
  }

  clear() {
    return this._map.clear();
  }
  get size() {
    return this._map.size;
  }

  has(item) {
    return this._map.has(this._mapper(item));
  }

  add(item) {
    return this._map.set(this._mapper(item), item);
  }

  addAll(iterable) {
    for (let item of iterable) {
      this.add(item);
    }
  }

  delete(item) {
    return this._map.delete(this._mapper(item));
  }


  _transformValues(mapper) {
    return map(this._map.values(), mapper);
  }

  entries() {
    return this._transformValues(v => [v, v]);
  }
  keys() {
    return this._map.values();
  }
  values() {
    return this._map.values();
  }
  forEach(fn, thisArg) {
    this._map.forEach((k,v) => fn(v, v, this), thisArg);
  }
}


const MappedSet_prototype = MappedSet.prototype;
MappedSet_prototype[Symbol.iterator] = MappedSet_prototype.keys;
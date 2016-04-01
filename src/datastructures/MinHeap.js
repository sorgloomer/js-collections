import { compare } from "./utils";

function shift_down(items, index, comparison) {
  const grabbedValue = items[index];
  const length = items.length;

  for (;;) {
    var bestIndex = index;
    var bestValue = grabbedValue;

    const dindex = 2 * index;
    tryIndex(dindex + 1);
    tryIndex(dindex + 2);

    if (bestIndex !== index) {
      items[index] = bestValue;
      index = bestIndex;
    } else {
      break;
    }
  }
  items[index] = grabbedValue;

  function tryIndex(childIndex) {
    if (childIndex < length) {
      const childValue = items[childIndex];
      if (comparison(childValue, bestValue) < 0) {
        bestIndex = childIndex;
        bestValue = childValue;
      }
    }
  }
}

function shift_up(items, index, comparison) {
  const { floor } = Math;
  const grabbedValue = items[index];
  while (index > 0) {
    const parentIndex = floor((index - 1) / 2);
    const parentValue = items[parentIndex];
    if (comparison(grabbedValue, parentValue) < 0) {
      items[index] = parentValue;
      index = parentIndex;
    } else {
      break;
    }
  }
  items[index] = grabbedValue;
}

export function heap_add(items, comparison, item) {
  items.push(item);
  shift_up(items, items.length - 1, comparison);
}

export function heap_pop(items, comparison) {
  if (items.length > 1) {
    const result = items[0];
    items[0] = items.pop();
    shift_down(items, 0, comparison);
    return result;
  } else {
    return items.pop();
  }
}

export function heap_sort(items, comparison) {
  const heap = [], result = [];
  for (let i = 0; i < items.length; i++) {
    heap_add(heap, comparison, items[i]);
  }
  while (heap.length > 0) {
    result.push(heap_pop(heap, comparison));
  }
  return result;
}

export class MinHeap {
  constructor(comparison = compare) {
    this.comparison = comparison;
    this.items = [];
  }

  get size() { return this.items.length; }

  add(item) {
    heap_add(this.items, this.comparison, item);
  }

  pop() {
    heap_pop(this.items, this.comparison);
  }
}
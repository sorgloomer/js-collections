var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;

function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function shift_down(items, index, comparison) {
  var grabbedValue = items[index];
  var length = items.length;

  for (;;) {
    var bestIndex = index;
    var bestValue = grabbedValue;

    var dindex = 2 * index;
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
      var childValue = items[childIndex];
      if (comparison(childValue, bestValue) < 0) {
        bestIndex = childIndex;
        bestValue = childValue;
      }
    }
  }
}

function shift_up(items, index, comparison) {
  var floor = Math.floor;

  var grabbedValue = items[index];
  while (index > 0) {
    var parentIndex = floor((index - 1) / 2);
    var parentValue = items[parentIndex];
    if (comparison(grabbedValue, parentValue) < 0) {
      items[index] = parentValue;
      index = parentIndex;
    } else {
      break;
    }
  }
  items[index] = grabbedValue;
}

function heap_add(items, comparison, item) {
  items.push(item);
  shift_up(items, items.length - 1, comparison);
}

function heap_pop(items, comparison) {
  if (items.length > 1) {
    var result = items[0];
    items[0] = items.pop();
    shift_down(items, 0, comparison);
    return result;
  } else {
    return items.pop();
  }
}

function heap_sort(items, comparison) {
  var heap = [],
      result = [];
  for (var i = 0; i < items.length; i++) {
    heap_add(heap, comparison, items[i]);
  }
  while (heap.length > 0) {
    result.push(heap_pop(heap, comparison));
  }
  return result;
}

var MinHeap = function () {
  function MinHeap() {
    var comparison = arguments.length <= 0 || arguments[0] === undefined ? compare : arguments[0];
    babelHelpers.classCallCheck(this, MinHeap);

    this.comparison = comparison;
    this.items = [];
  }

  babelHelpers.createClass(MinHeap, [{
    key: "add",
    value: function add(item) {
      heap_add(this.items, this.comparison, item);
    }
  }, {
    key: "pop",
    value: function pop() {
      heap_pop(this.items, this.comparison);
    }
  }, {
    key: "size",
    get: function get() {
      return this.items.length;
    }
  }]);
  return MinHeap;
}();

/**
 * stable_stringify does not provide formatting options, so same strings will be generated for deep equal objects
 * every time
 * @param {*} obj The value to be stringified
 * @returns {*}
 */
function stable_stringify(obj) {
  var stringify = JSON.stringify;
  var isArray = Array.isArray;
  var objectKeys = Object.keys;

  var visited = new Set();

  function visit_ref(obj) {
    if (visited.has(obj)) {
      throw new TypeError("Converting circular structure to stable JSON");
    } else {
      visited.add(obj);
      return isArray(obj) ? visit_array(obj) : visit_object(obj);
    }
  }

  function visit_any(x) {
    return (typeof x === "undefined" ? "undefined" : babelHelpers.typeof(x)) === "object" && x ? visit_ref(x) : stringify(x);
  }

  function visit_array(arr) {
    var buffer = "[";
    for (var i = 0; i < arr.length; i++) {
      if (i > 0) {
        buffer += ",";
      }
      buffer += visit_any(arr[i]);
    }
    return buffer + "]";
  }

  function visit_object(obj) {
    // Here is the essential part which makes the serialization stable: .sort()
    var keys = objectKeys(obj).sort();
    var buffer = "{";
    for (var i = 0; i < keys.length; i++) {
      if (i > 0) {
        buffer += ",";
      }
      var key = keys[i];
      var value = obj[key];
      // key should always be a string
      buffer += stringify(key) + ":" + visit_any(value);
    }
    return buffer + "}";
  }

  return visit_any(obj);
}

function assertEqual(expected, actual) {
  if (expected !== actual) {
    throw new Error("assertEqual expected " + expected + " actual: " + actual);
  }
}

function assertEqualObj(expected, actual) {
  var sExpected = stable_stringify(expected);
  var sActual = stable_stringify(actual);
  if (sExpected !== sActual) {
    throw new Error("assertEqualObj expected " + expected + " actual: " + actual);
  }
}

function test_sort(items) {
  var ordered = heap_sort(items, compare);
  var expected = [].concat(babelHelpers.toConsumableArray(items)).sort(compare);
  assertEqualObj(expected, ordered);
}

var TESTS = {
  sjson_primitives: function sjson_primitives() {
    assertEqual('null', stable_stringify(null));
    assertEqual('5', stable_stringify(5));
    assertEqual('-5', stable_stringify(-5));
    assertEqual('5.4', stable_stringify(5.4));
    assertEqual('"asd"', stable_stringify("asd"));
    assertEqual('true', stable_stringify(true));
    assertEqual('false', stable_stringify(false));
  },
  sjson_object: function sjson_object() {
    assertEqual('{"a":1,"b":2}', stable_stringify({ b: 2, a: 1 }));
  },
  sjson_array: function sjson_array() {
    assertEqual('[4,5,{"a":1,"b":2},7]', stable_stringify([4, 5, { b: 2, a: 1 }, 7]));
  },
  heap_sortEmpty: function heap_sortEmpty() {
    test_sort([]);
  },
  heap_sortSingleton: function heap_sortSingleton() {
    test_sort([1]);
    test_sort([-2]);
    test_sort(['alma']);
    test_sort([null]);
  },
  heap_sortOrdered: function heap_sortOrdered() {
    test_sort([1, 2]);
    test_sort([1, 2, 3, 4, 5]);
    test_sort([100, 200, 450, 1000, 10000]);
    test_sort([-100000, -1000, -100, 0, 10, 20]);
  },
  heap_sortReversed: function heap_sortReversed() {
    test_sort([2, 1]);
    test_sort([5, 4, 3, 2, 1, 0, -1]);
  },
  heap_sortRandom: function heap_sortRandom() {
    test_sort([4532, 1053, 9775, 8761, 503, 714, 289, 8306, 6581, 7303, 2188, 8826, 187, 570, 828, 7899, 2497, 9828, 4311, 4992]);
  },
  heap_sortBigRandom: function heap_sortBigRandom() {
    var items = [];
    function lcg(x) {
      return x * 879547 % 10000;
    }
    for (var i = 0; i < 1000; i++) {
      items.push(lcg(lcg(lcg(i))));
    }test_sort(items);
  }
};

function test_all() {
  Object.keys(TESTS).forEach(function (testName) {
    TESTS[testName]();
    console.log("Test " + testName + " passed");
  });
}

function run() {
  test_all();
}

exports.run = run;
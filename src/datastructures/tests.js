
import { heap_sort } from "./MinHeap";
import { stable_stringify } from "./stable-json";
import { compare } from "./utils";


function assertEqual(expected, actual) {
  if (expected !== actual) {
    throw new Error("assertEqual expected " + expected + " actual: " + actual);
  }
}

function assertEqualObj(expected, actual) {
  const sExpected = stable_stringify(expected);
  const sActual = stable_stringify(actual);
  if (sExpected !== sActual) {
    throw new Error("assertEqualObj expected " + expected + " actual: " + actual);
  }
}

function test_sort(items) {
  const ordered = heap_sort(items, compare);
  const expected = [...items].sort(compare);
  assertEqualObj(expected, ordered);
}


const TESTS = {
  sjson_primitives() {
    assertEqual('null', stable_stringify(null));
    assertEqual('5', stable_stringify(5));
    assertEqual('-5', stable_stringify(-5));
    assertEqual('5.4', stable_stringify(5.4));
    assertEqual('"asd"', stable_stringify("asd"));
    assertEqual('true', stable_stringify(true));
    assertEqual('false', stable_stringify(false));
  },
  sjson_object() {
    assertEqual(
      '{"a":1,"b":2}',
      stable_stringify({b:2,a:1})
    );
  },
  sjson_array() {
    assertEqual(
      '[4,5,{"a":1,"b":2},7]',
      stable_stringify([4, 5, {b:2,a:1}, 7])
    );
  },
  heap_sortEmpty() {
    test_sort([]);
  },
  heap_sortSingleton() {
    test_sort([1]);
    test_sort([-2]);
    test_sort(['alma']);
    test_sort([null]);
  },
  heap_sortOrdered() {
    test_sort([1, 2]);
    test_sort([1, 2, 3, 4, 5]);
    test_sort([100, 200, 450, 1000, 10000]);
    test_sort([-100000, -1000, -100, 0, 10, 20]);
  },
  heap_sortReversed() {
    test_sort([2, 1]);
    test_sort([5, 4, 3, 2, 1, 0, -1]);
  },
  heap_sortRandom() {
    test_sort([4532, 1053, 9775, 8761, 503, 714, 289, 8306, 6581, 7303,
      2188, 8826, 187, 570, 828, 7899, 2497, 9828, 4311, 4992]);
  },
  heap_sortBigRandom() {
    const items = [];
    function lcg(x) { return x * 879547 % 10000; }
    for (let i = 0; i < 1000; i++) items.push(lcg(lcg(lcg(i))));
    test_sort(items);
  }
};

function test_all() {
  Object.keys(TESTS).forEach(testName => {
    TESTS[testName]();
    console.log("Test " + testName + " passed");
  });
}

function run() {
  test_all();
}

exports.run = run;

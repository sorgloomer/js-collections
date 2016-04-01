/**
 * stable_stringify does not provide formatting options, so same strings will be generated for deep equal objects
 * every time
 * @param {*} obj The value to be stringified
 * @returns {*}
 */
export function stable_stringify(obj) {
  const { stringify } = JSON;
  const { isArray } = Array;
  const { keys: objectKeys } = Object;
  const visited = new Set();


  function visit_ref(obj) {
    if (visited.has(obj)) {
      throw new TypeError("Converting circular structure to stable JSON");
    } else {
      visited.add(obj);
      return isArray(obj) ? visit_array(obj) : visit_object(obj);
    }
  }

  function visit_any(x) {
    return typeof x === "object" && x ? visit_ref(x) : stringify(x);
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
    const keys = objectKeys(obj).sort();
    var buffer = "{";
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) {
        buffer += ",";
      }
      const key = keys[i];
      const value = obj[key];
      // key should always be a string
      buffer += stringify(key) + ":" + visit_any(value);
    }
    return buffer + "}";
  }

  return visit_any(obj);
}
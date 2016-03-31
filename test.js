
const done = require("./build/done.js").done;

const build = require("./build/index.js");
done(build.build_tests().then(() => {
  const tests = require("./dist/tests.js");
  tests.run();
}));

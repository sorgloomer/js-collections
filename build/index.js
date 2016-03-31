

function build_tests() {
  return require("rollup").rollup({
    entry: "src/algorithm/tests.js",
    plugins: [
      require("rollup-plugin-babel")({
        "presets": ["es2015-rollup"]
      })
    ]
  }).then(bundle => {
    require("fs").writeFileSync("./dist/tests.js", bundle.generate().code);
  });
}

exports.build_tests = build_tests;
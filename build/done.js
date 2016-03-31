
exports.done = function done(p) {
  p.then(null, e => setTimeout(() => { throw e; }, 1));
};

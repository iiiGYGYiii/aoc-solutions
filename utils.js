const { performance } = require("perf_hooks");

function checkPerformance(wrappedFunction) {
  const start = performance.now();
  const ret = wrappedFunction();
  const end = performance.now();
  console.log(`Function executed within ${end - start}ms.`);
  return ret;
}

module.exports = {
  checkPerformance,
};

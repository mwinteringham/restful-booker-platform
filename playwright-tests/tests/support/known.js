// Marks a test as a known defect: it asserts the CORRECT behaviour, so it fails today.
// Playwright's test.fail() keeps the suite green while the defect exists and turns the test
// red as soon as the defect is fixed (a reminder to remove the marker).
// Run with SHOW_DEFECTS=1 to see the real failures instead.
function knownDefect(test, reason) {
  if (!process.env.SHOW_DEFECTS) test.fail(true, reason);
}

module.exports = { knownDefect };

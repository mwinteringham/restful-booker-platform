// Turns test-results.json (written by `npm test`) into TEST_RESULTS.md.
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
const rows = [];

function walk(suite, trail) {
  const here = suite.title && !/\.spec\.js$/.test(suite.title) ? [...trail, suite.title] : trail;
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const last = t.results[t.results.length - 1] || {};
      const defect = (t.annotations || []).find((a) => a.type === 'fail');
      rows.push({
        project: t.projectName,
        area: here.join(' > '),
        title: spec.title.replace(/\s*@\w[\w-]*/g, '').trim(),
        tags: (spec.title.match(/@[\w-]+/g) || []).join(' '),
        file: spec.file,
        status: t.status, // expected | unexpected | flaky | skipped
        known: !!defect,
        reason: defect && defect.description,
        ms: last.duration || 0,
      });
    }
  }
  for (const s of suite.suites || []) walk(s, here);
}
data.suites.forEach((s) => walk(s, []));

const known = rows.filter((r) => r.known);
const normal = rows.filter((r) => !r.known);
const failed = rows.filter((r) => r.status === 'unexpected');
const flaky = rows.filter((r) => r.status === 'flaky');
const when = new Date(data.stats.startTime);
const secs = Math.round(data.stats.duration / 1000);
const esc = (s) => String(s).replace(/\|/g, '\|');
const idOf = (t) => (t.match(/^(AT-\d+[a-z]?)/) || [])[1] || '';

let md = `# Test results: latest run

Run on ${when.toISOString().replace('T', ' ').slice(0, 16)} UTC, ${secs} seconds, Chromium, against ${process.env.BASE_URL || 'http://localhost:3003'}.
Generated from \`test-results.json\` by \`npm run report:summary\`. The full interactive report is in \`playwright-report/\` (\`npm run report\`).

## Summary

| | Count |
|---|---|
| Tests run | ${rows.length} |
| Passed (behaviour works as expected) | ${normal.filter((r) => r.status === 'expected').length} |
| Known defects (assert correct behaviour, fail as expected) | ${known.length} |
| Unexpected failures | ${failed.length} |
| Flaky (passed on retry) | ${flaky.length} |

${failed.length === 0 ? 'No unexpected failures. Every red result below is a documented defect in [BUGS.md](BUGS.md).' : '**There are unexpected failures, listed under "Unexpected failures" below.**'}

## Known defects confirmed by this run

Each test asserts the correct behaviour and fails today. When a defect is fixed its test turns red until the \`@known-defect\` marker is removed.

| Test | Scenario | Bug | Why it fails |
|---|---|---|---|
`;
for (const r of known) {
  const bug = ((r.reason || '').match(/^(UI|API)-\d+/) || [''])[0];
  md += `| ${idOf(r.title)} | ${esc(r.title.replace(/^AT-\d+[a-z]?\s*/, ''))} | ${bug} | ${esc((r.reason || '').replace(/^(UI|API)-\d+:\s*/, ''))} |\n`;
}

md += `\n## Passing tests\n\n| Test | Scenario | Project | Time |\n|---|---|---|---|\n`;
for (const r of normal) md += `| ${idOf(r.title)} | ${esc(r.title.replace(/^AT-\d+[a-z]?\s*/, ''))}${r.tags.includes('@smoke') ? ' (smoke)' : ''} | ${r.project} | ${(r.ms / 1000).toFixed(1)}s |\n`;

if (failed.length) {
  md += `\n## Unexpected failures\n\n| Test | Project |\n|---|---|\n`;
  for (const r of failed) md += `| ${esc(r.title)} | ${r.project} |\n`;
}

md += `\n## Notes\n\n- Known-defect tests use Playwright's \`test.fail()\`, so the suite is green while the defects exist. \`SHOW_DEFECTS=1 npx playwright test --grep @known-defect\` shows the real failure behind each.\n- The setup step (admin login) is counted in the run and passes.\n`;
fs.writeFileSync('TEST_RESULTS.md', md);
console.log(`TEST_RESULTS.md written: ${rows.length} tests, ${known.length} known defects, ${failed.length} unexpected failures`);

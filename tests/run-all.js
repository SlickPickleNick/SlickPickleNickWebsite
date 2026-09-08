#!/usr/bin/env node

/**
 * Unified Test Suite Runner for SlickPickleNick Website
 * Runs all test files in sequence and produces a clean formatted summary dashboard.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const testSuites = [
  { name: 'Data Integrity & Schemas', file: 'data-integrity.test.js' },
  { name: 'HTML Structure & Semantics', file: 'html-structure.test.js' },
  { name: 'Accessibility & WCAG AA Compliance', file: 'a11y-compliance.test.js' },
  { name: 'CSS Tokens & Contrast Ratios', file: 'css-tokens.test.js' },
  { name: 'JavaScript Logic & Modules', file: 'js-modules.test.js' }
];

console.log('\n======================================================');
console.log('   🚀 SLICKPICKLENICK WEBSITE - AUTOMATED TEST SUITE');
console.log('======================================================\n');

let totalSuites = testSuites.length;
let passedSuites = 0;
let failedSuites = 0;
const results = [];
const overallStartTime = Date.now();

for (const suite of testSuites) {
  const filePath = path.join(__dirname, suite.file);
  const startTime = Date.now();

  process.stdout.write(` Running: ${suite.name} (${suite.file})... `);

  const result = spawnSync(process.execPath, ['--test', filePath], {
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'test' }
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (result.status === 0) {
    passedSuites++;
    console.log(`\x1b[32mPASSED\x1b[0m (${duration}s)`);
    results.push({ name: suite.name, file: suite.file, passed: true, duration });
  } else {
    failedSuites++;
    console.log(`\x1b[31mFAILED\x1b[0m (${duration}s)`);
    results.push({
      name: suite.name,
      file: suite.file,
      passed: false,
      duration,
      output: result.stderr || result.stdout
    });
  }
}

const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);

console.log('\n======================================================');
console.log('                    TEST SUMMARY');
console.log('======================================================');
console.log(` Total Suites:  ${totalSuites}`);
console.log(` \x1b[32mPassed:\x1b[0m        ${passedSuites}`);
console.log(` \x1b[31mFailed:\x1b[0m        ${failedSuites}`);
console.log(` Total Time:    ${totalDuration}s`);
console.log('------------------------------------------------------');

if (failedSuites > 0) {
  console.log('\n❌ \x1b[31mFailure Details:\x1b[0m\n');
  results
    .filter(r => !r.passed)
    .forEach(f => {
      console.log(`--- [${f.name} - ${f.file}] ---`);
      console.log(f.output);
    });
  console.log('======================================================\n');
  process.exit(1);
} else {
  console.log('\n✅ \x1b[32mAll test suites passed successfully! The website is working as expected.\x1b[0m\n');
  console.log('======================================================\n');
  process.exit(0);
}

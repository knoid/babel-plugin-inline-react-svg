import { transformFile } from 'babel-core';
import fs from 'fs';
import path from 'path';

function assertReactImport(result) {
  const match = result.code.match(/import React from 'react'/g);
  if (!match) {
    throw new Error('no React import found');
  }
  if (match.length !== 1) {
    throw new Error(`more or less than one match found: ${match}\n${result.code}`);
  }
}

transformFile('test/fixtures/test.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  assertReactImport(result);
  console.log('test/fixtures/test.jsx', result.code);
});

transformFile('test/fixtures/test-multiple-svg.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  assertReactImport(result);
  console.log('test/fixtures/test-multiple-svg.jsx', result.code);
});

transformFile('test/fixtures/test-no-react.jsx', {
  babelrc: false,
  presets: ['react'],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  console.log('test/fixtures/test-no-react.jsx', result.code);
  assertReactImport(result);
});

if (fs.existsSync(path.resolve('./PACKAGE.JSON'))) {
  transformFile('test/fixtures/test-case-sensitive.jsx', {
    babelrc: false,
    presets: ['react'],
    plugins: [
      ['../../src/index', {
        caseSensitive: true,
      }],
    ],
  }, (err) => {
    if (err && err.message.indexOf('match case') !== -1) {
      console.log('test/fixtures/test-case-sensitive.jsx', 'Test passed: Expected case sensitive error was thrown');
    } else {
      throw new Error("Test failed: Expected case sensitive error wasn't thrown");
    }
  });
} else {
  console.log('# SKIP: case-sensitive check; on a case-sensitive filesystem');
}

transformFile('test/fixtures/test-no-svg-or-react.js', {
  babelrc: false,
  presets: [],
  plugins: [
    '../../src/index',
  ],
}, (err, result) => {
  if (err) throw err;
  console.log('test/fixtures/test-no-svg-or-react.js', result.code);
  if (/React/.test(result.code)) {
    throw new Error('Test failed: React import was present');
  }
});
